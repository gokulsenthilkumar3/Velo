# System design

## Domain services

| Module | Owns |
| --- | --- |
| Identity and access | Users, roles, sessions, consent, operator access policies. |
| Fleet | Vehicles, devices, current state, service zones, parking hubs, inspections. |
| Booking and rides | Reservations, ride state machine, fare inputs, trip records. |
| Payments | Payment intents, transactions, refunds, credits, reconciliation records. |
| Operations | Work orders, assignments, checklists, evidence, incidents. |
| Notifications | Delivery preferences, templates, provider delivery records. |
| Analytics and maintenance | Aggregates, reports, health features, risk scores, recommendations. |

## Primary entities

`User`, `Role`, `RiderProfile`, `Vehicle`, `TelemetryDevice`, `VehicleState`, `ServiceZone`, `ParkingHub`, `Reservation`, `Ride`, `Fare`, `PaymentTransaction`, `WorkOrder`, `Inspection`, `TelemetryEvent`, `MaintenanceRecommendation`, and `AuditEvent` are the primary records. Every operational record is city- and fleet-scoped; actions that alter money, access, vehicle availability, or ride state are auditable.

## State models

```text
Vehicle: available → reserved → in_ride → available
                       │             │
                       └→ unavailable ← maintenance / charging / incident

Reservation: active → released | expired | converted_to_ride
Ride: initiated → active → ending → completed | disputed | failed
Work order: open → assigned → in_progress → completed | cancelled
```

Only the booking/rides module transitions a customer-facing vehicle state. Operations may mark a vehicle unavailable at any time; this blocks new reservations and preserves the reason.

## API and event contracts

- REST/JSON APIs are versioned under `/v1`, authenticated with short-lived bearer tokens, and authorized by role plus city/fleet scope.
- Commands that create a reservation, start/end a ride, or create/capture/refund a payment accept idempotency keys.
- Device telemetry is accepted through authenticated IoT topics and normalized to a versioned `vehicle.telemetry.received` event.
- Domain events such as `reservation.created`, `ride.completed`, `payment.failed`, `vehicle.fault.detected`, and `maintenance.recommended` are delivered asynchronously. Consumers are idempotent and use retry plus dead-letter handling.

## Correctness and failure handling

- Reservation creation checks availability, zone eligibility, and rider eligibility in one database transaction; a short Redis lock reduces contention while PostgreSQL remains the source of truth.
- Unlock and lock commands record requested, acknowledged, timed-out, and failed outcomes. A device acknowledgement is required before the rider-facing state changes.
- End-ride validation checks the latest location, parking rule, lock acknowledgement, and outstanding balance. Disputed or uncertain endings enter a recoverable review queue instead of silently completing.
- Payment provider webhooks are signature-verified, deduplicated, recorded before processing, and reconciled by scheduled workers.
- Telemetry is append-only in object storage; late or duplicated messages are tolerated through event IDs and timestamp-based state updates.

## Security and privacy

- Encrypt data in transit and at rest; isolate databases and workers in private network segments.
- Use least-privilege AWS IAM roles, Secrets Manager, WAF/rate limits, dependency scanning, and structured audit logs.
- Store only data needed to operate rides and comply with policy. Limit access to precise location, payment tokens, and identity data through role, purpose, and retention controls.
- Never store raw card details; the payment provider tokenizes payment instruments.

## Scale and observability

Scale API and worker containers independently from queue depth, CPU, and request latency. Partition high-volume operational queries by city/fleet and use read replicas or precomputed aggregates for dashboards. Monitor booking/unlock failure, API latency, payment outcomes, telemetry freshness, queue age, dead-letter volume, device disconnects, available-fleet percentage, and maintenance alert quality. Alerts include a runbook link and an accountable operations or engineering owner.
