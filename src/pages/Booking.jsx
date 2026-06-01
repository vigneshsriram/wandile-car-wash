import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Car, Clock, Plus, Minus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { PACKAGES, ADD_ONS } from '../lib/packages'
import toast from 'react-hot-toast'

const TIMES = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function Booking() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const defaultPkg = location.state?.packageId || 'basic'

  const [step, setStep] = useState(1) // 1=package, 2=datetime, 3=addons, 4=confirm
  const [selectedPkg, setSelectedPkg] = useState(defaultPkg)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [notes, setNotes] = useState('')

  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const [busySlots, setBusySlots] = useState(new Set())
  const [loadingSlots, setLoadingSlots] = useState(false)

  useEffect(() => {
    if (selectedDate) fetchBusySlots(selectedDate)
  }, [selectedDate])

  async function fetchBusySlots(date) {
    setLoadingSlots(true)
    const { data } = await supabase.rpc('get_busy_slots', { check_date: date })
    setBusySlots(new Set(data || []))
    setLoadingSlots(false)
  }

  useEffect(() => {
    if (user) fetchVehicles()
  }, [user])

  async function fetchVehicles() {
    const { data } = await supabase.from('vehicles').select('*').eq('user_id', user.id)
    setVehicles(data || [])
    if (data?.length) setSelectedVehicle(data[0].id)
  }

  function toggleAddon(id) {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const pkg = PACKAGES.find(p => p.id === selectedPkg)
  const addonsTotal = selectedAddons.reduce((sum, id) => sum + (ADD_ONS.find(a => a.id === id)?.price || 0), 0)
  const total = (pkg?.price || 0) + addonsTotal

  async function handleBook() {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time')
      return
    }
    setSubmitting(true)
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`)
      const { error } = await supabase.from('appointments').insert({
        user_id: user.id,
        vehicle_id: selectedVehicle,
        package_id: selectedPkg,
        scheduled_at: scheduledAt.toISOString(),
        add_ons: selectedAddons,
        notes,
        status: 'confirmed',
      })
      if (error) throw error
      toast.success('Appointment booked! Check your email for confirmation.')
      navigate('/dashboard/history')
    } catch (err) {
      toast.error(err.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  // Calendar helpers
  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDay = getFirstDayOfMonth(calYear, calMonth)
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }
  function isDatePast(day) {
    const d = new Date(calYear, calMonth, day)
    d.setHours(0, 0, 0, 0)
    const t = new Date(); t.setHours(0, 0, 0, 0)
    return d < t
  }
  function isSunday(day) {
    return new Date(calYear, calMonth, day).getDay() === 0
  }

  const steps = ['Package', 'Date & Time', 'Add-Ons', 'Confirm']

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-2">Book a <span className="gold-text">Wash</span></h1>
        <p className="text-white/50 mb-8">Complete the steps below to schedule your appointment.</p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${i + 1 < step ? 'bg-gold-gradient text-black' : i + 1 === step ? 'bg-gold-500/20 text-gold-500 border border-gold-500' : 'bg-white/5 text-white/30 border border-white/10'}`}>
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i + 1 === step ? 'text-gold-500' : 'text-white/30'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i + 1 < step ? 'bg-gold-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="card-dark p-6 sm:p-8">
          {/* Step 1: Package */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Select a Package</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PACKAGES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPkg(p.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${selectedPkg === p.id ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-white">{p.name}</p>
                        {p.badge && <span className="text-xs text-gold-500">{p.badge}</span>}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">${p.price}</p>
                        <p className="text-xs text-white/40">per wash</p>
                      </div>
                    </div>
                    <ul className="space-y-1 mt-2">
                      {p.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="text-xs text-white/50 flex items-center gap-1.5">
                          <Check size={10} className="text-gold-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {vehicles.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm text-white/60 mb-2 flex items-center gap-2"><Car size={14} /> Select Vehicle</label>
                  <select
                    value={selectedVehicle || ''}
                    onChange={e => setSelectedVehicle(e.target.value)}
                    className="input-dark"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} – {v.license_plate}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Choose Date & Time</h2>

              {/* Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/5"><ChevronLeft size={18} /></button>
                  <span className="font-semibold">{monthNames[calMonth]} {calYear}</span>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/5"><ChevronRight size={18} /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/40 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const past = isDatePast(day)
                    const sunday = isSunday(day)
                    const selected = selectedDate === dateStr
                    return (
                      <button
                        key={day}
                        disabled={past || sunday}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`aspect-square rounded-lg text-sm transition-all ${selected ? 'bg-gold-gradient text-black font-bold' : past || sunday ? 'text-white/20 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div>
                  <p className="text-sm text-white/60 mb-3 flex items-center gap-2">
                    <Clock size={14} /> Available time slots
                    {loadingSlots && <span className="w-3 h-3 border border-gold-500 border-t-transparent rounded-full animate-spin" />}
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIMES.map(t => {
                      const busy = busySlots.has(t)
                      return (
                        <button
                          key={t}
                          disabled={busy}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 rounded-lg text-xs font-medium transition-all ${selectedTime === t ? 'bg-gold-gradient text-black' : busy ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-white/30 mt-2">Grey slots are already booked</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Add-Ons */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Enhance Your Wash</h2>
              <p className="text-white/50 text-sm mb-6">Optional add-ons applied during your service.</p>
              <div className="space-y-3">
                {ADD_ONS.map(addon => {
                  const selected = selectedAddons.includes(addon.id)
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selected ? 'border-gold-500 bg-gold-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selected ? 'bg-gold-500 border-gold-500' : 'border-white/30'}`}>
                          {selected && <Check size={12} className="text-black" />}
                        </div>
                        <span className="text-white text-sm font-medium">{addon.name}</span>
                      </div>
                      <span className="text-gold-500 font-semibold">+${addon.price}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Confirm Booking</h2>
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Package', value: pkg?.name },
                  { label: 'Date', value: selectedDate || '—' },
                  { label: 'Time', value: selectedTime || '—' },
                  { label: 'Add-Ons', value: selectedAddons.length ? selectedAddons.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ') : 'None' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-white/5 pb-3">
                    <span className="text-white/50">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-gold-500 text-xl">${total}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-white/60 mb-1.5">Special Instructions <span className="text-white/30">(optional)</span></label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  className="input-dark resize-none"
                  placeholder="Any notes for our team..."
                />
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className={`flex gap-3 mt-8 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-outline flex items-center gap-2">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 2 && (!selectedDate || !selectedTime)}
                className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleBook} disabled={submitting} className="btn-gold disabled:opacity-60">
                {submitting ? 'Booking...' : `Confirm & Pay $${total}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
