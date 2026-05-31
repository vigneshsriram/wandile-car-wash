import { Link } from 'react-router-dom'
import { Droplets, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black-800 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center">
                <Droplets size={20} className="text-black" />
              </div>
              <span className="font-display text-xl font-semibold gold-text">Wandile Car Wash</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Premium car care with every wash. Your vehicle deserves the best.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-500/20 flex items-center justify-center transition-colors">
                <Instagram size={16} className="text-white/60" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-500/20 flex items-center justify-center transition-colors">
                <Facebook size={16} className="text-white/60" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-500/20 flex items-center justify-center transition-colors">
                <Twitter size={16} className="text-white/60" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/packages" className="hover:text-gold-500 transition-colors">Basic Wash</Link></li>
              <li><Link to="/packages" className="hover:text-gold-500 transition-colors">The Works</Link></li>
              <li><Link to="/packages" className="hover:text-gold-500 transition-colors">Ultimate Shield</Link></li>
              <li><Link to="/packages" className="hover:text-gold-500 transition-colors">Full Ceramic Detail</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/signup" className="hover:text-gold-500 transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-gold-500 transition-colors">Sign In</Link></li>
              <li><Link to="/dashboard" className="hover:text-gold-500 transition-colors">Dashboard</Link></li>
              <li><Link to="/book" className="hover:text-gold-500 transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-gold-500 mt-0.5 shrink-0" />
                <span>123 Shine Street, Johannesburg, ZA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold-500 shrink-0" />
                <a href="tel:+27111234567" className="hover:text-gold-500 transition-colors">+27 11 123 4567</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gold-500 shrink-0" />
                <a href="mailto:hello@wandilecarwash.co.za" className="hover:text-gold-500 transition-colors">hello@wandilecarwash.co.za</a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-white/40">Mon–Sat: 7am–7pm</p>
              <p className="text-xs text-white/40">Sunday: 8am–5pm</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Wandile Car Wash. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60">Privacy Policy</a>
            <a href="#" className="hover:text-white/60">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
