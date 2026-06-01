import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { PACKAGES } from '../../lib/packages'
import toast from 'react-hot-toast'
import {
  Calendar, CheckCircle, XCircle, Clock, Users,
  Car, ChevronLeft, AlertCircle, RefreshCw,
} from 'lucide-react'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

const STATUS = {
  pending:   { label: 'Pending',   color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-green-400',  bg: 'bg-green-400/10',  icon: CheckCircle },
  completed: { label: 'Completed', color: 'text-gold-500',   bg: 'bg-gold-500/10',   icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400',    bg: 'bg-red-400/10',    icon: XCircle },
}

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

export default function AdminPortal() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.email !== ADMIN_EMAIL) { navigate('/'); return }
    fetchAll()
  }, [user])

  async function fetchAll() {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select('*, profiles(full_name, phone), vehicles(make, model, license_plate)')
      .order('scheduled_at', { ascending: false })
    if (error) {
      toast.error('Failed to load — check Supabase admin RLS policies')
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }

  async function updateStatus(id, status) {
    setUpdating(id)
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
    if (error) {
      toast.error('Failed to update status')
    } else {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success(`Marked as ${status}`)
    }
    setUpdating(null)
  }

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-electric-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-lg hover:bg-white/5"><ChevronLeft size={20} /></Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Admin Portal</h1>
              <p className="text-electric-300/60 text-sm">Wandile Car Wash — all bookings</p>
            </div>
          </div>
          <button onClick={fetchAll} className="btn-outline text-sm py-2 flex items-center gap-2">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: counts.all,       icon: Calendar, color: 'text-electric-400' },
            { label: 'Pending',        value: counts.pending,   icon: Clock,        color: 'text-yellow-400' },
            { label: 'Confirmed',      value: counts.confirmed, icon: CheckCircle,  color: 'text-green-400' },
            { label: 'Cars Washed',    value: counts.completed, icon: Car,          color: 'text-gold-500' },
            { label: 'Cancelled',      value: counts.cancelled, icon: XCircle,      color: 'text-red-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card-dark p-4">
              <Icon size={18} className={`${color} mb-2`} />
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-electric-300/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-electric-500 text-white'
                  : 'bg-black-700 text-electric-300/60 hover:bg-black-600'
              }`}
            >
              {f === 'all' ? 'All' : f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="card-dark text-center py-20">
            <AlertCircle size={36} className="text-electric-300/20 mx-auto mb-3" />
            <p className="text-electric-300/40">No bookings found</p>
            {appointments.length === 0 && (
              <p className="text-xs text-electric-300/30 mt-2 max-w-sm mx-auto">
                If you expect data, make sure you've added the admin RLS policies in Supabase.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <BookingRow
                key={a.id}
                appointment={a}
                onUpdate={updateStatus}
                updating={updating === a.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingRow({ appointment: a, onUpdate, updating }) {
  const pkg = PACKAGES.find(p => p.id === a.package_id)
  const status = STATUS[a.status] || STATUS.pending
  const StatusIcon = status.icon
  const customer = a.profiles?.full_name || 'Unknown'
  const vehicle = a.vehicles ? `${a.vehicles.make} ${a.vehicles.model}` : null
  const date = new Date(a.scheduled_at)

  return (
    <div className="card-dark p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">

        {/* Date block */}
        <div className="w-14 h-14 rounded-xl bg-black-600 flex flex-col items-center justify-center shrink-0 text-center">
          <p className="text-xs text-electric-300/50 uppercase">{date.toLocaleString('en', { month: 'short' })}</p>
          <p className="text-xl font-bold text-white leading-none">{date.getDate()}</p>
          <p className="text-xs text-electric-300/50">{date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-semibold text-white">{customer}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              <StatusIcon size={10} />
              {status.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-electric-300/60">
            <span>{pkg?.name || a.package_id}</span>
            {vehicle && <span className="flex items-center gap-1"><Car size={12} />{vehicle}</span>}
            {a.vehicles?.license_plate && <span>{a.vehicles.license_plate}</span>}
          </div>
          {a.notes && (
            <p className="text-xs text-electric-300/40 mt-1 italic">"{a.notes}"</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap shrink-0">
          {a.status === 'pending' && (
            <button
              onClick={() => onUpdate(a.id, 'confirmed')}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-medium hover:bg-green-500/25 transition-colors disabled:opacity-50"
            >
              Confirm
            </button>
          )}
          {a.status === 'confirmed' && (
            <button
              onClick={() => onUpdate(a.id, 'completed')}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg bg-gold-500/15 text-gold-500 text-xs font-medium hover:bg-gold-500/25 transition-colors disabled:opacity-50"
            >
              Mark Washed
            </button>
          )}
          {(a.status === 'pending' || a.status === 'confirmed') && (
            <button
              onClick={() => onUpdate(a.id, 'cancelled')}
              disabled={updating}
              className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          {(a.status === 'cancelled' || a.status === 'completed') && (
            <span className="text-xs text-electric-300/30 italic self-center">No actions</span>
          )}
          {updating && (
            <div className="w-4 h-4 border-2 border-electric-400 border-t-transparent rounded-full animate-spin self-center" />
          )}
        </div>
      </div>
    </div>
  )
}
