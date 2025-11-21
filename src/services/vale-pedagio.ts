import { supabase } from '@/lib/supabase/client'

export class ValePedagioService {
  // In a real scenario, this would be an environment variable
  private static API_URL = 'https://api.valepedagio.com.br/v1'

  static async calculateCost(
    origin: string,
    destination: string,
    vehicleType: string,
    axes: number,
  ): Promise<number> {
    const startTime = Date.now()
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        // Simulate API call since we don't have a real endpoint credentials
        const cost = await this.mockExternalCall(
          origin,
          destination,
          vehicleType,
          axes,
        )

        await this.logIntegration(
          'calculate_cost',
          'POST',
          { origin, destination, vehicleType, axes },
          { cost },
          200,
          Date.now() - startTime,
        )

        return cost
      } catch (error: any) {
        attempts++
        console.error(`Vale Pedágio API attempt ${attempts} failed:`, error)

        if (attempts === maxAttempts) {
          await this.logIntegration(
            'calculate_cost',
            'POST',
            { origin, destination, vehicleType, axes },
            { error: error.message },
            500,
            Date.now() - startTime,
          )

          // If it's a known "route not found" or similar, we might want to return 0
          // But for system errors, we throw to alert the user
          throw new Error(
            'Falha ao consultar serviço de pedágio após várias tentativas. Verifique a rota ou tente novamente.',
          )
        }

        // Exponential backoff: 1s, 2s, 4s
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempts - 1)),
        )
      }
    }
    return 0
  }

  private static async mockExternalCall(
    origin: string,
    destination: string,
    vehicleType: string,
    axes: number,
  ): Promise<number> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600))

    // Simulate random failure (5% chance) to test retry logic
    if (Math.random() < 0.05) {
      throw new Error('Service unavailable (Simulated)')
    }

    // Specific handling for routes where no tolls are found (e.g. same city)
    if (origin === destination) {
      return 0
    }

    // Mock calculation logic
    // Base rate per axle per 100km (simulated)
    const baseRatePerAxle = 12.5
    // Simulate distance factor based on string length difference (just to have variation)
    const distanceFactor = Math.abs(origin.length - destination.length) + 2

    const cost = baseRatePerAxle * axes * distanceFactor

    return Number(cost.toFixed(2))
  }

  private static async logIntegration(
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
      // Fail silently on log error to not disrupt the main flow
      console.error('Failed to log integration', e)
    }
  }
}
