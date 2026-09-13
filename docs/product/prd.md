# Product requirements document — ev-share

## Problem and opportunity

Tier-2 cities need affordable, flexible ways to cover short distances where walking is slow, public transport is incomplete, and owning a vehicle is costly. Operators also lack a unified way to keep shared EV fleets available, safe, charged, and economically healthy. ev-share delivers a rider experience and an operational platform around the same real-time fleet.

## Users

| Persona | Need |
| --- | --- |
| Rider | Find, reserve, unlock, ride, pay for, and get help with a nearby scooter. |
| Field operator | Locate vehicles, inspect health, rebalance, charge, and complete maintenance work. |
| Operations manager | Monitor availability, incidents, service areas, pricing, and utilization. |
| Administrator | Control access, policy, financial reconciliation, and performance reporting. |

## Goals

- Make a scooter’s availability and price clear before a rider commits.
- Maintain accurate vehicle, booking, ride, and payment state across clients.
- Give operators actionable fleet health and maintenance work queues.
- Turn ride and telemetry data into demand, revenue, and reliability insights.

## Functional requirements

### Rider experience

- Account creation, phone-based sign-in, identity/profile verification where policy requires it, and consent capture.
- Map/list discovery with scooter location, charge estimate, fare preview, service-zone and parking rules.
- Time-limited reservation, QR/Bluetooth-assisted unlock, start/end ride confirmation, trip receipt, history, ratings, and support requests.
- Saved payment methods, fare authorization/capture, refunds, credits, and failed-payment recovery.
- Push notifications for reservation expiry, ride state, payment outcome, service notices, and support updates.

### Fleet and operations

- Vehicle registry, status, location, battery, odometer, firmware, inspection and ownership records.
- Fleet map, filters, service zones/geofences, parking hubs, pricing rules, vehicle activation/suspension, and incident handling.
- Field work orders for inspection, charging, repair, retrieval, and rebalancing, with assignment, checklist, evidence, and closure.
- Telemetry intake for location, battery/charging, lock state, motion, fault codes, and connectivity; stale or anomalous signals produce alerts.

### Analytics and maintenance

- Role-appropriate dashboards for active rides, availability, utilization, revenue, trip patterns, payment performance, and operations backlog.
- Exportable reports and date/city/fleet filters.
- Health scoring and maintenance-risk alerts based on telemetry, ride history, fault events, and completed service work; recommendations always remain reviewable by an operator.

## Core journeys

1. A rider selects an eligible scooter, sees its fare and rules, and reserves it. The platform temporarily changes its state to reserved and prevents conflicting bookings.
2. The rider scans the scooter, completes payment authorization if needed, and starts the ride after a successful unlock acknowledgement.
3. The rider parks in an eligible zone and ends the ride. The service validates end conditions, locks the vehicle, calculates the fare, captures payment, and issues a receipt.
4. A field operator receives a low-battery, fault, or maintenance-risk task, records work and evidence, and returns the scooter to service only after the required checks pass.

## Non-goals

- Private scooter sales, leasing, or marketplace operations.
- iOS rider application in the initial client scope.
- Autonomous vehicle operation or unattended safety decisions.
- Replacing payment, map, or messaging providers with in-house equivalents.

## Success measures

- Rider: booking-to-unlock success rate, completed-ride rate, repeat-rider rate, support contacts per 100 rides.
- Fleet: available scooters as a share of deployed scooters, ride utilization, out-of-service duration, and maintenance completion time.
- Business: gross booking value, net revenue per scooter/day, payment success rate, and refund rate.
- Reliability: telemetry freshness, unplanned failure rate, and reduction in breakdown-related downtime after maintenance recommendations launch.

## Delivery roadmap

| Phase | Outcome |
| --- | --- |
| Foundation | Identity, roles, vehicle registry, service zones, telemetry ingestion, observability, Android rider shell, and web operations portal. |
| Marketplace operations | Discovery, reservation, unlock/lock, complete ride lifecycle, payments, receipts, notifications, operator work orders, and essential reporting. |
| Optimization | Pricing controls, richer dashboards, rebalancing support, exports, anomaly alerts, and city/fleet performance insights. |
| Predictive maintenance | Health scores, explainable risk alerts, prioritized work queues, and accuracy/downtime evaluation. |
