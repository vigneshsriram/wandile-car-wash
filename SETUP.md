# Wandile Car Wash — Setup Guide

## 1. Install dependencies
```bash
cd car-wash-website
npm install
```

## 2. Configure environment
```bash
cp .env.example .env
```
Fill in `.env` with your keys:

| Key | Where to get it |
|-----|----------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Cloud Console → Maps JavaScript API |

## 3. Set up Supabase database
1. Go to Supabase Dashboard → SQL Editor
2. Paste the contents of `supabase/schema.sql` and run it
3. Go to Authentication → Providers → enable **Google** OAuth (optional)

## 4. Run locally
```bash
npm run dev
```
Visit http://localhost:5173

## 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
```
Add your `.env` values in Vercel → Project → Settings → Environment Variables.

---

## Stripe Setup
1. Create 4 products in Stripe (Basic, Works, Ultimate, Ceramic) with both one-time and recurring prices
2. Copy the Price IDs into `src/lib/stripe.js` → `STRIPE_PRICES`
3. Create a backend endpoint (`/api/create-checkout-session`) to handle secure Stripe Checkout session creation — Supabase Edge Functions or a Next.js API route work great for this

## Google OAuth (Supabase)
1. Supabase Dashboard → Authentication → Providers → Google → Enable
2. Add your Google OAuth Client ID & Secret
3. Add `https://your-project.supabase.co/auth/v1/callback` to Google's authorized redirect URIs
