# 🛒 Online Marketplace — Microservices Backend

A production-ready e-commerce backend built with **microservices architecture**.
9 independent services communicate via **RabbitMQ**, deployed on **AWS ECS Fargate** using **Docker**.
Features an **AI-powered shopping assistant** built with LangChain, Google Gemini & LangGraph.

[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://docker.com)
[![AWS](https://img.shields.io/badge/AWS-ECS%20Fargate%20%2B%20ECR-orange)](https://aws.amazon.com)
[![License](https://img.shields.io/badge/License-ISC-lightgrey)](LICENSE)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Runtime | Node.js 18, Express.js |
| Database | MongoDB, Redis |
| Messaging | RabbitMQ (AMQP) |
| AI | LangChain, Google Gemini, LangGraph, Socket.io |
| Auth | JWT, bcryptjs, Redis token blacklisting |
| Validation | express-validator |
| Testing | Jest, Supertest, mongodb-memory-server |
| DevOps | Docker, AWS ECS Fargate, AWS ECR |

---

## Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **Gateway** | 3000 | Single entry point — routes all requests to respective services |
| **Auth** | 5000 | Register, login, logout — JWT auth with Redis token blacklisting |
| **Product** | 5001 | Product CRUD, search, categories, inventory management |
| **Cart** | 5002 | Add/remove items, cart persistence, quantity management |
| **Order** | 5003 | Place orders, order history, status tracking |
| **Payment** | 5004 | Payment processing, payment status updates |
| **Notification** | 5005 | Email/SMS notifications triggered via RabbitMQ events |
| **Seller** | 5006 | Seller dashboard, product listing management |
| **AI Buddy** | 5007 | 🤖 AI shopping assistant — real-time chat via Socket.io |

---

## AI Buddy Service (Highlight)

> The most unique feature of this project — an intelligent shopping assistant.

**Stack:** LangChain · Google Gemini · LangGraph · Socket.io · Zod · MongoDB

**What it does:**
- Real-time AI chat via **WebSockets** (Socket.io)
- **LangGraph** manages multi-step conversation flows and agent state
- **Google Gemini** as the underlying LLM for natural language understanding
- **LangChain** for tool calling, memory, and prompt management
- **Zod** for structured output validation from the AI model
- Authenticated via JWT — only logged-in users can access the assistant
- Conversation history persisted in **MongoDB**

**Use cases:**
- "Show me running shoes under ₹2000"
- "What's in my cart?" / "Place my order"
- Product recommendations based on user history

---

## Architecture

```
Client
  │
  ▼
[API Gateway :3000]
  │
  ├──► [Auth Service :5000]        MongoDB + Redis
  ├──► [Product Service :5001]     MongoDB
  ├──► [Cart Service :5002]        MongoDB + Redis
  ├──► [Order Service :5003]       MongoDB
  ├──► [Payment Service :5004]     MongoDB
  ├──► [Seller Service :5006]      MongoDB
  └──► [AI Buddy :5007] ◄──────── Socket.io (WebSocket)
                                    Google Gemini + LangGraph

All services ──► [RabbitMQ] ──► [Notification Service :5005]

Deployment: Each service runs as an independent ECS Fargate Task
            Images stored in AWS ECR
```

---

## Project Structure

```
Online-Market-Place-Using-Microservices-Architecture/
├── AI Buddy/          # AI shopping assistant (LangChain + Gemini)
├── Auth/              # Authentication & authorization
├── Cart/              # Shopping cart management
├── Notification/      # Event-driven notifications
├── Order/             # Order management
├── Payment/           # Payment processing
├── Product/           # Product catalog
├── seller/            # Seller management
├── docker-compose.yml # Run all services locally with one command
└── README.md
```

---

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Google Gemini API key (for AI Buddy)

### Run locally

```bash
# 1. Clone the repo
git clone https://github.com/KajalGupta2345/Online-Market-Place-Using-Microservices-Architecture.git
cd Online-Market-Place-Using-Microservices-Architecture

# 2. Setup environment variables for each service
cp Auth/.env.example Auth/.env
cp "AI Buddy"/.env.example "AI Buddy"/.env
# ... repeat for other services

# 3. Start all services
docker-compose up --build
```

### Environment Variables

Each service has its own `.env.example`. Key variables:

```bash
# Common across services
MONGO_URI=mongodb://localhost:27017/servicename
JWT_SECRET=your_jwt_secret
RABBIT_URL=amqp://localhost

# Auth service
REDIS_URL=redis://localhost:6379

# AI Buddy service
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

---

## API Endpoints

### Auth Service (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create new user account |
| POST | `/login` | Login and receive JWT cookie |
| POST | `/logout` | Logout and blacklist token |
| GET | `/user/me` | Get current user profile |
| POST | `/user/me/addresses` | Add delivery address |
| GET | `/user/me/addresses` | Get all addresses |
| DELETE | `/user/me/addresses/:id` | Remove an address |

### AI Buddy Service
| Type | Event | Description |
|------|-------|-------------|
| WebSocket | `connect` | Establish authenticated connection |
| WebSocket | `message` | Send message to AI assistant |
| WebSocket | `response` | Receive AI response stream |
| WebSocket | `disconnect` | End session |

> Full API documentation: [Postman Collection](#) ← *link add karo*

---

## Testing

Auth service has **85%+ code coverage** with unit and integration tests.

```bash
cd Auth
npm test
```

**Test coverage includes:**
- User registration & login flows
- JWT authentication middleware
- Token blacklisting via Redis
- Address CRUD operations
- Rate limiting

---

## Deployment

All services are containerized and deployed as independent tasks on **AWS ECS Fargate** via **AWS ECR**.

> Fargate is a serverless compute engine for containers — no EC2 instances to manage.

```bash
# 1. Authenticate Docker with ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin <ECR_URL>

# 2. Build for linux/amd64 (required for Fargate)
docker buildx build --platform linux/amd64 -t <service-name> .

# 3. Tag and push image to ECR
docker tag <service-name>:latest <ECR_URL>/<service-name>:latest
docker push <ECR_URL>/<service-name>:latest

# 4. ECS Fargate picks up the new image and deploys automatically
```

**Each service is deployed as an independent Fargate Task Definition with:**
- Its own CPU & memory allocation
- Auto-scaling based on load
- No server management required

---

## What I Learned

- Designing **decoupled microservices** with clear boundaries
- **Async inter-service communication** using RabbitMQ (event-driven)
- **AI agent orchestration** with LangGraph for stateful conversations
- **Real-time communication** using Socket.io in a microservices setup
- **JWT + Redis** for stateless yet revocable authentication
- **Serverless container deployment** using AWS ECS Fargate + ECR
- Writing **integration tests** with in-memory MongoDB for isolated testing

---

## Author

**Kajal Gupta**
[GitHub](https://github.com/KajalGupta2345) · [LinkedIn](https://www.linkedin.com/in/kajal-kumari-357b85253/)
