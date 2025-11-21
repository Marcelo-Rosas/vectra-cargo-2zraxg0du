import { supabase } from '@/lib/supabase'
import { TarifaNTC, QuotationInput, QuotationResult } from '@/types'

export async function buscarTarifaNTC(
  distancia: number,
  tipoVeiculo: string,
): Promise<TarifaNTC> {
  const startTime = Date.now()
  try {
    // Query ntc_lotacao table directly
    const { data, error } = await supabase
      .from('ntc_lotacao')
      .select('*')
      .eq('is_active', true)
      .lte('distance_min', distancia)
      .gte('distance_max', distancia)
      .order('version_date', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      throw new Error(
        error?.message || 'Nenhuma tarifa encontrada para esta distância',
      )
    }

    await logIntegracao(
      'ntc_lotacao',
      'SELECT',
      { distancia, tipoVeiculo },
      data,
      200,
      Date.now() - startTime,
    )

    return {
      faixa_inicial: data.distance_min,
      faixa_final: data.distance_max,
      custo_peso_rs_ton: data.price_per_ton,
      custo_valor_percent: data.freight_value_percent,
      gris_percent: data.gris_percent,
      tso_percent: data.tso_percent,
    }
  } catch (err: any) {
    await logIntegracao(
      'ntc_lotacao',
      'SELECT',
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
      .from('cashback_uf')
      .select('percentage')
      .eq('uf', ufDestino)
      .single()

    if (error) return 0 // No cashback found is not an error

    await logIntegracao(
      'cashback_uf',
      'SELECT',
      { ufDestino },
      data,
      200,
      Date.now() - startTime,
    )
    return data.percentage || 0
  } catch (err: any) {
    await logIntegracao(
      'cashback_uf',
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
    await supabase.from('integracoes_log').insert({
      endpoint,
      method,
      request_payload: request,
      response_payload: response,
      status_code: status,
      duration_ms: duration,
      created_at: new Date().toISOString(),
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

  // 3. Calculate Revenue (Freight)
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

  // 4. Calculate Costs
  const operationalCosts =
    (input.loadingCost || 0) +
    (input.unloadingCost || 0) +
    (input.equipmentRent || 0) +
    (input.toll || 0)

  // 5. Calculate Taxes
  const icmsValue = revenue * (icmsRate / 100)
  const pisCofinsRate = 0.0365 // 3.65%
  const pisCofinsValue = revenue * pisCofinsRate
  const pisValue = revenue * 0.0065
  const cofinsValue = revenue * 0.03

  const totalTaxes = icmsValue + pisCofinsValue

  // 6. Calculate Margin
  const totalCosts = operationalCosts + totalTaxes
  const grossMarginValue = revenue - totalCosts
  const grossMarginPercent =
    revenue > 0 ? (grossMarginValue / revenue) * 100 : 0

  // 7. Cashback (Optional logic, just logging it for now as per user story requirement to integrate lookup)
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
