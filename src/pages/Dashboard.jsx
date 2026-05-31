import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, CreditCard, History, Star, QrCode, Calendar, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import { PACKAGES } from '../lib/packages'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [nextAppt, setNextAppt] = useState(null)
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [subscription, setSubscription] = useState(null)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  async function fetchData() {
    const [{ data: v }, { data: a }, { data: l }, { data: s }] = await Promise.all([
      supabase.from('vehicles').select('*').eq('user_id', user.id),
      supabase.from('appointments').select('*').eq('user_id', user.id).gte('scheduled_at', new Date().toISOString()).order('scheduled_at', { ascending: true }).limit(1),
      supabase.from('loyalty_points').select('points').eq('user_id', user.id).single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
    ])
    setVehicles(v || [])
    setNextAppt(a?.[0] || null)
    setLoyaltyPoints(l?.points || 0)
    setSubscription(s || null)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there'
  const subPkg = subscription ? PACKAGES.find(p => p.id === subscription.package_id) : null

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-white/50 text-sm">{greeting()},</p>
            <h1 className="text-3xl font-display font-bold mt-1">{name} 👋</h1>
          </div>
          <Link to="/book" className="btn-gold">Book a Wash</Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Vehicles', value: vehicles.length, icon: Car, href: '/dashboard/vehicles' },
            { label: 'Loyalty Points', value: loyaltyPoints, icon: Star, href: '/dashboard/history' },
            { label: 'Subscription', value: subPkg ? subPkg.name : 'None', icon: CreditCard, href: '/dashboard/billing' },
            { label: 'Next Wash', value: nextAppt ? new Date(nextAppt.scheduled_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }) : '—', icon: Calendar, href: '/dashboard/history' },
          ].map(({ label, value, icon: Icon, href }) => (
            <Link key={label} to={href} className="card-dark p-4 hover:border-gold-500/40 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className="text-gold-500" />
                <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
              </div>
              <p className="text-xl font-bold text-white truncate">{value}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member QR Pass */}
          <div className="card-dark p-6 flex flex-col items-center text-center">
            <h3 className="font-semibold text-white mb-1">Member Pass</h3>
            <p className="text-xs text-white/40 mb-4">Show this at the wash bay</p>

            {showQR ? (
              <div className="p-3 bg-white rounded-xl mb-4">
                <QRCodeSVG
                  value={JSON.stringify({ uid: user?.id, email: user?.email, ts: Date.now() })}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#0a0a0a"
                />
              </div>
            ) : (
              <div className="w-40 h-40 rounded-xl bg-black-600 border border-white/10 flex items-center justify-center mb-4">
                <QrCode size={48} className="text-white/20" />
              </div>
            )}

            <button onClick={() => setShowQR(!showQR)} className="btn-outline text-sm py-2 w-full">
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>

            {subscription && (
              <div className="mt-3 text-xs text-white/40">
                Active: <span className="text-gold-500">{subPkg?.name}</span>
              </div>
            )}
          </div>

          {/* Next Appointment */}
          <div className="card-dark p-6">
            <h3 className="font-semibold text-white mb-4">Next Appointment</h3>
            {nextAppt ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <Calendar size={20} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {new Date(nextAppt.scheduled_at).toLocaleDateString('en-ZA', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm text-white/50">
                      {new Date(nextAppt.scheduled_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="bg-black-600 rounded-lg p-3 text-sm">
                  <span className="text-white/50">Package: </span>
                  <span className="text-gold-500 font-medium">{PACKAGES.find(p => p.id === nextAppt.package_id)?.name}</span>
                </div>
                <button className="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors">
                  Cancel appointment
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm mb-4">No upcoming appointments</p>
                <Link to="/book" className="btn-gold text-sm py-2">Book Now</Link>
              </div>
            )}
          </div>

          {/* Subscription */}
          <div className="card-dark p-6">
            <h3 className="font-semibold text-white mb-4">Subscription</h3>
            {subscription && subPkg ? (
              <div>
                <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 mb-4">
                  <p className="text-gold-500 font-bold text-lg">{subPkg.name}</p>
                  <p className="text-white/60 text-sm mt-1">${subPkg.monthlyPrice}/month</p>
                  <p className="text-xs text-white/30 mt-2">
                    Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
                <Link to="/dashboard/billing" className="btn-outline text-sm w-full">Manage Subscription</Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm mb-4">No active subscription</p>
                <Link to="/packages" className="btn-gold text-sm py-2">View Plans</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { to: '/dashboard/vehicles', icon: Car, label: 'My Vehicles', desc: `${vehicles.length} saved` },
            { to: '/dashboard/billing', icon: CreditCard, label: 'Billing Portal', desc: 'Payment & receipts' },
            { to: '/dashboard/history', icon: History, label: 'Wash History', desc: 'Past appointments' },
          ].map(({ to, icon: Icon, label, desc }) => (
            <Link key={to} to={to} className="card-dark p-4 flex items-center gap-4 hover:border-gold-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-gold-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
              <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
