# Architecture

## System context

```text
Android rider app ─┐
Operations web ────┼── HTTPS/API gateway ── NestJS platform ── PostgreSQL
Admin web ─────────┘          │                 │        │
                              │                 │        ├── Redis
Telematics devices ── IoT ingest/event stream ──┘        ├── S3 data lake
                                                        └── queues/workers
External integrations: maps, payment provider, messaging provider, identity verification
```

## Components

| Component | Responsibility |
| --- | --- |
| Android rider app | Account, map discovery, reservation, ride lifecycle, payment and support. |
| Operations/admin web | Fleet map, policies, field tasks, pricing, reporting, and access administration. |
| API platform | Authenticates clients and exposes domain APIs with role-based authorization. |
| Domain modules | Identity, riders, fleet, booking/rides, payments, notifications, analytics, maintenance. |
| IoT ingest | Validates device identity, normalizes telemetry, writes current state, and publishes events. |
| Workers | Process notifications, payment reconciliation, data aggregation, alerts, and maintenance scoring. |
| Data stores | PostgreSQL holds transactional truth; Redis supports ephemeral coordination; S3 retains raw telemetry and exports. |

## AWS deployment baseline

- CloudFront and AWS WAF protect public web/API entry points; API requests reach containerized services on ECS Fargate behind an Application Load Balancer.
- Amazon RDS for PostgreSQL stores transactional data with Multi-AZ resilience; ElastiCache for Redis holds reservation locks, rate limits, and short-lived cache entries.
- AWS IoT Core accepts authenticated device telemetry. EventBridge and SQS decouple downstream work; ECS workers consume queues with retry and dead-letter queues.
- S3 stores raw telemetry, reports, and evidence. CloudWatch centralizes logs, metrics, alarms, and tracing; Secrets Manager stores integration credentials.

## Data flow

1. A device sends signed telemetry to IoT ingestion. The system validates the device, persists current fleet state, archives the raw event, and emits a normalized vehicle event.
2. The booking module uses an atomic transactional update plus a Redis lock to reserve an eligible scooter. It emits booking events for notifications and analytics.
3. Ride events update the authoritative ride record, fleet state, payment status, and downstream aggregates asynchronously.
4. Analytics transforms operational events into reporting datasets. The maintenance worker combines telemetry and service history into an explainable risk score and work-order recommendation.

## Design boundaries

All third-party providers are accessed through adapters, keeping the map, payment, messaging, and identity vendors replaceable. The initial architecture is a modular monolith plus asynchronous workers; modules may be independently extracted only when measurable scaling or ownership needs justify it.
