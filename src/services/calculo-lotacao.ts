import { supabase } from '@/lib/supabase/client'
import { TarifaNTC, QuotationInput, QuotationResult } from '@/types'
import { ValePedagioService } from './vale-pedagio'

export async function buscarTarifaNTC(
  distancia: number,
  tipoVeiculo: string,
): Promise<TarifaNTC> {
  const startTime = Date.now()
  try {
    // Use RPC to get the correct rate based on distance and vehicle
    const { data, error } = await supabase.rpc('get_ntc_lotacao_rate', {
      distance: distancia,
      vehicle: tipoVeiculo,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data || data.length === 0) {
      throw new Error(
        'Nenhuma tarifa NTC encontrada para esta distância e veículo.',
      )
    }

    const tarifa = data[0]

    await logIntegracao(
      'get_ntc_lotacao_rate',
      'RPC',
      { distancia, tipoVeiculo },
      tarifa,
      200,
      Date.now() - startTime,
    )

    return {
      faixa_inicial: 0, // Not returned by RPC, not critical for calculation
      faixa_final: 0,
      custo_peso_rs_ton: tarifa.price_per_ton,
      custo_valor_percent: tarifa.freight_value_percent,
      gris_percent: tarifa.gris_percent,
      tso_percent: tarifa.tso_percent,
    }
  } catch (err: any) {
    await logIntegracao(
      'get_ntc_lotacao_rate',
      'RPC',
      { distancia, tipoVeiculo },
      { error: err.message },
      500,
      Date.now() - startTime,
    )
    throw err
  }
}

export async function buscarAliquotaICMS(
  ufOrigem: string,
  ufDestino: string,
): Promise<number> {
  const startTime = Date.now()
  try {
    const { data, error } = await supabase.rpc('get_icms_rate', {
      uf_origem: ufOrigem,
      uf_destino: ufDestino,
    })

    if (error) throw new Error(error.message)

    await logIntegracao(
      'get_icms_rate',
      'RPC',
      { ufOrigem, ufDestino },
      { rate: data },
      200,
      Date.now() - startTime,
    )
    return data
  } catch (err: any) {
    await logIntegracao(
      'get_icms_rate',
      'RPC',
      { ufOrigem, ufDestino },
      { error: err.message },
      500,
      Date.now() - startTime,
    )
    // Fallback default
    return 12
  }
}

export async function buscarCashback(ufDestino: string): Promise<number> {
  const startTime = Date.now()
  try {
    const { data, error } = await supabase
      .from('cashback_rules')
      .select('percentage')
      .eq('uf', ufDestino)
      .single()

    if (error) return 0 // No cashback found is not an error

    await logIntegracao(
      'cashback_rules',
      'SELECT',
      { ufDestino },
      data,
      200,
      Date.now() - startTime,
    )
    return data.percentage || 0
  } catch (err: any) {
    await logIntegracao(
      'cashback_rules',
      'SELECT',
      { ufDestino },
      { error: err.message },
      500,
      Date.now() - startTime,
    )
    return 0
  }
}

async function logIntegracao(
  endpoint: string,
  method: string,
  request: any,
  response: any,
  status: number,
  duration: number,
) {
  try {
    await supabase.from('integration_logs').insert({
      endpoint,
      method,
      request_payload: request,
      response_payload: response,
      status_code: status,
      duration_ms: duration,
    })
  } catch (e) {
    console.error('Failed to log integration', e)
  }
}

export async function calcularFreteLotacao(
  input: QuotationInput,
): Promise<QuotationResult> {
  // 1. Get Tariff
  let tariff: TarifaNTC | null = null
  if (input.useTable) {
    tariff = await buscarTarifaNTC(input.distance, input.vehicleType || 'truck')
  }

  // 2. Get ICMS
  const icmsRate = await buscarAliquotaICMS(input.originUf, input.destinationUf)

  // 3. Calculate Toll (Vale Pedágio)
  // If toll is not manually provided, calculate it
  let tollValue = input.toll || 0
  if (!input.toll && input.vehicleType) {
    try {
      // Estimate axes based on vehicle type for calculation
      let axes = 2
      if (input.vehicleType === 'truck') axes = 3
      if (input.vehicleType === 'carreta') axes = 5

      tollValue = await ValePedagioService.calculateCost(
        input.originUf, // Using UF as proxy for city for this mock, ideally would be city
        input.destinationUf,
        input.vehicleType,
        axes,
      )
    } catch (e) {
      console.warn('Failed to calculate toll automatically', e)
      // Continue with 0 or handle error? User story says "handle various edge cases gracefully"
      // We keep 0 and maybe the UI shows a warning if needed, but we don't block calculation
    }
  }

  // 4. Calculate Revenue (Freight)
  let revenue = 0
  if (input.useTable && tariff) {
    const weightTon = input.weight / 1000
    const freightWeight = weightTon * tariff.custo_peso_rs_ton
    const freightValue = input.invoiceValue * (tariff.custo_valor_percent / 100)
    const gris = input.invoiceValue * (tariff.gris_percent / 100)
    const tso = input.invoiceValue * (tariff.tso_percent / 100)

    revenue = freightWeight + freightValue + gris + tso
  } else {
    revenue = input.informedFreight || 0
  }

  // 5. Calculate Costs
  const operationalCosts =
    (input.loadingCost || 0) +
    (input.unloadingCost || 0) +
    (input.equipmentRent || 0) +
    tollValue

  // 6. Calculate Taxes
  const icmsValue = revenue * (icmsRate / 100)
  const pisCofinsRate = 0.0365 // 3.65%
  const pisCofinsValue = revenue * pisCofinsRate
  const pisValue = revenue * 0.0065
  const cofinsValue = revenue * 0.03

  const totalTaxes = icmsValue + pisCofinsValue

  // 7. Calculate Margin
  const totalCosts = operationalCosts + totalTaxes
  const grossMarginValue = revenue - totalCosts
  const grossMarginPercent =
    revenue > 0 ? (grossMarginValue / revenue) * 100 : 0

  // 8. Cashback (Optional logic)
  await buscarCashback(input.destinationUf)

  return {
    finalFreight: revenue,
    grossMarginValue,
    grossMarginPercent,
    isViable: grossMarginPercent >= 10,
    calculatedRevenue: revenue,
    adjustedRevenue: revenue,
    totalOperationalCosts: operationalCosts,
    taxBase: revenue,
    icmsRate,
    icmsValue,
    pisValue,
    cofinsValue,
    netMargin: grossMarginValue * 0.85, // Assuming 15% admin costs
  }
}
