import {
  DashboardStats,
  Quotation,
  QuotationInput,
  QuotationResult,
  TableVersion,
  AuditLog,
  User,
} from '@/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock Data Stores
let users: User[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos@vectracargo.com',
    role: 'manager',
    company: 'Vectra Cargo',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  },
  {
    id: '2',
    name: 'Ana Souza',
    email: 'ana@vectracargo.com',
    role: 'admin',
    company: 'Vectra Cargo',
    createdAt: '2023-11-20T14:30:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
  },
  {
    id: '3',
    name: 'João Pereira',
    email: 'joao@transportes.com',
    role: 'operator',
    company: 'Transportes Pereira',
    createdAt: '2024-03-10T08:45:00Z',
    updatedAt: '2024-03-10T08:45:00Z',
    avatarUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
  },
]

const quotations: Quotation[] = Array.from({ length: 15 }, (_, i) => ({
  id: `q-${i}`,
  userId: '1',
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  name: `Cotação SP-RJ #${1000 + i}`,
  cargoType: i % 3 === 0 ? 'lotacao' : i % 3 === 1 ? 'fracionada' : 'container',
  originUf: i % 2 === 0 ? 'SP' : 'MG',
  destinationUf: i % 2 === 0 ? 'RJ' : 'BA',
  distance: 450 + i * 10,
  weight: 12000 + i * 100,
  invoiceValue: 50000 + i * 1000,
  useTable: true,
  applyTaxOnCosts: false,
  applyMarkup: false,
  finalFreight: 3500 + Math.random() * 1000,
  grossMarginValue: 500 + Math.random() * 200,
  grossMarginPercent: 15 + Math.random() * 5 - (i % 5 === 0 ? 10 : 0), // Some low margins
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
}))

export const mockApi = {
  calculateQuotation: async (
    input: QuotationInput,
  ): Promise<QuotationResult> => {
    await delay(800)

    const revenue = input.useTable
      ? input.suggestedFreight || 0
      : input.informedFreight || 0

    const operationalCosts =
      (input.loadingCost || 0) +
      (input.unloadingCost || 0) +
      (input.equipmentRent || 0) +
      (input.toll || 0)
    const taxRate = 0.12
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
      netMargin: marginValue * 0.85,
    }
  },

  saveQuotation: async (quotation: Quotation): Promise<void> => {
    await delay(500)
    quotations.unshift(quotation)
  },

  getDashboardStats: async (
    period: string = '30d',
  ): Promise<DashboardStats> => {
    await delay(600)
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30

    return {
      totalQuotations: 1248,
      averageMargin: 18.5,
      averageTicket: 4250.0,
      favoriteQuotations: 42,
      marginTrend: Array.from({ length: days }, (_, i) => ({
        date: new Date(
          Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000,
        ).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        margin: 15 + Math.random() * 10,
      })),
      cargoDistribution: [
        { name: 'Lotação', value: 45, fill: 'hsl(var(--chart-1))' },
        { name: 'Fracionada', value: 30, fill: 'hsl(var(--chart-2))' },
        { name: 'Container', value: 25, fill: 'hsl(var(--chart-3))' },
      ],
      recentQuotations: quotations.slice(0, 5),
      topRoutes: [
        { origin: 'SP', destination: 'RJ', count: 150 },
        { origin: 'MG', destination: 'SP', count: 120 },
        { origin: 'SP', destination: 'BA', count: 90 },
        { origin: 'RS', destination: 'SP', count: 85 },
        { origin: 'PR', destination: 'SC', count: 60 },
      ],
    }
  },

  getQuotations: async (): Promise<Quotation[]> => {
    await delay(500)
    return [...quotations]
  },

  getQuotationById: async (id: string): Promise<Quotation | undefined> => {
    await delay(200)
    return quotations.find((q) => q.id === id)
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

  // User Management
  getUsers: async (): Promise<User[]> => {
    await delay(400)
    return [...users]
  },

  createUser: async (
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> => {
    await delay(400)
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatarUrl: `https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${Math.floor(Math.random() * 100)}`,
    }
    users.push(newUser)
    return newUser
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    await delay(400)
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User not found')
    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return users[index]
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(400)
    users = users.filter((u) => u.id !== id)
  },

  // Table Data
  getTableData: async (tableName: string): Promise<any[]> => {
    await delay(300)
    // Mock data based on table name
    if (tableName === 'ntc_lotacao') {
      return Array.from({ length: 50 }, (_, i) => ({
        id: `row-${i}`,
        vehicle_type: i % 2 === 0 ? 'Carreta' : 'Truck',
        distance_min: i * 100,
        distance_max: (i + 1) * 100,
        price_per_ton: (50 + i * 0.5).toFixed(2),
        price_per_trip: (1000 + i * 10).toFixed(2),
        is_active: i % 10 !== 0,
      }))
    }
    if (tableName === 'ntc_fracionada') {
      return Array.from({ length: 50 }, (_, i) => ({
        id: `row-${i}`,
        distance_min: i * 50,
        distance_max: (i + 1) * 50,
        weight_min: 10,
        weight_max: 50,
        price_per_kg: (0.5 + i * 0.01).toFixed(2),
        is_active: true,
      }))
    }
    return []
  },
}
