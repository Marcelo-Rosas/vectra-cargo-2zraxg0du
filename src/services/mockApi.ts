import {
  DashboardStats,
  Quotation,
  QuotationInput,
  QuotationResult,
  TableVersion,
  AuditLog,
} from '@/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  calculateQuotation: async (
    input: QuotationInput,
  ): Promise<QuotationResult> => {
    await delay(800)

    // Mock calculation logic
    const revenue = input.useTable
      ? input.suggestedFreight || 0
      : input.informedFreight || 0

    const operationalCosts =
      (input.loadingCost || 0) +
      (input.unloadingCost || 0) +
      (input.equipmentRent || 0) +
      (input.toll || 0)
    const taxRate = 0.12 // Mock ICMS
    const taxValue = revenue * taxRate
    const pisCofins = revenue * 0.0365

    const totalCosts = operationalCosts + taxValue + pisCofins
    const marginValue = revenue - totalCosts
    const marginPercent = revenue > 0 ? (marginValue / revenue) * 100 : 0

    return {
      finalFreight: revenue,
      grossMarginValue: marginValue,
      grossMarginPercent: marginPercent,
      isViable: marginPercent >= 10,
      calculatedRevenue: revenue,
      adjustedRevenue: revenue,
      totalOperationalCosts: operationalCosts,
      taxBase: revenue,
      icmsRate: taxRate * 100,
      icmsValue: taxValue,
      pisValue: revenue * 0.0065,
      cofinsValue: revenue * 0.03,
      netMargin: marginValue * 0.85, // Mock net
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(600)
    return {
      totalQuotations: 1248,
      averageMargin: 18.5,
      averageTicket: 4250.0,
      favoriteQuotations: 42,
      marginTrend: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(
          Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
        ).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        margin: 15 + Math.random() * 10,
      })),
      cargoDistribution: [
        { name: 'Lotação', value: 45, fill: 'hsl(var(--chart-1))' },
        { name: 'Fracionada', value: 30, fill: 'hsl(var(--chart-2))' },
        { name: 'Container', value: 25, fill: 'hsl(var(--chart-3))' },
      ],
      recentQuotations: Array.from({ length: 5 }, (_, i) => ({
        id: `q-${i}`,
        userId: '1',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        name: `Cotação SP-RJ #${1000 + i}`,
        cargoType: i % 2 === 0 ? 'lotacao' : 'fracionada',
        originUf: 'SP',
        destinationUf: 'RJ',
        distance: 450,
        weight: 12000,
        invoiceValue: 50000,
        useTable: true,
        applyTaxOnCosts: false,
        applyMarkup: false,
        finalFreight: 3500 + Math.random() * 1000,
        grossMarginValue: 500,
        grossMarginPercent: 15 + Math.random() * 5,
        isViable: true,
        calculatedRevenue: 3500,
        adjustedRevenue: 3500,
        totalOperationalCosts: 2500,
        taxBase: 3500,
        icmsRate: 12,
        icmsValue: 420,
        pisValue: 50,
        cofinsValue: 100,
        netMargin: 400,
        isFavorite: i === 0,
        status: 'saved',
      })),
    }
  },

  getTableVersions: async (): Promise<TableVersion[]> => {
    await delay(500)
    return [
      {
        id: '1',
        tableName: 'NTC Lotação',
        version: 'v2024.1',
        effectiveDate: '2024-01-01',
        fileName: 'ntc_lotacao_jan24.csv',
        recordsCount: 1500,
        uploadedBy: 'Admin User',
        isActive: true,
      },
      {
        id: '2',
        tableName: 'NTC Lotação',
        version: 'v2023.4',
        effectiveDate: '2023-10-01',
        fileName: 'ntc_lotacao_out23.csv',
        recordsCount: 1450,
        uploadedBy: 'Admin User',
        isActive: false,
      },
    ]
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    await delay(500)
    return [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        user: 'Carlos Silva',
        action: 'Criação',
        target: 'Cotação #1005',
        details: 'Criou nova cotação SP->MG',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'Admin User',
        action: 'Upload',
        target: 'Tabela NTC',
        details: 'Upload nova versão v2024.1',
      },
    ]
  },
}
