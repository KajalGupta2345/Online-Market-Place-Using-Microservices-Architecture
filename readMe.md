# 🛒 Vendex — Online Marketplace (Microservices Backend)

A production-style e-commerce backend built with **microservices architecture**.
8 independent services communicate via **RabbitMQ**, each with its own MongoDB database, deployed independently.
Features an **AI-powered shopping assistant** built with LangChain, Google Gemini & LangGraph.

[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://docker.com)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7)](https://render.com)
[![License](https://img.shields.io/badge/License-ISC-lightgrey)](LICENSE)

---

## 🔗 Live Demo — All Services

> Each microservice is deployed independently and is live right now. Click any link to verify the service is running.

| Service | Live URL | Description |
|---------|----------|-------------|
| **Auth** | [online-market-place-using-microservices.onrender.com](https://online-market-place-using-microservices.onrender.com) | Register, login, JWT auth, addresses |
| **Product** | [...oer5.onrender.com](https://online-market-place-using-microservices-oer5.onrender.com) | Product CRUD, inventory, image upload |
| **Cart** | [...bhg2.onrender.com](https://online-market-place-using-microservices-bhg2.onrender.com) | Add/remove items, cart persistence |
| **Order** | [...055a.onrender.com](https://online-market-place-using-microservices-055a.onrender.com) | Place orders, order history, tracking |
| **Payment** | [...xk5l.onrender.com](https://online-market-place-using-microservices-xk5l.onrender.com) | Razorpay integration, payment verification |
| **Notification** | [...fycc.onrender.com](https://online-market-place-using-microservices-fycc.onrender.com) | Event-driven emails via RabbitMQ + Brevo |
| **Seller** | [...iifi.onrender.com](https://online-market-place-using-microservices-iifi.onrender.com) | Seller dashboard, product listing management |
| **AI Buddy** | [...fg2x.onrender.com](https://online-market-place-using-microservices-fg2x.onrender.com) | AI shopping assistant — real-time chat |

> ⚠️ These run on Render's free tier — the first request after a period of inactivity may take 20–50 seconds while the service "wakes up." Subsequent requests are fast.

---

## 🧪 Test the APIs Yourself

**Option 1 — Browse the public Postman workspace (no download needed):**

🔗 [Vendex Online Market — Postman Workspace](https://www.postman.com/kajal-gupta-s-team/vendex-online-market/overview)

All collections (Auth, Product, Cart, Order, Payments, Seller, AI Buddy) are browsable directly — fork any collection into your own workspace to run requests.

**Option 2 — Import the collections from this repo:**

📁 [`postman_Collection/`](./postman_Collection) — contains:
- `Authentication.postman_collection.json`
- `Product.postman_collection.json`
- `Cart.postman_collection.json`
- `Order.postman_collection.json`
- `Payments.postman_collection.json`
- `seller dashboard.postman_collection.json`

**How to use:**
1. Download the collection(s) you want to test from the folder above
2. Open Postman → **Import** → select the `.json` file(s)
3. Each request is pre-built — just replace the base URL with the matching live URL from the table above
4. Register → Login (copy the JWT from the response) → use it as a Bearer token for protected routes

---

## ☁️ Deployment Story — AWS → Render

This project was originally architected for and deployed on **AWS ECS Fargate**, using **Docker** containers pushed to **AWS ECR**, with each microservice running as an independent Fargate task. The Dockerfiles, `docker-compose.yml`, and ECS deployment workflow (build → push to ECR → Fargate auto-deploy) are part of this repo and reflect that original setup.

After the AWS free-tier period ended, the live AWS deployment was taken down to avoid unexpected billing. For demo purposes, the same backend (no code changes to business logic) has been **redeployed on Render**, so reviewers can interact with a live version without needing AWS credentials. This involved:
- Migrating MongoDB to **MongoDB Atlas** (cloud-hosted)
- Migrating Redis to **Upstash**
- Migrating RabbitMQ to **CloudAMQP**
- Fixing platform-specific issues (dynamic port binding via `process.env.PORT`, replacing SMTP-based email — blocked on Render's free tier — with the **Brevo HTTP API**)

This experience reflects real-world infra trade-offs: designing for a managed container platform (AWS Fargate) while adapting the same containerized services to a different free-hosting platform under cost constraints.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Runtime | Node.js, Express.js |
| Database | MongoDB (Atlas), Redis (Upstash) |
| Messaging | RabbitMQ — CloudAMQP (AMQP) |
| AI | LangChain, Google Gemini, LangGraph, Socket.io |
| Payments | Razorpay |
| Email | Brevo (Transactional Email API) |
| Auth | JWT, bcryptjs, Redis token blacklisting |
| Validation | express-validator |
| Testing | Jest, Supertest, mongodb-memory-server |
| DevOps | Docker, AWS ECS Fargate + ECR (original), Render (current demo) |

---

## Services Overview

| Service | Description |
|---------|-------------|
| **Auth** | Register, login, logout — JWT auth with Redis token blacklisting |
| **Product** | Product CRUD, search, categories, inventory management |
| **Cart** | Add/remove items, cart persistence, quantity management |
| **Order** | Place orders, order history, status tracking |
| **Payment** | Razorpay payment processing and verification |
| **Notification** | Email notifications triggered via RabbitMQ events |
| **Seller** | Seller dashboard, product listing management |
| **AI Buddy** | 🤖 AI shopping assistant — real-time chat via Socket.io |

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
  ├──► [Auth Service]          MongoDB + Redis
  ├──► [Product Service]       MongoDB
  ├──► [Cart Service]          MongoDB + Redis
  ├──► [Order Service]         MongoDB ──► calls Cart + Product
  ├──► [Payment Service]       MongoDB ──► calls Order, Razorpay API
  ├──► [Seller Service]        MongoDB
  └──► [AI Buddy] ◄──────────  Socket.io (WebSocket)
                                Google Gemini + LangGraph

All services ──► [RabbitMQ] ──► [Notification Service] ──► Brevo Email API

Deployment (current demo): each service is an independent Render Web Service
Deployment (original design): each service as an independent AWS ECS Fargate Task,
                                images stored in AWS ECR
```

---

## Project Structure

```
Online-Market-Place-Using-Microservices-Architecture/
├── AI_Buddy/                 # AI shopping assistant (LangChain + Gemini)
├── Auth/                     # Authentication & authorization
├── Cart/                     # Shopping cart management
├── Notification/             # Event-driven notifications
├── Order/                    # Order management
├── Payment/                  # Payment processing
├── Product/                  # Product catalog
├── seller/                   # Seller management
├── postman_Collection/        # Ready-to-import Postman collections for every service
├── docker-compose.yml         # Run all services locally with one command
└── README.md
```

---

## Quick Start (Run Locally)

### Prerequisites
- Docker & Docker Compose installed
- Google Gemini API key (for AI Buddy)
- Razorpay test keys (for Payment)
- Brevo API key (for Notification emails)

### Run locally

```bash
# 1. Clone the repo
git clone https://github.com/KajalGupta2345/Online-Market-Place-Using-Microservices-Architecture.git
cd Online-Market-Place-Using-Microservices-Architecture

# 2. Set up environment variables for each service
cp Auth/.env.example Auth/.env
cp AI_Buddy/.env.example AI_Buddy/.env
# ...repeat for other services

# 3. Start all services
docker-compose up --build
```

### Environment Variables

Each service has its own `.env`. Key variables across services:

```bash
# Common
MONGO_URI=mongodb://localhost:27017/servicename
JWT_SECRET=your_jwt_secret
RABBIT_URL=amqp://localhost

# Auth / Cart
REDIS_URL=redis://localhost:6379

# Order / Payment (inter-service URLs)
CART_SERVICE_URL=http://localhost:5002
PRODUCT_SERVICE_URL=http://localhost:5001
ORDER_SERVICE_URL=http://localhost:5003

# Payment
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Notification
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_verified_sender_email

# AI Buddy
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

---

## API Endpoints

### Auth Service (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create new user account |
| POST | `/login` | Login and receive JWT |
| GET | `/me` | Get current user profile |
| POST | `/user/me/addresses` | Add delivery address |
| GET | `/user/me/addresses` | Get all addresses |
| DELETE | `/user/me/addresses/:id` | Remove an address |

### Product Service (`/api/products`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a product (seller/admin only) |
| GET | `/` | List all products |
| GET | `/:id` | Get product by ID |
| PATCH | `/:id` | Update product (seller only) |
| DELETE | `/:id` | Delete product (seller only) |
| GET | `/seller` | Get products by seller |

### Order Service (`/api/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create order from cart |
| GET | `/me` | Get my orders (paginated) |
| GET | `/:id` | Get order by ID |
| GET | `/:id/cancel` | Cancel an order |
| PATCH | `/:id/address` | Update shipping address |

### Payment Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/:orderId` | Initiate Razorpay payment for an order |
| POST | `/verify` | Verify Razorpay payment signature |

### AI Buddy Service
| Type | Event | Description |
|------|-------|-------------|
| WebSocket | `connect` | Establish authenticated connection |
| WebSocket | `message` | Send message to AI assistant |
| WebSocket | `response` | Receive AI response stream |
| WebSocket | `disconnect` | End session |

> Full API documentation: import any collection from the [`postman_Collection/`](./postman_Collection) folder into Postman.

---

## Testing

Auth service includes unit and integration tests.

```bash
cd Auth
npm test
```

**Test coverage includes:**
- User registration & login flows
- JWT authentication middleware
- Token blacklisting via Redis
- Address CRUD operations

---

## What I Learned

- Designing **decoupled microservices** with clear service boundaries
- **Async inter-service communication** using RabbitMQ (event-driven architecture)
- **AI agent orchestration** with LangGraph for stateful conversations
- **Real-time communication** using Socket.io in a microservices setup
- **JWT + Redis** for stateless yet revocable authentication
- **Container deployment** — both serverless (AWS ECS Fargate + ECR) and PaaS (Render)
- Debugging real production issues: dynamic port binding, platform-specific network restrictions (SMTP blocking), and inter-service auth propagation
- Writing **integration tests** with in-memory MongoDB for isolated testing

---

## Author

**Kajal Gupta**
[GitHub](https://github.com/KajalGupta2345) · [LinkedIn](https://www.linkedin.com/in/kajal-kumari-357b85253/)
