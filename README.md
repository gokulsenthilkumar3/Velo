# ev-share

**EV scooter sharing built for India's Tier-2 cities.** ev-share connects riders to reliable, nearby electric scooters while giving local operators the tools to run fleets, collect payments, understand demand, and prevent avoidable maintenance downtime.

## What it includes

- Android rider app for discovery, reservation, ride control, payments, and support.
- Operations and administrator web portals for fleet health, service work, pricing, geofences, and reporting.
- A modular backend for identity, bookings, fleet state, payments, notifications, analytics, and maintenance.
- Telemetry-driven fleet monitoring and a predictive-maintenance pipeline.

## Intended users

Riders use scooters for short local trips. Field operators rebalance and repair vehicles. City or business administrators manage service areas, policies, prices, and performance.

## Documentation

- [Product profile](docs/product-profile.md)
- [Product requirements document](docs/product/prd.md)
- [Architecture](docs/architecture.md)
- [System design](docs/system-design.md)
- [Technology stack](docs/technology-stack.md)

## Velo — Rider UI prototype

`velo-ui/dist/` contains a static HTML/CSS/JS prototype of the **Velo** rider-facing scooter discovery and reservation interface. It runs entirely in the browser with no build step.

### Running locally

```bash
cd velo-ui/dist
python -m http.server 8080
# then open http://localhost:8080
```

### Features demonstrated

- Search, filter (availability, battery), and sort scooters
- Map view with positioned scooter markers (available / held / unavailable states)
- Scooter detail panel — battery, pricing, parking rules
- 10-minute reservation hold with live countdown
- Reservation cancel (manual or auto-expiry)
- Toast notifications
- Fully responsive (desktop, tablet, mobile)
- Keyboard-accessible (Escape to close dialog, Enter/Space on cards)

## Development shape

The planned codebase is a TypeScript monorepo with an Expo/React Native Android app, a Next.js web application, NestJS backend modules, and shared contracts. Local development will require Node.js, Docker, PostgreSQL, Redis, and environment variables for mapping, payment, messaging, and AWS services. Provider selections remain configurable integration boundaries.

```text
velo-ui/     static rider discovery and reservation prototype
docs/        product and technical documentation
```

> This repository currently contains the product and technical specification plus the Velo static UI prototype. It does not yet contain the full application implementation.
