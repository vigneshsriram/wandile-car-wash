import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, ChevronRight, Shield, Zap, Award, Droplets } from 'lucide-react'
import PackageCard from '../components/PackageCard'
import { PACKAGES } from '../lib/packages'

const REVIEWS = [
  { name: 'Vignesh Sriram', stars: 5, text: 'Incredibly thorough job — my car looked brand new after the ceramic detail. Highly recommend!', date: '1 week ago' },
  { name: 'Trupti Jadhav', stars: 5, text: 'Super fast and affordable. The Ultimate Shield package is great value for the price.', date: '2 weeks ago' },
  { name: 'Sanket Gadkari', stars: 5, text: 'Friendly staff and spotless results every time. My go-to car wash in Harrison.', date: '3 weeks ago' },
  { name: 'Shraddha Gohad', stars: 5, text: 'Love how easy it is to book online. The Works package keeps my car looking clean all week.', date: '1 month ago' },
]

const GALLERY = [
  { before: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80', after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80', label: 'BMW 5 Series' },
  { before: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80', after: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80', label: 'Toyota Fortuner' },
]


function CarSVG() {
  return (
    <svg width="110" height="48" viewBox="0 0 110 48" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="55" cy="46" rx="46" ry="3" fill="black" fillOpacity="0.45" />
      {/* Side skirt */}
      <rect x="10" y="30" width="90" height="10" rx="2" fill="#990000" />
      {/* Main body */}
      <rect x="6" y="25" width="98" height="17" rx="4" fill="#CC0000" />
      {/* Cabin — low sloped roofline */}
      <path d="M24 25 L38 10 L72 9 L86 25Z" fill="#CC0000" />
      {/* Darker roof panel */}
      <path d="M30 24 L40 12 L71 11 L80 24Z" fill="#A80000" />
      {/* Windshield — deeply raked */}
      <path d="M42 23 L50 13 L69 12 L76 23Z" fill="#0a0a0a" fillOpacity="0.92" />
      {/* Window divider */}
      <line x1="58" y1="12" x2="58" y2="23" stroke="#880000" strokeWidth="1.5" />
      {/* Front wheel */}
      <circle cx="82" cy="39" r="10" fill="#111" />
      <circle cx="82" cy="39" r="7" fill="#222" />
      <line x1="82" y1="31" x2="82" y2="47" stroke="#999" strokeWidth="1.5" />
      <line x1="74" y1="39" x2="90" y2="39" stroke="#999" strokeWidth="1.5" />
      <line x1="76" y1="33" x2="88" y2="45" stroke="#777" strokeWidth="1" />
      <line x1="88" y1="33" x2="76" y2="45" stroke="#777" strokeWidth="1" />
      <circle cx="82" cy="39" r="2.5" fill="#bbb" />
      {/* Rear wheel */}
      <circle cx="28" cy="39" r="10" fill="#111" />
      <circle cx="28" cy="39" r="7" fill="#222" />
      <line x1="28" y1="31" x2="28" y2="47" stroke="#999" strokeWidth="1.5" />
      <line x1="20" y1="39" x2="36" y2="39" stroke="#999" strokeWidth="1.5" />
      <line x1="22" y1="33" x2="34" y2="45" stroke="#777" strokeWidth="1" />
      <line x1="34" y1="33" x2="22" y2="45" stroke="#777" strokeWidth="1" />
      <circle cx="28" cy="39" r="2.5" fill="#bbb" />
      {/* Headlight */}
      <rect x="103" y="26" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.95" />
      <rect x="103" y="32" width="5" height="3" rx="1" fill="#ffcc88" fillOpacity="0.7" />
      {/* Taillight */}
      <rect x="2" y="26" width="5" height="7" rx="1.5" fill="#ff3333" fillOpacity="0.9" />
      {/* Front splitter */}
      <rect x="103" y="36" width="6" height="2" rx="1" fill="#333" />
      {/* Door line */}
      <line x1="57" y1="25" x2="57" y2="37" stroke="#A80000" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  )
}

