# 🌌 Azzets - 3D Asset Marketplace API Engine

A highly optimized, type-safe, enterprise-grade full-stack backend framework built with **Node.js**, **Express 5**, **TypeScript**, and **Prisma 7**. It handles relational data parameters natively, isolates large file binary transactions via securely signed AWS S3 streams, and manages global card transaction networks via Stripe Checkout session matrices.

---

## 🛠️ Architecture & Core Features

- **Express 5 Engine:** Native asynchronous Promise resolution pipeline, eliminating repetitive `try/catch` and `next(error)` boilerplates.
- **Decoupled Database Infrastructure:** Prisma 7 database engine integrated with custom **Neon DB (PostgreSQL)** driver adapter layers.
- **Strict Security & Custom Typings:** Strong cryptographic user password protection via `bcryptjs`, environment isolation parameters, and modular token binding signatures using `jsonwebtoken`.
- **Option B Two-Step Upload Presign Protocol:** Prevents storage clutter inside cloud environments by issuing short-term direct-to-S3 `PutObject` signatures before logging file rows.
- **Unified Error Pipeline:** Centralized custom `ApiError` constructor class running positionally mapped error evaluation middleware.

---

## 📁 Repository Directory Structure

```text
azzets/
├── .gitignore                      # Universal monorepo exclusions matrix
├── backend/
│   ├── .env.example                # Canonical environmental variable placeholders
│   ├── package.json                # Server configurations and script paths
│   ├── tsconfig.json               # Type-safe compiler definitions
│   ├── generated/                  # Output directory for Prisma 7 client bindings
│   └── src/
│       ├── config/                 # Startup infrastructure initializers
│       ├── controllers/            # Core computational controller layers
│       ├── db/                     # DB client singleton wrapper engine
│       ├── middlewares/            # Token filters and error response captures
│       ├── routes/                 # Endpoint path mapping arrays
│       ├── services/               # Stripe and structural tool connections
│       └── utils/                  # Encrypted hashes and AWS S3 operations
└── frontend/                       # Vite + React client-side framework space
```

---

## 🚀 Local Development Deployment Sequence

### 1. Configure the Environmental Parameters

Navigate to the `backend/` directory, create a `.env` file, and fill in the missing variable allocations based on the placeholder matrix:

```text
PORT=6500
DATABASE_URL="postgresql://username:password@neon-db-endpoint/mydb?schema=public"
JWT_SECRET="generate_a_secure_cryptographic_secret_string_key"
JWT_EXPIRES_IN="7d"

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL="http://localhost:5173/checkout/success?session_id={CHECKOUT_SESSION_ID}"
STRIPE_CANCEL_URL="http://localhost:5173/marketplace"
```

### 2. Compile Database Migrations and Generate Client Bindings

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Initialize the Development Watch Routine

```bash
npm run dev
```

The server will initialize natively using your environment flags and actively listen on **`http://127.0.0.1:6500`**.

---

## 📡 Core Rest API Route Maps

### 🔐 Authentication Context (`/api/auth`)

| Method   | Endpoint    | Description                                              | Auth Required    |
| :------- | :---------- | :------------------------------------------------------- | :--------------- |
| **POST** | `/register` | Register a new user profile with unique constraints      | **No**           |
| **POST** | `/login`    | Authenticate matching credentials and return JWT         | **No**           |
| **GET**  | `/me`       | Decode tracking token parameters and sync session states | **Yes (Bearer)** |

### 📦 3D Asset Management (`/api/assets`)

| Method     | Endpoint                | Description                                            | Auth Required    |
| :--------- | :---------------------- | :----------------------------------------------------- | :--------------- |
| **GET**    | `/`                     | Browse and filter market listings with paginated grids | **No**           |
| **GET**    | `/:id`                  | Fetch unique metadata along with fresh S3 view link    | **No**           |
| **GET**    | `/upload/presigned-url` | Generate temporary S3 bucket direct upload signatures  | **Yes (Bearer)** |
| **POST**   | `/`                     | Save the asset metadata row after S3 file transmission | **Yes (Bearer)** |
| **DELETE** | `/:id`                  | Wipe an asset listing from the platform (Creator only) | **Yes (Bearer)** |

### 💳 Order Processing & Webhooks (`/api/orders`)

| Method   | Endpoint              | Description                                             | Auth Required     |
| :------- | :-------------------- | :------------------------------------------------------ | :---------------- |
| **POST** | `/checkout`           | Initialize secure Stripe Checkout sessions via metadata | **Yes (Bearer)**  |
| **POST** | `/api/webhook/stripe` | Handle Stripe transactional signatures and log orders   | **No (Raw Only)** |

---

## 🔒 Enterprise Production Validation Rules

- **Status Code Consistency:** Returns explicit REST metrics (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).
- **Data Masking Validation:** Passwords are fully scrubbed out from all user payload blocks before leaving the network layer.
- **Cryptographic Verification:** Webhook endpoints verify signatures using raw body streams to guarantee authenticity and prevent data forgery.
