// Mock Supabase Client
// This file simulates the Supabase client behavior for the frontend since we don't have a real backend connection.

const mockTariffs = [
  {
    distance_min: 0,
    distance_max: 100,
    price_per_ton: 45.5,
    freight_value_percent: 0.5,
    gris_percent: 0.2,
    tso_percent: 0.1,
    version_date: '2024-01-01',
    is_active: true,
  },
  {
    distance_min: 101,
    distance_max: 500,
    price_per_ton: 85.2,
    freight_value_percent: 0.4,
    gris_percent: 0.2,
    tso_percent: 0.1,
    version_date: '2024-01-01',
    is_active: true,
  },
  {
    distance_min: 501,
    distance_max: 1000,
    price_per_ton: 120.0,
    freight_value_percent: 0.3,
    gris_percent: 0.15,
    tso_percent: 0.1,
    version_date: '2024-01-01',
    is_active: true,
  },
  {
    distance_min: 1001,
    distance_max: 5000,
    price_per_ton: 250.0,
    freight_value_percent: 0.2,
    gris_percent: 0.1,
    tso_percent: 0.05,
    version_date: '2024-01-01',
    is_active: true,
  },
]

const mockCashback = {
  SP: 1.5,
  RJ: 1.0,
  MG: 1.2,
  SC: 2.0,
}

export const supabase = {
  from: (table: string) => {
    const chain = {
      select: (columns: string) => chain,
      eq: (column: string, value: any) => {
        ;(chain as any)._filters = (chain as any)._filters || {}
        ;(chain as any)._filters[column] = value
        return chain
      },
      lte: (column: string, value: any) => {
        ;(chain as any)._lte = (chain as any)._lte || {}
        ;(chain as any)._lte[column] = value
        return chain
      },
      gte: (column: string, value: any) => {
        ;(chain as any)._gte = (chain as any)._gte || {}
        ;(chain as any)._gte[column] = value
        return chain
      },
      order: (column: string, opts: any) => chain,
      limit: (count: number) => chain,
      single: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay

        if (table === 'ntc_lotacao') {
          const filters = (chain as any)._filters || {}
          const lte = (chain as any)._lte || {}
          const gte = (chain as any)._gte || {}

          // Find matching tariff
          const tariff = mockTariffs.find((t) => {
            // Check is_active
            if (
              filters.is_active !== undefined &&
              t.is_active !== filters.is_active
            )
              return false

            // Check distance range
            // Query: lte('distance_min', distance) -> t.distance_min <= distance
            // Query: gte('distance_max', distance) -> t.distance_max >= distance

            // In our mock logic, we reverse check:
            // If query says lte('distance_min', 150), it means we want rows where distance_min <= 150
            const dist = lte['distance_min'] // The distance passed in query
            if (dist !== undefined && t.distance_min > dist) return false

            const distMax = gte['distance_max']
            if (distMax !== undefined && t.distance_max < distMax) return false

            return true
          })

          if (tariff) {
            return { data: tariff, error: null }
          }
          return { data: null, error: { message: 'No tariff found' } }
        }

        if (table === 'cashback_uf') {
          const filters = (chain as any)._filters || {}
          const uf = filters.uf
          const percentage = (mockCashback as any)[uf]
          if (percentage !== undefined) {
            return { data: { percentage }, error: null }
          }
          return { data: null, error: { message: 'No cashback found' } }
        }

        return { data: null, error: null }
      },
      insert: async (data: any) => {
        console.log(`[Supabase Mock] Insert into ${table}:`, data)
        return { data: data, error: null }
      },
    }
    return chain
  },
  rpc: async (func: string, params: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (func === 'get_icms_rate') {
      const { uf_origem, uf_destino } = params
      if (uf_origem === uf_destino) return { data: 18, error: null } // Internal
      if (['SP', 'RJ', 'MG', 'RS', 'SC', 'PR'].includes(uf_origem)) {
        if (['SP', 'RJ', 'MG', 'RS', 'SC', 'PR'].includes(uf_destino))
          return { data: 12, error: null }
        return { data: 7, error: null }
      }
      return { data: 12, error: null }
    }
    return { data: null, error: { message: 'Function not found' } }
  },
}
