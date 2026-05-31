import { useState, useEffect } from 'react'
import { Car, Plus, Trash2, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const COLORS = ['White', 'Black', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Brown', 'Other']

export default function VehicleGarage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ make: '', model: '', year: '', license_plate: '', color: 'White' })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => { fetchVehicles() }, [])

  async function fetchVehicles() {
    setLoading(true)
    const { data } = await supabase.from('vehicles').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setVehicles(data || [])
    setLoading(false)
  }

  async function addVehicle(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase.from('vehicles').insert({ ...form, user_id: user.id, year: parseInt(form.year) })
      if (error) throw error
      toast.success('Vehicle added!')
      setForm({ make: '', model: '', year: '', license_plate: '', color: 'White' })
      setShowForm(false)
      fetchVehicles()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function removeVehicle(id) {
    if (!confirm('Remove this vehicle?')) return
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) toast.error(error.message)
    else { toast.success('Vehicle removed'); fetchVehicles() }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-white/5"><ChevronLeft size={20} /></Link>
          <div>
            <h1 className="text-3xl font-display font-bold">My Garage</h1>
            <p className="text-white/50 text-sm">Save your vehicles for quick booking</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {vehicles.map(v => (
                <div key={v.id} className="card-dark p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                    <Car size={24} className="text-gold-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{v.year} {v.make} {v.model}</p>
                    <p className="text-sm text-white/50">{v.license_plate} · {v.color}</p>
                  </div>
                  <button onClick={() => removeVehicle(v.id)} className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {vehicles.length === 0 && !showForm && (
                <div className="text-center py-16 card-dark">
                  <Car size={40} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/40">No vehicles saved yet</p>
                </div>
              )}
            </div>

            {showForm ? (
              <div className="card-dark p-6">
                <h3 className="font-semibold text-white mb-5">Add a Vehicle</h3>
                <form onSubmit={addVehicle} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Make</label>
                      <input required value={form.make} onChange={set('make')} className="input-dark" placeholder="Toyota" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Model</label>
                      <input required value={form.model} onChange={set('model')} className="input-dark" placeholder="Hilux" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Year</label>
                      <input required type="number" min="1990" max={new Date().getFullYear() + 1} value={form.year} onChange={set('year')} className="input-dark" placeholder="2022" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1.5">Color</label>
                      <select value={form.color} onChange={set('color')} className="input-dark">
                        {COLORS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">License Plate</label>
                    <input required value={form.license_plate} onChange={set('license_plate')} className="input-dark" placeholder="CA 123 456" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                    <button type="submit" disabled={saving} className="btn-gold flex-1">{saving ? 'Saving...' : 'Add Vehicle'}</button>
                  </div>
                </form>
              </div>
            ) : (
              <button onClick={() => setShowForm(true)} className="btn-outline w-full flex items-center justify-center gap-2">
                <Plus size={16} /> Add Vehicle
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
