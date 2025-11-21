import { supabase } from '@/lib/supabase/client'
import { Quotation } from '@/types'

export class QuotationService {
  static async save(
    quotation: Omit<Quotation, 'id' | 'createdAt'>,
  ): Promise<Quotation> {
    const { data, error } = await supabase
      .from('freight_quotations')
      .insert({
        user_id: quotation.userId,
        quotation_name: quotation.name,
        cargo_type: quotation.cargoType,
        origin_uf: quotation.originUf,
        destination_uf: quotation.destinationUf,
        distance_km: quotation.distance,
        vehicle_type: quotation.vehicleType,
        cargo_weight: quotation.weight,
        invoice_value: quotation.invoiceValue,
        use_table: quotation.useTable,
        apply_tax_on_costs: quotation.applyTaxOnCosts,
        apply_markup: quotation.applyMarkup,
        suggested_freight: quotation.suggestedFreight,
        informed_freight: quotation.informedFreight,
        freight_value: quotation.freightValue,
        gris: quotation.gris,
        tso: quotation.tso,
        negotiated_freight: quotation.negotiatedFreight,
        markup_value: quotation.markupValue,
        loading_cost: quotation.loadingCost,
        unloading_cost: quotation.unloadingCost,
        equipment_rent: quotation.equipmentRent,
        toll: quotation.toll,
        final_freight: quotation.finalFreight,
        gross_margin: quotation.grossMarginValue,
        gross_margin_percent: quotation.grossMarginPercent,
        is_favorite: quotation.isFavorite,
        calculated_revenue: quotation.calculatedRevenue,
        adjusted_revenue: quotation.adjustedRevenue,
        operational_costs: quotation.totalOperationalCosts,
        tax_base: quotation.taxBase,
        icms_percent: quotation.icmsRate,
        icms_value: quotation.icmsValue,
        total_costs:
          quotation.totalOperationalCosts +
          quotation.icmsValue +
          quotation.pisValue +
          quotation.cofinsValue, // Approx
        notes: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving quotation:', error)
      throw new Error('Erro ao salvar cotação no banco de dados.')
    }

    return this.mapToQuotation(data)
  }

  private static mapToQuotation(data: any): Quotation {
    return {
      id: data.id,
      userId: data.user_id,
      createdAt: data.created_at,
      name: data.quotation_name,
      cargoType: data.cargo_type as any,
      originUf: data.origin_uf,
      destinationUf: data.destination_uf,
      distance: data.distance_km,
      vehicleType: data.vehicle_type,
      weight: data.cargo_weight,
      invoiceValue: data.invoice_value,
      useTable: data.use_table,
      applyTaxOnCosts: data.apply_tax_on_costs,
      applyMarkup: data.apply_markup,
      suggestedFreight: data.suggested_freight,
      informedFreight: data.informed_freight,
      freightValue: data.freight_value,
      gris: data.gris,
      tso: data.tso,
      negotiatedFreight: data.negotiated_freight,
      markupValue: data.markup_value,
      loadingCost: data.loading_cost,
      unloadingCost: data.unloading_cost,
      equipmentRent: data.equipment_rent,
      toll: data.toll,
      finalFreight: data.final_freight,
      grossMarginValue: data.gross_margin,
      grossMarginPercent: data.gross_margin_percent,
      isViable: (data.gross_margin_percent || 0) >= 10,
      calculatedRevenue: data.calculated_revenue,
      adjustedRevenue: data.adjusted_revenue,
      totalOperationalCosts: data.operational_costs,
      taxBase: data.tax_base,
      icmsRate: data.icms_percent,
      icmsValue: data.icms_value,
      pisValue: 0, // Not stored explicitly in DB schema provided, calculated on fly or part of total
      cofinsValue: 0, // Not stored explicitly
      netMargin: 0, // Calculated
      isFavorite: data.is_favorite,
      status: 'saved',
    }
  }
}
