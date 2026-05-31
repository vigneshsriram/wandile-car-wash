import { useState, useEffect } from 'react'
import { CreditCard, Download, ChevronLeft, Check, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PACKAGES } from '../../lib/packages'
import { stripePromise, STRIPE_PRICES } from '../../lib/stripe'
import toast from 'react-hot-toast'

export default function BillingPortal() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(null)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: sub }, { data: pays }] = await Promise.all([
      supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
      supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
    ])
    setSubscription(sub)
    setPayments(pays || [])
    setLoading(false)
  }

  async function handleSubscribe(pkg) {
    setUpgrading(pkg.id)
    try {
      const stripe = await stripePromise
      // In production: create a checkout session on your backend, then redirect
      // For now we show a toast with instructions
      toast('Stripe checkout would open here. Set up your backend to create a Stripe Checkout Session.', { icon: '💳', duration: 5000 })
      /*
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: STRIPE_PRICES[pkg.id].monthly, userId: user.id }),
      })
      const { sessionId } = await res.json()
      await stripe.redirectToCheckout({ sessionId })
      */
    } finally {
      setUpgrading(null)
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel your subscription? You\'ll keep access until the end of the billing period.')) return
    const { error } = await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', subscription.id)
    if (error) toast.error(error.message)
    else { toast.success('Subscription cancelled'); fetchData() }
  }

  const activePkg = subscription ? PACKAGES.find(p => p.id === subscription.package_id) : null

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-white/5"><ChevronLeft size={20} /></Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Billing Portal</h1>
            <p className="text-white/50 text-sm">Manage your subscription and payment history</p>
          </div>
        </div>

        {/* Current subscription */}
        <div className="card-dark p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Current Plan</h2>
          {activePkg ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg gold-text">{activePkg.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Active</span>
                </div>
                <p className="text-white/50 text-sm">${activePkg.monthlyPrice}/month · Renews {new Date(subscription.current_period_end).toLocaleDateString()}</p>
              </div>
              <button onClick={handleCancel} className="text-sm text-red-400 hover:text-red-300">Cancel</button>
            </div>
          ) : (
            <p className="text-white/40">No active subscription. Choose a plan below.</p>
          )}
        </div>

        {/* Plans */}
        <div className="mb-8">
          <h2 className="font-semibold text-white mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PACKAGES.map(pkg => {
              const isActive = subscription?.package_id === pkg.id
              return (
                <div key={pkg.id} className={`card-dark p-4 ${isActive ? 'border-gold-500' : ''}`}>
                  <p className="font-semibold text-white mb-1">{pkg.name}</p>
                  <p className="text-2xl font-bold gold-text mb-3">${pkg.monthlyPrice}<span className="text-sm text-white/40 font-normal">/mo</span></p>
                  <ul className="space-y-1 mb-4">
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="text-xs text-white/50 flex items-center gap-1.5">
                        <Check size={10} className="text-gold-500" />{f}
                      </li>
                    ))}
                  </ul>
                  {isActive ? (
                    <div className="flex items-center justify-center gap-1 py-2 text-sm text-gold-500">
                      <Check size={14} /> Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(pkg)}
                      disabled={upgrading === pkg.id}
                      className="btn-outline w-full text-sm py-2"
                    >
                      {upgrading === pkg.id ? 'Loading...' : isActive ? 'Current' : 'Subscribe'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment history */}
        <div className="card-dark p-6">
          <h2 className="font-semibold text-white mb-4">Payment History</h2>
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map(p => (
                <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CreditCard size={14} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">${p.amount}</p>
                      <p className="text-xs text-white/40">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {p.receipt_url && (
                    <a href={p.receipt_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors">
                      <Download size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/30">
              <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No payments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
