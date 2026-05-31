import { Check, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PackageCard({ pkg, monthly = false, featured = false, onSelect }) {
  const price = monthly ? pkg.monthlyPrice : pkg.price

  return (
    <div className={`relative flex flex-col rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      ${featured
        ? 'bg-black-700 border-gold-500 shadow-lg shadow-gold-500/20'
        : 'bg-black-700 border-white/10 hover:border-gold-500/40'
      }`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gold-gradient text-black shadow-lg">
            <Star size={10} fill="currentColor" />
            {pkg.badge}
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-xl font-display font-semibold mb-1 ${featured ? 'gold-text' : 'text-white'}`}>
            {pkg.name}
          </h3>
          <div className="flex items-end gap-1">
            <span className="text-4xl font-bold text-white">${price}</span>
            <span className="text-white/40 text-sm mb-1">/{monthly ? 'mo' : 'wash'}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {pkg.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
              <Check size={14} className="text-gold-500 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Best for */}
        <p className="text-xs text-white/40 mb-6 italic border-t border-white/5 pt-4">
          Best for: {pkg.bestFor}
        </p>

        {/* CTA */}
        {onSelect ? (
          <button
            onClick={() => onSelect(pkg)}
            className={featured ? 'btn-gold w-full' : 'btn-outline w-full'}
          >
            Select Package
          </button>
        ) : (
          <Link
            to="/book"
            state={{ packageId: pkg.id }}
            className={`${featured ? 'btn-gold' : 'btn-outline'} w-full text-center`}
          >
            Book Now
          </Link>
        )}
      </div>
    </div>
  )
}
