import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import PackageCard from '../components/PackageCard'
import { PACKAGES, ADD_ONS } from '../lib/packages'

const ALL_FEATURES = [
  'Soft-cloth exterior wash',
  'Spot-free rinse',
  'High-velocity air dry',
  'Clear-coat protectant',
  'Undercarriage wash',
  'Wheel brightener',
  'Hot wax',
  'Tire dressing',
  'Rain-X glass treatment',
  'Hand-applied ceramic sealant',
  'Interior vacuuming',
  'Window cleaning (inside & out)',
]

const PACKAGE_FEATURES = {
  basic:   [true,  true,  true,  false, false, false, false, false, false, false, false, false],
  works:   [true,  true,  true,  true,  true,  true,  false, false, false, false, false, false],
  ultimate:[true,  true,  true,  true,  true,  true,  true,  true,  true,  false, false, false],
  ceramic: [true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
}

export default function Packages() {
  const [monthly, setMonthly] = useState(false)

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-xs font-semibold tracking-widest text-gold-500 uppercase">Pricing</span>
        </div>
        <h1 className="text-5xl font-display font-bold text-center mb-4">
          Wash <span className="gold-text">Packages</span>
        </h1>
        <p className="text-white/50 text-center mb-10 max-w-xl mx-auto">
          Transparent pricing, no hidden fees. Subscribe for unlimited washes and save up to 30%.
        </p>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} monthly={monthly} featured={pkg.id === 'ultimate'} />
          ))}
        </div>

        {/* Feature comparison matrix */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center mb-8">Full Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-4 text-white/50 font-medium">Feature</th>
                  {PACKAGES.map((pkg) => (
                    <th key={pkg.id} className="p-4 text-center">
                      <div className={`font-semibold ${pkg.id === 'ultimate' ? 'gold-text' : 'text-white'}`}>{pkg.name}</div>
                      <div className="text-xs text-white/40 mt-1">${monthly ? pkg.monthlyPrice : pkg.price}/{monthly ? 'mo' : 'wash'}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_FEATURES.map((feature, i) => (
                  <tr key={feature} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                    <td className="p-4 text-white/60">{feature}</td>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="p-4 text-center">
                        {PACKAGE_FEATURES[pkg.id][i]
                          ? <Check size={16} className="text-gold-500 mx-auto" />
                          : <X size={16} className="text-white/20 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <h2 className="text-3xl font-display font-bold text-center mb-4">Available Add-Ons</h2>
          <p className="text-white/50 text-center mb-8">Customize any wash with extra services during checkout.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADD_ONS.map((addon) => (
              <div key={addon.id} className="card-dark p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                  <span className="text-white/80 text-sm">{addon.name}</span>
                </div>
                <span className="text-gold-500 font-semibold">+${addon.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link to="/book" className="btn-gold text-lg px-10 py-4">
            Book Your Wash Now
          </Link>
          <p className="text-white/30 text-sm mt-4">No account required for single washes · Instant confirmation</p>
        </div>
      </div>
    </div>
  )
}
