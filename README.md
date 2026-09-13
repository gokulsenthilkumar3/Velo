# ev-share

**EV scooter sharing built for India’s Tier-2 cities.** ev-share connects riders to reliable, nearby electric scooters while giving local operators the tools to run fleets, collect payments, understand demand, and prevent avoidable maintenance downtime.

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

## Development shape

The planned codebase is a TypeScript monorepo with an Expo/React Native Android app, a Next.js web application, NestJS backend modules, and shared contracts. Local development will require Node.js, Docker, PostgreSQL, Redis, and environment variables for mapping, payment, messaging, and AWS services. Provider selections remain configurable integration boundaries.

```text
apps/        rider-mobile, operations-web
services/    NestJS API modules and workers
packages/    shared types, API client, UI and configuration
infra/       AWS infrastructure and deployment definitions
docs/        product and technical documentation
```

This repository currently contains the product and technical specification; it does not yet contain an application implementation.

# Velo
