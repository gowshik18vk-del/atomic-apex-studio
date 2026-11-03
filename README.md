# Atomic Apex Studio ⚡🎬

> **The AI-Native Creative Suite for Photorealistic Imagery, Cinema Video & Multi-Model Orchestration.**  
> Crafted with a premium dark, cinematic, creator-focused aesthetic and deep integration into Atomic Apex Vision, Apex Pixel, Creator Studio, and Atomic Workspace.

---

## 🌟 Overview & Core Architecture

**Atomic Apex Studio** is a production-grade full-stack AI creative suite built to unify cutting-edge AI generation engines inside one cohesive, seamless platform.

### Strict Architectural Principles
1. **App Name:** Exclusively **Atomic Apex Studio** across all interfaces, metadata, and APIs.
2. **100% Native UI & Zero External Redirects:** All creation tools—Apex Vision (Image Generation), Swift V1 / Studio V1 / Range (Video Generation), Multi-model Creator Studio, and Atomic AI Chat with API Runner—are rebuilt natively inside Atomic Apex Studio. Users never leave the main domain, eliminating third-party cookie blocks, iframe sandboxing issues, and external login redirects.
3. **Single Sign-On (SSO):** A single Supabase Auth session seamlessly powers every tool and route via Edge Middleware guards and real-time session synchronization.
4. **Server-Side Atomic Credit Ledger:** Credits are deducted and refunded atomically via PostgreSQL functions (`spend_credits` and `refund_credits`). The client never controls credit balances, preventing tampering or race conditions.
5. **Non-Blocking Async Video Rendering:** Video generation jobs dispatch immediately (`POST /api/generate` returns `{ id, jobId, status: 'queued' }`). Clients poll `/api/generations/[id]` every 3 seconds through `queued` -> `running` -> `succeeded`/`failed`. If a render fails, credits are automatically refunded.
6. **SSRF-Hardened API Runner:** The integrated test runner proxies requests through a secure Next.js route (`/api/runner`) that strictly blocks loopback and private IPv4/IPv6 ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`), enforces a 15-second timeout, disables redirect following, and caps responses at 1MB.

---

## 🚀 Seeded Admin Credentials

To immediately test the application with founder privileges:

- **Email:** `pcgowshik@gmail.com`
- **Password:** `ApexStudio@2026!X`
- **Role:** `Founder / Admin`
- **Starting Credits:** `100`

> On the login screen (`/login`), click **"Quick Founder Fill"** to autofill credentials and sign in with a single click.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + Framer Motion + Lucide Icons
- **Backend:** Next.js 15 API Routes (`/api/generate`, `/api/generations/[id]`, `/api/models`, `/api/chat`, `/api/runner`, `/api/credits`, `/api/webhooks/[provider]`)
- **Database & Auth:** Supabase Auth + PostgreSQL with Row Level Security (RLS) + Private Storage Buckets
- **State Management:** Zustand stores with client hydration, React Query polling, and Supabase synchronization
- **Design System:** Higgsfield Dark Theme (`#09090b` / `#0a0a0c`), Electric Lime (`#ccff00`), Cyber Cyan (`#00f0ff`), subtle glass cards (`rgba(255,255,255,0.04)`), 16px borders, and micro-interactions.
- **Deployment:** 100% Vercel & Node.js ready.

---

## 🧭 Internal Routing Map

Every creative tool operates inside native studio routes:

| Route | Tool / Engine | Purpose |
|---|---|---|
| `/` | **Landing Page** | Cinematic dark hero, live video showcase, model feature cards, and CTA |
| `/dashboard` | **Studio Dashboard** | Overview, credits balance, GPU cluster status, quick launch cards |
| `/create/image` | **Apex Vision** | Native photorealistic image synthesis, aspect ratios, style presets, 1-click video animation |
| `/create/video` | **Swift / Studio / Range** | Async cinema video rendering, camera trajectories, fps, motion intensity, live job tracker |
| `/studio` | **Creator Studio** | Multi-model workspace, parallel prompt benchmarking, side-by-side comparison |
| `/chat` | **Atomic AI & API Runner** | Creative director co-pilot + SSRF-protected interactive API testbench with code generation |
| `/assets` | **My Assets** | Grid of all generations, video hover previews, full-screen 4K inspector modal |
| `/history` | **History & Audit** | Chronological log of generations, prompt metadata, status badges & credit transactions |
| `/settings` | **Studio Settings** | SSO session details, credit top-up, profile settings, and full credit ledger audit log |
| `/login` | **Authentication** | Supabase login with 1-click founder autofill and Google OAuth option |

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
cd atomic-apex-studio
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_APP_NAME="Atomic Apex Studio"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin / Seed Credentials
ADMIN_EMAIL=pcgowshik@gmail.com
ADMIN_PASSWORD=ApexStudio@2026!X