function ScrollCarPackages({ packages, monthly }) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 = section just entering viewport bottom, 1 = section top near viewport top
      const p = Math.max(0, Math.min(1, (vh * 0.85 - rect.top) / (vh * 0.55)))
      setProgress(p)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const thresholds = [0.18, 0.38, 0.58, 0.78]
  const visibleCount = thresholds.filter(t => progress >= t).length
  const carPct = Math.min(91, Math.max(0, progress * 105))

  return (
    <div ref={ref}>
      {/* Road */}
      <div className="relative h-16 sm:h-20 bg-black-800 rounded-2xl overflow-hidden mb-8 border border-electric-500/20">
        {/* Road edge lines */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-electric-500/20" />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-500/20" />
        {/* Lane dashes */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-0.5 flex items-center gap-3">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="h-0.5 w-8 bg-electric-400/25 shrink-0 rounded-full" />
          ))}
        </div>
        {/* Car */}
        <div
          className="absolute top-1/2"
          style={{ left: `${carPct}%`, transform: 'translate(-50%, -60%)', willChange: 'left' }}
        >
          <CarSVG />
        </div>
      </div>

      {/* Package cards revealed one by one */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, i) => (
          <div
            key={pkg.id}
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 0.55s ease, transform 0.55s ease',
            }}
          >
            <PackageCard pkg={pkg} monthly={monthly} featured={pkg.id === 'ultimate'} />
          </div>
        ))}
      </div>
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
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-hero-gradient2" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592805144716-feeccccef5ac?w=1920&q=60')] bg-cover bg-center opacity-[0.06]" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="mt-8 font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
            Your Car Deserves<br />
            <span className="gold-text">the Royal Treatment</span>
          </h1>
          <p className="mt-6 text-lg text-electric-300/80 max-w-2xl mx-auto leading-relaxed">
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
              { label: 'Cars Washed', value: '0' },
              { label: 'Happy Members', value: '6' },
              { label: 'Avg Rating', value: '5.0★' },
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
              { icon: Zap, title: 'Fast & Efficient', desc: 'Most washes completed in under 15 minutes. We respect your time.', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
              { icon: Shield, title: 'Paint Protection', desc: 'Soft-cloth technology that\'s gentle on your paint and clear coat.', color: 'text-electric-400', bg: 'bg-electric-400/10' },
              { icon: Award, title: 'Quality Guaranteed', desc: '100% satisfaction guarantee. Not happy? We\'ll rewash for free.', color: 'text-gold-500', bg: 'bg-gold-500/10' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card-dark p-6 flex gap-4 hover:border-electric-400/30 transition-colors duration-300">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-electric-300/60">{desc}</p>
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

          <ScrollCarPackages packages={PACKAGES} monthly={monthly} />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="card-dark p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-gold-500" fill="#D4AF37" />
                  ))}
                </div>
                <p className="text-sm text-electric-300/70 mb-4 leading-relaxed">"{r.text}"</p>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9!2d-74.1543!3d40.7448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25469a4c93f1b%3A0x1!2s300+Somerset+St%2C+Harrison%2C+NJ!5e0!3m2!1sen!2sus!4v1234567890"
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
                  <p className="font-medium text-white">300 Somerset St</p>
                  <p className="text-sm text-white/50">Harrison, NJ</p>
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

              <Link to="/book" className="btn-gold w-full">
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-16 section-padding bg-blue-gradient relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%)'}} />
        <div className="relative max-w-3xl mx-auto text-center">
          <Droplets size={40} className="text-white mx-auto mb-4 opacity-70" />
          <h2 className="text-4xl font-display font-bold text-white">Ready for a Shine?</h2>
          <p className="text-white/70 mt-3 mb-8">Join our growing community and keep your car sparkling year-round.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold bg-white text-blue-700 hover:bg-white/90 transition-colors shadow-lg">
              Create Free Account
            </Link>
            <Link to="/book" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold border-2 border-white/40 text-white hover:bg-white/10 transition-colors">
              Book Now — No Account Needed
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
