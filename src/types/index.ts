export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'operator'
  avatarUrl?: string
  company?: string
  createdAt: string
  updatedAt: string
}

export interface QuotationInput {
  name?: string
  cargoType: 'lotacao' | 'fracionada' | 'container'
  originUf: string
  destinationUf: string
  distance: number
  vehicleType?: string
  weight: number
  invoiceValue: number
  useTable: boolean
  applyTaxOnCosts: boolean
  applyMarkup: boolean
  suggestedFreight?: number
  informedFreight?: number
  freightValue?: number
  gris?: number
  tso?: number
  negotiatedFreight?: number
  markupValue?: number
  loadingCost?: number
  unloadingCost?: number
  equipmentRent?: number
  toll?: number
}

export interface QuotationResult {
  finalFreight: number
  grossMarginValue: number
  grossMarginPercent: number
  isViable: boolean
  calculatedRevenue: number
  adjustedRevenue: number
  totalOperationalCosts: number
  taxBase: number
  icmsRate: number
  icmsValue: number
  pisValue: number
  cofinsValue: number
  netMargin: number
}

export interface Quotation extends QuotationInput, QuotationResult {
  id: string
  userId: string
  createdAt: string
  isFavorite: boolean
  status: 'draft' | 'calculated' | 'saved' | 'exported'
}

export interface TopRoute {
  origin: string
  destination: string
  count: number
}

export interface DashboardStats {
  totalQuotations: number
  averageMargin: number
  averageTicket: number
  favoriteQuotations: number
  marginTrend: { date: string; margin: number }[]
  cargoDistribution: { name: string; value: number; fill: string }[]
  recentQuotations: Quotation[]
  topRoutes: TopRoute[]
}

export interface TableVersion {
  id: string
  tableName: string
  version: string
  effectiveDate: string
  fileName: string
  recordsCount: number
  uploadedBy: string
  isActive: boolean
}

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  target: string
  details: string
}

export interface SchemaField {
  name: string
  type: string
  description: string
}