# Optional: Supabase Cloud Project (leave empty for instant offline local development mode)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Optional: Live Model API Keys
GEMINI_API_KEY=
OPENAI_API_KEY=
WEBHOOK_SECRET=
```

### 3. Build & Run
```bash
# Verify static build and types
npm run build

# Start production server
npm run start

# Or run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup & Seeding

### 1. Database Migration
Apply the SQL migration file located at:
`supabase/migrations/0001_init.sql`

This creates:
- `profiles` with balance check constraint (`credits >= 0`).
- `credit_ledger` for immutable audit logging.
- `generations` tracking job status (`queued`, `running`, `succeeded`, `failed`), aspect ratios, and media URLs.
- `chat_threads` & `chat_messages`.
- `api_runs` tracking proxy requests.
- Row Level Security (RLS) policies for all tables ensuring users can only read and write their own data.
- Atomic PostgreSQL stored procedures `spend_credits()` and `refund_credits()`.

### 2. Admin Seeding
To seed the admin account in Supabase:
```bash
npm run seed:admin
```
*(Requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to be set in `.env.local`).*

---

## 💎 Features Walkthrough

### 1. Image Generation (Apex Vision)
- **Flagship Engine:** Apex Vision (hyper-realistic skin textures, specular lighting, prompt adherence). Additional models: Seedance 2.5, Flux Pro Studio, Photoreal V3.
- **Aspect Ratios:** 1:1, 16:9, 9:16, 4:3, 21:9.
- **Style Presets:** Cinematic Cinema 35mm, Cyberpunk Neon, Ultra Photorealism, Studio Anime, Octane 3D, Vintage 90s Grain.
- **Instant Cross-Flow:** Click **"Animate to Video"** on any generated image to automatically jump to `/create/video` with the frame pre-loaded as the motion reference.

### 2. Video Generation (Swift V1, Studio V1, Range)
- **Cinema Models:** 
  - `Swift V1`: Fast 4-second motion previews for social clips and rapid ideation.
  - `Studio V1`: Cinema 4K render with high temporal consistency and realistic physics.
  - `Range`: High-motion dynamic range for action shots and extreme camera arcs.
- **Camera Trajectories:** 3D Curved Rail, Handheld Organic, Hyperlapse, Dutch Tilt, Drone Orbit, Crane Rise.
- **Async Non-blocking Pipeline:** Returns immediately with active job tracking card showing progress bars and real-time status (`queued` -> `rendering neural frames` -> `ready`).

### 3. Creator Studio (Multi-Model Workspace)
- **Unified Creative Canvas:** Switch effortlessly between Image and Video modes with a shared prompt and parameters.
- **Parallel Benchmarking:** Run prompt variations side-by-side to compare prompt interpretation across models.
- **Inspector & History Rail:** Inspect past generations with quick-load parameter restoration.

### 4. Atomic AI Chat & Interactive API Runner
- **Atomic AI Co-Pilot:** Specialized creative director assistant for cinematic prompts, camera equations, lighting setups, and storyboard scripts.
- **Interactive API Runner:** Test live endpoints (`/api/generate`, `/api/generations/[id]`, `/api/models`, `/api/chat`, `/api/credits`).
- **SSRF Defense:** Blocks access to private IP ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, AWS/GCP metadata endpoints).
- **Code Generator:** Exports requests into `cURL`, `JavaScript (fetch)`, and `Python (requests)`.

### 5. My Assets & 4K Inspector
- **Unified Media Grid:** Filter by All, Images, Videos, or Favorites.
- **Full-Screen 4K Modal:** High-resolution view, aspect ratio indicator, prompt copy, direct media download, favorite toggle, and "Animate with Video Engine" button.

---

## 🛡️ Security & Production Readiness

- **No Client-Side Credit Manipulation:** All credit modifications go through server-side RPC functions.
- **Protected Routes:** Edge middleware validates auth cookies and redirects unauthenticated requests to `/login`.
- **Safe Secrets Handling:** Admin credentials and API keys are read strictly from environment variables and never logged or committed.
- **Graceful Fallbacks:** Full mock generation adapters provide immediate visual feedback even when external provider API keys are not yet configured.

---

© 2026 Atomic Apex Studio. Built with Higgsfield-grade craftsmanship.
