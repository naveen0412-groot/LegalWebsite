# BizRegist — Business Registration & Compliance SaaS

Dark-themed platform for company incorporation, GST, MSME/Udyam, and trademark services with lead capture, simulated payments, and admin dashboard.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- MongoDB + Mongoose
- JWT auth (httpOnly cookie)
- React Context (cart + auth)

## Prerequisites

- Node.js 18+
- MongoDB running locally (or Atlas URI in `.env.local`)

## Setup

```bash
cd biz-compliance-saas
cp .env.local.example .env.local
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo credentials

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | admin@platform.local   | Admin@12345   |

Customers can register at `/register`.

## Features

- **Landing**: Service grid with pricing and Interested CTA
- **Lead modal**: Email + mobile capture, cart integration
- **Checkout**: UPI QR + card tabs, simulate success/failure
- **Payment**: Success screen with transaction ID; failed payments recorded as `Payment_Failed`
- **WhatsApp**: Simulated notification on successful payment
- **Admin**: Request tracker, status badges, CSV export, services CRUD

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `npm run dev` | Development server         |
| `npm run seed`| Seed admin + 4 services    |
| `npm run build` | Production build         |
