import { loadStripe } from '@stripe/stripe-js'

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!key) {
  console.warn('⚠️  Stripe publishable key missing. Add VITE_STRIPE_PUBLISHABLE_KEY to .env')
}

export const stripePromise = loadStripe(key || 'pk_test_placeholder')

// Price IDs — replace with your real Stripe price IDs after creating products
export const STRIPE_PRICES = {
  basic: {
    single: 'price_basic_single',      // $10 one-time
    monthly: 'price_basic_monthly',    // monthly recurring
  },
  works: {
    single: 'price_works_single',      // $15 one-time
    monthly: 'price_works_monthly',
  },
  ultimate: {
    single: 'price_ultimate_single',   // $22 one-time
    monthly: 'price_ultimate_monthly',
  },
  ceramic: {
    single: 'price_ceramic_single',    // $45 one-time
    monthly: 'price_ceramic_monthly',
  },
}
