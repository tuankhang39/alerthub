# AlertHub Backend Challenge

# Overview

AlertHub is a backend service for managing IoT devices and processing realtime alert events.

The system supports:

- Device registration and status filtering
- Realtime event ingestion
- Asynchronous event processing
- Alert creation and filtering
- Automatic critical alert escalation
- Alert search by keyword or device information

---

# Running the Project

### Clone project

```bash
git clone https://github.com/tuankhang39/alerthub
cd alerthub
```

### Prerequisites

- Docker
- Docker Compose

### Start all services

```bash
docker-compose up --build
```

This starts PostgreSQL, Redis, and the NestJS app. Migrations run automatically on startup.

### Application URLs

| Service      | URL                             |
| ------------ | ------------------------------- |
| API          | http://localhost:3000           |
| Swagger UI   | http://localhost:3000/api-docs  |
| Health Check | http://localhost:3000/v1/health |

# API Testing

All APIs are documented in Swagger UI.

Users can test the entire system directly from:

```bash
http://localhost:3000/api-docs
```

Swagger provides:

- request body examples
- query parameter testing
- realtime API execution
- response previews

## Quick Test Flow

### 1. Create Device

Register a new device.

```http
POST /api/v1/devices
```

---

### 2. Send Event

Send realtime alert events from the device.

```http
POST /api/v1/events
```

Events are processed asynchronously through Redis queue workers.

---

### 3. Get Alerts

Retrieve generated alerts.

```http
GET /api/v1/alerts
```

---

### 4. Trigger Critical Escalation

Send more than 5 events of the same type within 60 seconds.

```http
POST /api/v1/events
```

Then verify escalated alerts:

```http
GET /api/v1/alerts?severity=critical
```

---

### 5. Search Alerts

Search alerts by:

- message keyword
- device name
- device ID

```http
GET /api/v1/alerts?search=temperature
```

---

# Tech Stack

- Node.js
- NestJS
- PostgreSQL
- Redis
- Bull Queue
- TypeORM
- Docker / Docker Compose
- Swagger

---

# Architecture

The system follows an event-driven architecture using asynchronous queue processing.

Flow:

Device -> REST API -> Redis Queue -> Worker Processor -> PostgreSQL

Main processing flow:

1. Device sends event via REST API
2. Event is pushed into Redis queue
3. Worker processes event asynchronously
4. Raw event is persisted
5. Escalation rule is evaluated
6. Alert is created and stored

This approach keeps the API non-blocking and improves scalability under higher event throughput.

### Key Design Decisions

**Queue-based event ingestion**
Devices POST events to the API which immediately enqueues them and returns `202 Accepted`. Processing happens asynchronously in a Bull worker. This decouples ingestion latency from processing time and allows retry on failure.

**Sliding window for escalation**
Used a Redis Sorted Set with timestamp as score instead of a fixed counter. This gives an accurate 60-second rolling window — a fixed window counter would reset at arbitrary intervals and miss bursts that span two windows.

```
zadd  → add current event (score = timestamp)
zremrangebyscore → remove events older than 60s
zcard → count remaining events in window
```

If Redis is unavailable, the rule service fails open (returns `false`) — alerts are still created without escalation rather than being lost entirely.

**Transaction for event + alert creation**
Both `createEvent` and `createAlert` run inside a single TypeORM transaction. If alert creation fails, the event is also rolled back, avoiding orphaned records.

**Full-text search**
Uses PostgreSQL `tsvector` / `plainto_tsquery` for message content search, combined with `ILIKE` for device name and ID matching. Sufficient for this scale without introducing Elasticsearch.

# Dependencies

| Package                                  | Reason                                                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@nestjs/bull`                           | Queue-based async event processing. Bull provides the NestJS integration layer, BullMQ is the underlying Redis-backed queue engine with better TypeScript support than the legacy `bull` package |
| `@nestjs/typeorm`                        | TypeORM integration for NestJS — chosen over Prisma for familiarity with repository pattern and native transaction support via `DataSource`                                                      |
| `@nestjs/terminus`                       | Health check endpoints with minimal setup — provides built-in indicators for TypeORM and HTTP                                                                                                    |
| `@nestjs/config`                         | Environment variable management with `.env` file support and typed config via `ConfigService`                                                                                                    |
| `@nestjs/swagger` + `swagger-ui-express` | Auto-generates API documentation from decorators — serves as the primary interface for reviewers to test endpoints                                                                               |
| `@nestjs-modules/ioredis` + `ioredis`    | Redis client with pipeline and sorted set support — used for both Bull queue transport and sliding window escalation logic                                                                       |
| `pg`                                     | PostgreSQL driver required by TypeORM                                                                                                                                                            |
| `class-validator` + `class-transformer`  | DTO validation via decorators — integrates with NestJS `ValidationPipe` to reject invalid requests before they reach service layer                                                               |

## Time Spent

| Area                                  | Time      |
| ------------------------------------- | --------- |
| Project setup & Docker                | 1h        |
| Database design & migrations          | 1h        |
| Device APIs                           | 1h        |
| Queue & worker processing             | 2h        |
| Alert filtering & search              | 1.5h      |
| Escalation rule (sliding window)      | 1h        |
| Swagger, validation, logging, cleanup | 1h        |
| **Total**                             | **~8.5h** |

## Known Limitations

- **No authentication** — API endpoints are open. Would add JWT-based auth as a next step.
- **Search is basic** — `tsvector` works for English. Multi-language support or fuzzy matching would require additional configuration or Elasticsearch.
