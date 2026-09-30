# PRODUCT.md

## Overview
**Product:** Golden Kulcha
**Platform:** web
**Stack:** React 19 + Vite + Tailwind CSS frontend with Python FastAPI (`uvicorn`) backend and MongoDB database

## Primary Users & Jobs
- **Diners & Local Customers:** Browse the Golden Kulcha menu, select products & custom quantities, manage cart without mandatory login, leave Google Reviews, follow Instagram (`@golden_kulchaco`), submit feedback via WhatsApp, log in at checkout to place food orders, and track order history & ratings.

## Position & Value Proposition
- **Core Offering:** High-quality, authentic, freshly baked Chole Kulcha served with warm hospitality and premium digital ordering.
- **Positioning:** Minimal, elevated golden-and-black dining experience that bridges street-food charm with modern digital convenience.
- **Unified Design System:** Consistent luxury dark-gold visual theme (`#d4af37`, `#f2d06b` on `#0b0b0b`) across landing, menu, cart, checkout, dashboard, order history, and rating screens.

## Core Workflows
1. **Public Menu & Unauthenticated Cart:** Visit `/` directly to view fresh kulcha menu, filter by categories, and add items to cart without forced authentication.
2. **Portfolio Demo Access & Login Gate:** 1-Click Demo Customer and Demo Merchant login options on the Sign In page for rapid portfolio evaluation, alongside standard customer registration and authentication at checkout.
3. **Order Placement & Persistence:** Review cart summary, place orders, and persist order records in MongoDB database (`POST /v1/orders`).

4. **Order History & Star Ratings:** Track order status, rate completed orders with 1–5 stars and reviews (`POST /v1/orders/{id}/rate`).
5. **Google & Social Engagement:** Direct one-click Google review link, Instagram updates, and WhatsApp feedback integration.

## Constraints & Assets
- **Logo / Imagery:** `IMAGE/gold.jpeg` (favicon), `IMAGE/BACK.jpeg` (background texture)
- **Analytics:** Vercel Analytics integration
- **Theme:** Luxury Gold (`#d4af37`, `#f2d06b`) on dark overlay (`#0b0b0b`)

## Commands in Use
| Command | Action |
|---|---|
| `impeccable shape [feature]` | Plan a new UX/UI feature or flow before writing code |
| `impeccable document` | Generate `DESIGN.md` from your current codebase |
| `impeccable audit` | Run technical checks for responsiveness, performance & accessibility |
| `impeccable polish` | Pass over current UI to improve visual hierarchy and micro-interactions |
| `impeccable bolder` | Make safe or subtle UI elements stand out dramatically |
| `impeccable animate` | Add smooth, purposeful micro-animations to components |

## Open Decisions
- *Menu expansion / Online payment gateway integration (future scope)*
