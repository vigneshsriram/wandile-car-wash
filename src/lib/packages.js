export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Wash',
    price: 2,
    monthlyPrice: 6,
    color: 'from-zinc-700 to-zinc-600',
    badge: null,
    features: [
      'Soft-cloth exterior wash',
      'Spot-free rinse',
      'High-velocity air dry',
    ],
    bestFor: 'Quick maintenance washes between detailings.',
  },
  {
    id: 'works',
    name: 'The Works',
    price: 3,
    monthlyPrice: 8,
    color: 'from-blue-900 to-blue-800',
    badge: 'Popular',
    features: [
      'Everything in Basic Wash',
      'Clear-coat protectant',
      'Undercarriage wash',
      'Wheel brightener',
    ],
    bestFor: 'Everyday drivers wanting a clean, protected shine.',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Shield',
    price: 4,
    monthlyPrice: 10,
    color: 'from-gold-800 to-gold-700',
    badge: 'Best Value',
    features: [
      'Everything in The Works',
      'Hot wax',
      'Tire dressing',
      'Rain-X glass treatment',
    ],
    bestFor: 'Customers seeking long-term paint protection and a showroom finish.',
  },
  {
    id: 'ceramic',
    name: 'Full Ceramic Detail',
    price: 5,
    monthlyPrice: 13,
    color: 'from-black-500 to-black-400',
    badge: 'Premium',
    features: [
      'Everything in Ultimate Shield',
      'Hand-applied ceramic sealant',
      'Interior vacuuming',
      'Window cleaning (inside & out)',
    ],
    bestFor: 'Premium care, luxury vehicles, or deep seasonal cleaning.',
  },
]

export const ADD_ONS = [
  { id: 'ceramic_boost', name: 'Ceramic Sealant Boost', price: 15 },
  { id: 'odor_bomb', name: 'Odor Eliminator Bomb', price: 8 },
  { id: 'engine_clean', name: 'Engine Bay Clean', price: 20 },
  { id: 'pet_hair', name: 'Pet Hair Removal', price: 12 },
  { id: 'headlight', name: 'Headlight Restoration', price: 25 },
]
