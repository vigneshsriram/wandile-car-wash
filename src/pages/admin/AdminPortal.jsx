import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { PACKAGES, ADD_ONS } from '../../lib/packages'
import toast from 'react-hot-toast'
import {
  Calendar, CheckCircle, XCircle, Clock,
  Car, ChevronLeft, AlertCircle, RefreshCw,
  BarChart2, DollarSign, Award, TrendingUp,
  Pencil, Check, X,
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
  const [view, setView] = useState('bookings')
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')

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
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) {
      toast.error(error.message || 'Failed to update status')
    } else {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success(`Marked as ${status}`)
    }
    setUpdating(null)
  }

  async function saveNote(id) {
    const { error } = await supabase
      .from('appointments')
      .update({ admin_notes: noteText.trim() || null })
      .eq('id', id)
    if (error) {
      toast.error('Failed to save note')
    } else {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, admin_notes: noteText.trim() || null } : a))
      toast.success('Note saved')
      setEditingNote(null)
    }
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
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              <button
                onClick={() => setView('bookings')}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${view === 'bookings' ? 'bg-electric-500 text-white' : 'bg-black-700 text-electric-300/60 hover:bg-black-600'}`}
              >
                <Calendar size={14} /> Bookings
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-4 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${view === 'analytics' ? 'bg-electric-500 text-white' : 'bg-black-700 text-electric-300/60 hover:bg-black-600'}`}
              >
                <BarChart2 size={14} /> Analytics
              </button>
            </div>
            <button onClick={fetchAll} className="btn-outline text-sm py-2 flex items-center gap-2">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Stats row — always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: counts.all,       icon: Calendar,     color: 'text-electric-400' },
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

        {view === 'analytics' ? (
          <AnalyticsSection appointments={appointments} />
        ) : (
          <>
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
                    If you expect data, make sure the admin RLS policies are set in Supabase.
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
                    editingNote={editingNote === a.id}
                    noteText={editingNote === a.id ? noteText : (a.admin_notes || '')}
                    onEditNote={() => { setEditingNote(a.id); setNoteText(a.admin_notes || '') }}
                    onNoteChange={setNoteText}
                    onNoteSave={() => saveNote(a.id)}
                    onNoteCancel={() => setEditingNote(null)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function AnalyticsSection({ appointments }) {
  const completed = appointments.filter(a => a.status === 'completed')

  function calcRevenue(appts) {
    return appts.reduce((sum, a) => {
      const pkg = PACKAGES.find(p => p.id === a.package_id)
      const addons = (a.add_ons || []).reduce((s, id) => s + (ADD_ONS.find(x => x.id === id)?.price || 0), 0)
      return sum + (pkg?.price || 0) + addons
    }, 0)
  }

  const now = new Date()
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const weekRevenue  = calcRevenue(completed.filter(a => new Date(a.scheduled_at) >= weekStart))
  const monthRevenue = calcRevenue(completed.filter(a => new Date(a.scheduled_at) >= monthStart))
  const allRevenue   = calcRevenue(completed)

  // Package popularity (all bookings, not just completed)
  const pkgCounts = {}
  appointments.forEach(a => { pkgCounts[a.package_id] = (pkgCounts[a.package_id] || 0) + 1 })
  const sortedPkgs = Object.entries(pkgCounts).sort((a, b) => b[1] - a[1])

  // Busiest day of week
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayCounts = Array(7).fill(0)
  appointments.forEach(a => { dayCounts[new Date(a.scheduled_at).getDay()]++ })
  const maxDay = Math.max(...dayCounts)
  const busiestDay = maxDay > 0 ? DAYS[dayCounts.indexOf(maxDay)] : '—'

  return (
    <div className="space-y-6">
      {/* Revenue */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-gold-500" /> Revenue
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'This Week',  value: weekRevenue,  sub: `${completed.filter(a => new Date(a.scheduled_at) >= weekStart).length} washes` },
            { label: 'This Month', value: monthRevenue, sub: `${completed.filter(a => new Date(a.scheduled_at) >= monthStart).length} washes` },
            { label: 'All Time',   value: allRevenue,   sub: `${completed.length} washes total` },
          ].map(({ label, value, sub }) => (
            <div key={label} className="card-dark p-5">
              <p className="text-xs text-electric-300/50 mb-1">{label}</p>
              <p className="text-3xl font-bold text-gold-500">${value}</p>
              <p className="text-xs text-electric-300/40 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Package popularity + busiest day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package popularity */}
        <div className="card-dark p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Award size={15} className="text-electric-400" /> Package Popularity
          </h3>
          {sortedPkgs.length === 0 ? (
            <p className="text-electric-300/40 text-sm">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {sortedPkgs.map(([pkgId, count], i) => {
                const pkg = PACKAGES.find(p => p.id === pkgId)
                const pct = Math.round((count / appointments.length) * 100)
                return (
                  <div key={pkgId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80 flex items-center gap-2">
                        <span className="text-electric-300/40 text-xs w-4">{i + 1}.</span>
                        {pkg?.name || pkgId}
                      </span>
                      <span className="text-electric-300/60">{count} booking{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-1.5 bg-black-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-electric-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Busiest day */}
        <div className="card-dark p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-electric-400" /> Bookings by Day
          </h3>
          {appointments.length === 0 ? (
            <p className="text-electric-300/40 text-sm">No bookings yet</p>
          ) : (
            <div className="space-y-2">
              {DAYS.map((day, i) => {
                const count = dayCounts[i]
                const pct = maxDay > 0 ? Math.round((count / maxDay) * 100) : 0
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className={`text-xs w-8 shrink-0 ${count === maxDay && maxDay > 0 ? 'text-gold-500 font-semibold' : 'text-electric-300/50'}`}>{day}</span>
                    <div className="flex-1 h-1.5 bg-black-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${count === maxDay && maxDay > 0 ? 'bg-gold-500' : 'bg-electric-500/50'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-electric-300/40 w-4 text-right">{count}</span>
                  </div>
                )
              })}
              {maxDay > 0 && (
                <p className="text-xs text-gold-500/80 mt-3">Busiest day: <span className="font-semibold">{busiestDay}</span></p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BookingRow({ appointment: a, onUpdate, updating, editingNote, noteText, onEditNote, onNoteChange, onNoteSave, onNoteCancel }) {
  const pkg = PACKAGES.find(p => p.id === a.package_id)
  const status = STATUS[a.status] || STATUS.pending
  const StatusIcon = status.icon
  const customer = a.profiles?.full_name || 'Unknown'
  const vehicle = a.vehicles ? `${a.vehicles.make} ${a.vehicles.model}` : null
  const date = new Date(a.scheduled_at)

  return (
    <div className="card-dark p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">

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
            <p className="text-xs text-electric-300/40 mt-1 italic">Customer: "{a.notes}"</p>
          )}

          {/* Admin notes */}
          <div className="mt-2">
            {editingNote ? (
              <div className="flex items-start gap-2">
                <textarea
                  value={noteText}
                  onChange={e => onNoteChange(e.target.value)}
                  rows={2}
                  placeholder="Add internal note..."
                  className="flex-1 text-xs bg-black-600 border border-electric-500/30 rounded-lg px-3 py-2 text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-electric-400"
                  autoFocus
                />
                <button onClick={onNoteSave} className="p-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-colors mt-0.5">
                  <Check size={14} />
                </button>
                <button onClick={onNoteCancel} className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors mt-0.5">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={onEditNote}
                className="flex items-center gap-1.5 text-xs text-electric-300/40 hover:text-electric-300/70 transition-colors group"
              >
                <Pencil size={11} />
                {a.admin_notes ? (
                  <span className="italic text-electric-300/60">Note: {a.admin_notes}</span>
                ) : (
                  <span>Add note</span>
                )}
              </button>
            )}
          </div>
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
