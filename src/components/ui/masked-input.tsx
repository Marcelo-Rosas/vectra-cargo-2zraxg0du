import * as React from 'react'
import { Input } from '@/components/ui/input'

interface MaskedInputProps extends React.ComponentProps<typeof Input> {
  mask: 'cep' | 'currency'
  onValueChange?: (value: string | number) => void
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, onValueChange, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      let rawValue: string | number = value

      if (mask === 'cep') {
        // Remove non-digits
        value = value.replace(/\D/g, '')
        // Limit to 8 digits
        value = value.slice(0, 8)
        // Apply mask 00000-000
        if (value.length > 5) {
          value = value.replace(/^(\d{5})(\d)/, '$1-$2')
        }
        rawValue = value.replace(/\D/g, '')
      } else if (mask === 'currency') {
        // Remove non-digits
        const digits = value.replace(/\D/g, '')
        // Convert to number
        const numberValue = Number(digits) / 100
        // Format as currency BRL
        value = numberValue.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
        rawValue = numberValue
      }

      // Call original onChange if provided (for react-hook-form integration mostly)
      if (onChange) {
        // We need to persist the event or create a synthetic one if we modify the value
        // But for simple masking, we can just update the target value
        e.target.value = value
        onChange(e)
      }

      // Call custom onValueChange with raw value
      if (onValueChange) {
        onValueChange(rawValue)
      }
    }

    return (
      <Input
        {...props}
        ref={ref}
        onChange={handleChange}
        className={className}
      />
    )
  },
)
MaskedInput.displayName = 'MaskedInput'
