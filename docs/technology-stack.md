# Technology stack

| Layer | Choice | Why |
| --- | --- | --- |
| Rider client | React Native with Expo, TypeScript | Fast Android-first delivery, OTA update support, shared mobile patterns, and a path to iOS later. |
| Web portals | Next.js, React, TypeScript | Responsive operations and admin interfaces with mature routing, data-fetching, and deployment support. |
| API platform | NestJS, TypeScript | Modular domain design, dependency injection, validation, OpenAPI support, and shared language/types with clients. |
| Transaction data | PostgreSQL on Amazon RDS | Strong transactional guarantees for reservations, rides, payments, and operational records. |
| Cache and coordination | Redis on ElastiCache | Reservation contention control, rate limiting, sessions, and short-lived response caching. |
| Async processing | Amazon EventBridge, SQS, ECS workers | Durable event delivery, independently scaled jobs, retries, and dead-letter queues. |
| Telemetry | AWS IoT Core, S3 | Authenticated device connectivity and cost-effective durable raw-event retention. |
| Analytics | TypeScript workers, PostgreSQL aggregates, S3 | Start with operational analytics near transactional data; retain raw data for later warehouse/model evolution. |
| Infrastructure | AWS CDK, ECS Fargate, ALB, CloudFront, WAF | Repeatable infrastructure, containerized services, managed scaling, and protected public access. |
| Observability | CloudWatch, OpenTelemetry | Central logs, metrics, traces, dashboards, alarms, and portable instrumentation. |
| Quality and delivery | pnpm workspace, ESLint, Prettier, Jest, Playwright, GitHub Actions | Shared tooling, automated unit/integration/e2e checks, and consistent delivery gates. |

## Integration rules

Map, payment, messaging, and identity-verification vendors are configured through adapter interfaces and environment-specific secrets. Domain code depends on internal interfaces rather than vendor SDKs directly. Each integration needs timeout, retry, webhook verification where applicable, observability, and a tested degraded-mode path.

## Planned repository layout

```text
apps/mobile-rider        Expo Android application
apps/operations-web      Next.js operations and admin portal
services/api             NestJS modular API
services/workers         Event consumers, aggregation, and maintenance scoring
packages/contracts       Shared API DTOs, event schemas, and generated clients
packages/config          Shared validation and environment configuration
infra                    AWS CDK stacks
```
