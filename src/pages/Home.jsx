import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MapPin, Star, ChevronRight, Shield, Zap, Award, Droplets } from 'lucide-react'
import PackageCard from '../components/PackageCard'
import { PACKAGES } from '../lib/packages'

const REVIEWS = [
  { name: 'Sipho M.', stars: 5, text: 'Best car wash in Joburg. The ceramic detail package left my BMW looking showroom-fresh for weeks!', date: '2 weeks ago' },
  { name: 'Amara T.', stars: 5, text: 'Love the subscription model. I pay once a month and drive through whenever — such a time saver.', date: '1 month ago' },
  { name: 'David K.', stars: 5, text: 'Ultimate Shield is my go-to. The Rain-X treatment is worth it alone during the rainy season.', date: '3 weeks ago' },
]

const GALLERY = [
  { before: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80', after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80', label: 'BMW 5 Series' },
  { before: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80', after: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80', label: 'Toyota Fortuner' },
]

function WaitTimeIndicator() {
  const [wait, setWait] = useState(null)
  useEffect(() => {
    // Simulated live wait time — replace with real API call
    const times = [5, 8, 12, 6, 10, 15, 7]
    setWait(times[new Date().getMinutes() % times.length])
    const interval = setInterval(() => {
      setWait(times[Math.floor(Math.random() * times.length)])
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const color = wait <= 8 ? 'text-green-400' : wait <= 15 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black-700 border border-white/10">
      <span className={`w-2 h-2 rounded-full ${wait <= 8 ? 'bg-green-400' : wait <= 15 ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`} />
      <span className="text-sm text-white/60">Current wait:</span>
      <span className={`text-sm font-bold ${color}`}>{wait !== null ? `~${wait} min` : '...'}</span>
    </div>
  )
}

export default function Home() {
  const [monthly, setMonthly] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#D4AF3720_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592805144716-feeccccef5ac?w=1920&q=60')] bg-cover bg-center opacity-10" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <WaitTimeIndicator />

          <h1 className="mt-8 font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
            Your Car Deserves<br />
            <span className="gold-text">the Royal Treatment</span>
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            From quick exterior washes to full ceramic detailing — Wandile Car Wash delivers showroom-quality results every single time.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/book" className="btn-gold text-base px-8 py-4">
              Book a Wash <ChevronRight size={18} />
            </Link>
            <Link to="/packages" className="btn-outline text-base px-8 py-4">
              View Packages
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
            {[
              { label: 'Cars Washed', value: '12,000+' },
              { label: 'Happy Members', value: '1,400+' },
              { label: 'Avg Rating', value: '4.9★' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold gold-text">{value}</div>
                <div className="text-xs text-white/40 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-gold-500" />
          </div>
        </div>
      </section>

      {/* ─── Why Us ─── */}
      <section className="py-20 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Fast & Efficient', desc: 'Most washes completed in under 15 minutes. We respect your time.' },
              { icon: Shield, title: 'Paint Protection', desc: 'Soft-cloth technology that\'s gentle on your paint and clear coat.' },
              { icon: Award, title: 'Quality Guaranteed', desc: '100% satisfaction guarantee. Not happy? We\'ll rewash for free.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-dark p-6 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-gold-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Packages Preview ─── */}
      <section className="py-20 section-padding bg-black-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Pricing</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-center mb-4">Choose Your Package</h2>
          <p className="text-white/50 text-center mb-8">Single wash or monthly subscription — cancel anytime.</p>

          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-3 p-1 rounded-xl bg-black-700 border border-white/10">
              <button
                onClick={() => setMonthly(false)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!monthly ? 'bg-gold-gradient text-black' : 'text-white/50'}`}
              >
                Single Wash
              </button>
              <button
                onClick={() => setMonthly(true)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${monthly ? 'bg-gold-gradient text-black' : 'text-white/50'}`}
              >
                Monthly ✦ Save 30%
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACKAGES.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} monthly={monthly} featured={pkg.id === 'ultimate'} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/packages" className="btn-outline">
              Compare All Features <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Before & After Gallery ─── */}
      <section className="py-20 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Results</span>
            <h2 className="text-4xl font-display font-bold mt-2">See the Difference</h2>
          </div>

          <div className="card-dark p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Before</p>
                <img src={GALLERY[galleryIndex].before} alt="Before" className="w-full h-48 sm:h-64 object-cover rounded-xl opacity-70 grayscale" />
              </div>
              <div>
                <p className="text-xs text-gold-500 uppercase tracking-widest mb-2">After</p>
                <img src={GALLERY[galleryIndex].after} alt="After" className="w-full h-48 sm:h-64 object-cover rounded-xl" />
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {GALLERY.map((_, i) => (
                <button key={i} onClick={() => setGalleryIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === galleryIndex ? 'bg-gold-500 w-6' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section className="py-20 section-padding bg-black-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Reviews</span>
            <h2 className="text-4xl font-display font-bold mt-2">What Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="card-dark p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-gold-500" fill="#D4AF37" />
                  ))}
                </div>
                <p className="text-sm text-white/70 mb-4 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-white/30">{r.date}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 font-bold text-sm">
                    {r.name[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Location & Hours ─── */}
      <section className="py-20 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Find Us</span>
            <h2 className="text-4xl font-display font-bold mt-2">Location & Hours</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-72 lg:h-80">
              <iframe
                title="Wandile Car Wash Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.9!2d28.0473!3d-26.2041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDEyJzE0LjgiUyAyOMKwMDInNTAuMyJF!5e0!3m2!1sen!2sza!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Info */}
            <div className="card-dark p-6 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gold-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-white">123 Shine Street</p>
                  <p className="text-sm text-white/50">Johannesburg, South Africa</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2">
                <h4 className="text-sm font-semibold text-white mb-3">Operating Hours</h4>
                {[
                  { day: 'Monday – Friday', hours: '7:00 AM – 7:00 PM' },
                  { day: 'Saturday', hours: '7:00 AM – 7:00 PM' },
                  { day: 'Sunday', hours: '8:00 AM – 5:00 PM' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-white/60">{day}</span>
                    <span className="text-white font-medium">{hours}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-gold-500" />
                  <WaitTimeIndicator />
                </div>
              </div>

              <Link to="/book" className="btn-gold w-full">
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-16 section-padding bg-gold-gradient">
        <div className="max-w-3xl mx-auto text-center">
          <Droplets size={40} className="text-black mx-auto mb-4 opacity-60" />
          <h2 className="text-4xl font-display font-bold text-black">Ready for a Shine?</h2>
          <p className="text-black/60 mt-3 mb-8">Join 1,400+ happy members and keep your car sparkling year-round.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-black text-gold-500 hover:bg-black/80 transition-colors">
              Create Free Account
            </Link>
            <Link to="/book" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold border-2 border-black/30 text-black hover:bg-black/10 transition-colors">
              Book Now — No Account Needed
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
