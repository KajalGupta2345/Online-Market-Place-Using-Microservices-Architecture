# VendEx — Frontend

React + Redux Toolkit + Tailwind frontend for the
[Online-Market-Place-Using-Microservices-Architecture](https://github.com/KajalGupta2345/Online-Market-Place-Using-Microservices-Architecture)
backend. It talks directly to each microservice (no gateway) using
`withCredentials` axios instances, matching the backend's httpOnly-cookie
JWT auth.

## Covers every service

| Service | Port | Used for |
|---|---|---|
| Auth | 5000 | register, login, logout, `/me`, saved addresses |
| Product | 5001 | browse, product detail, seller create/edit/delete |
| Cart | 5002 | add/update/remove items, view cart |
| Order | 5003 | checkout, order history, cancel, address update |
| Payment | 5004 | Razorpay checkout + verification |
| AI Buddy | 5005 | floating chat widget (Socket.IO) |
| Seller dashboard | 5007 | metrics, seller's orders/products |

The Notification service (5006) is backend-internal (consumes RabbitMQ
events, sends email) and isn't called from the frontend.

## Setup

```bash
npm install
cp .env.example .env   # adjust ports/URLs if your backend runs elsewhere
npm run dev
```

Runs on `http://localhost:5173`. Make sure the backend services are
running (see the backend repo's `docker-compose.yml`) and that
`VITE_RAZORPAY_KEY_ID` matches the Payment service's `RAZORPAY_KEY_ID`.

## Notes on the backend's actual response shapes

A few endpoints don't follow the same envelope, which the API layer
already accounts for — flagging here in case you extend it:

- `GET /api/products` and `GET /api/products/seller` respond `{ data: [...] }`
- `POST /api/products` responds `{ data: product }`, but `PATCH /api/products/:id` responds `{ product }`
- `GET/POST /api/auth/user/me/addresses` responds `{ address: [...] }` (singular key)
- `POST /api/products` accepts flat `priceAmount` / `priceCurrency` fields, not a nested `price` object
- `POST /api/orders` responds the raw order document (no wrapper key)

## Structure

```
src/
  api/axios.js          per-service axios instances (all withCredentials: true)
  features/<name>/      Redux Toolkit slices, one per backend service
  features/aiBuddy/      Socket.IO chat widget
  pages/                 routed pages
  pages/seller/          seller-only dashboard, product form, orders
  routes/ProtectedRoute  auth + role guard
```

## Auth model

The backend sets an httpOnly `token` cookie on login/register — there's no
token in JS to store. Every request goes out with `withCredentials: true`,
and `App.jsx` calls `GET /api/auth/me` once on load to hydrate the session.
