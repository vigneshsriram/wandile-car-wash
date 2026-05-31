import { useState, useEffect } from 'react'
import { History, ChevronLeft, Calendar, Star, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PACKAGES, ADD_ONS } from '../../lib/packages'

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  completed:  { label: 'Completed', icon: CheckCircle, color: 'text-gold-500', bg: 'bg-gold-500/10' },
  cancelled:  { label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  pending:    { label: 'Pending',   icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
}

export default function HistoryLog() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: appts }, { data: lp }] = await Promise.all([
      supabase.from('appointments').select('*').eq('user_id', user.id).order('scheduled_at', { ascending: false }),
      supabase.from('loyalty_points').select('points').eq('user_id', user.id).single(),
    ])
    setAppointments(appts || [])
    setPoints(lp?.points || 0)
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const upcoming = appointments.filter(a => new Date(a.scheduled_at) >= new Date())
  const past = appointments.filter(a => new Date(a.scheduled_at) < new Date())

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-white/5"><ChevronLeft size={20} /></Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Wash History</h1>
            <p className="text-white/50 text-sm">Your appointments and loyalty points</p>
          </div>
        </div>

        {/* Points card */}
        <div className="card-dark p-5 mb-8 flex items-center gap-4 border-gold-500/30">
          <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shrink-0">
            <Star size={22} className="text-black" fill="black" />
          </div>
          <div>
            <p className="text-2xl font-bold gold-text">{points} pts</p>
            <p className="text-sm text-white/50">Loyalty Points · Earn 10 pts per wash</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-white/30">Next reward at</p>
            <p className="text-sm font-semibold text-gold-500">100 pts</p>
          </div>
        </div>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Upcoming</h2>
            <div className="space-y-3">
              {upcoming.map(a => <AppointmentRow key={a.id} a={a} />)}
            </div>
          </div>
        )}

        {/* Past */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Past Washes</h2>
          {past.length > 0 ? (
            <div className="space-y-3">
              {past.map(a => <AppointmentRow key={a.id} a={a} />)}
            </div>
          ) : (
            <div className="card-dark text-center py-16">
              <History size={36} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40">No washes yet</p>
              <Link to="/book" className="btn-gold mt-4 text-sm py-2 inline-flex">Book Your First Wash</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AppointmentRow({ a }) {
  const pkg = PACKAGES.find(p => p.id === a.package_id)
  const status = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending
  const StatusIcon = status.icon
  const addons = (a.add_ons || []).map(id => ADD_ONS.find(x => x.id === id)?.name).filter(Boolean)

  return (
    <div className="card-dark p-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0 mt-0.5">
        <Calendar size={18} className="text-gold-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-white">{pkg?.name || a.package_id}</p>
            <p className="text-sm text-white/50 mt-0.5">
              {new Date(a.scheduled_at).toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              {' · '}
              {new Date(a.scheduled_at).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${status.bg} ${status.color}`}>
            <StatusIcon size={11} />
            {status.label}
          </div>
        </div>
        {addons.length > 0 && (
          <p className="text-xs text-white/30 mt-1.5">+ {addons.join(', ')}</p>
        )}
      </div>
    </div>
  )
}
