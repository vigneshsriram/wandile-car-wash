import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/')
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/packages', label: 'Packages' },
    { to: '/book', label: 'Book Now' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black-800/95 backdrop-blur-md shadow-lg shadow-black/60 border-b border-electric-500/15' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Wandile Car Wash"
              className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform"
            />
            <span className="font-display text-lg md:text-xl font-semibold leading-tight">
              <span className="gold-text">Wandile</span>
              <span className="block text-white/80 text-xs md:text-sm font-sans font-normal tracking-widest uppercase">Car Wash</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-gold-500 bg-gold-500/10' : 'text-white/70 hover:text-white hover:bg-white/5'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <User size={16} className="text-gold-500" />
                  <span className="text-white/80">{user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} className={`text-white/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 card-dark py-1 shadow-xl">
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5">Dashboard</Link>
                    <Link to="/dashboard/vehicles" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5">My Vehicles</Link>
                    <Link to="/dashboard/billing" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5">Billing</Link>
                    <Link to="/dashboard/history" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5">History</Link>
                    <hr className="border-white/10 my-1" />
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2">
                      <LogOut size={14} />Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm py-2">Sign In</Link>
                <Link to="/signup" className="btn-gold text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black-800 border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-sm font-medium ${isActive ? 'text-gold-500 bg-gold-500/10' : 'text-white/70'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-outline text-sm py-2">Dashboard</Link>
                <button onClick={() => { handleSignOut(); setOpen(false) }} className="btn-outline text-sm py-2 text-red-400 border-red-400/50">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline text-sm py-2">Sign In</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="btn-gold text-sm py-2">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
