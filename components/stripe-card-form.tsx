'use client'

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { purchaseCredits } from '@/lib/api/payments'

interface Props {
  clientSecret: string
  packId: string
  paymentIntentId: string
  onSuccess: (creditBalance: number) => void
  onError: (message: string) => void
  onBack: () => void
}

export function StripeCardForm({ clientSecret, packId, paymentIntentId, onSuccess, onError, onBack }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!stripe || !elements) return
    const card = elements.getElement(CardElement)
    if (!card) return

    setIsProcessing(true)
    setCardError(null)

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    })

    if (error) {
      setCardError(error.message ?? 'Payment failed')
      setIsProcessing(false)
      return
    }

    if (paymentIntent?.status !== 'succeeded') {
      setCardError('Payment not completed. Please try again.')
      setIsProcessing(false)
      return
    }

    try {
      const result = await purchaseCredits(packId, paymentIntentId)
      onSuccess(result.creditBalance)
    } catch {
      onError('Payment went through but credits could not be applied. Please contact support.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border p-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#09090b',
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                '::placeholder': { color: '#a1a1aa' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
          onChange={(e) => setCardError(e.error?.message ?? null)}
        />
      </div>

      {cardError && (
        <p className="text-sm text-destructive">{cardError}</p>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button
          className="flex-1"
          onClick={handleConfirm}
          disabled={isProcessing || !stripe || !elements}
        >
          {isProcessing && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isProcessing ? 'Processing…' : 'Confirm Payment'}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Secured by Stripe. Your card details are never stored.
      </p>
    </div>
  )
}
