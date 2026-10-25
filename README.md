# 🇬🇷 pioftina.gr — Smart Meal Planning & Greek Supermarket Price Optimizer

<div align="center">

![Next.js 16](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Test Suite](https://img.shields.io/badge/Tests-46%2F46%20Passing%20(100%25)-success?style=for-the-badge)
![Security Score](https://img.shields.io/badge/OWASP%20Audit-Grade%20A%2B%20(98%2F100)-brightgreen?style=for-the-badge)

<p align="center">
  <b>Plan your weekly family meals, eliminate food waste, and automatically compare grocery basket prices across Greece's leading supermarket chains to unlock maximum savings.</b>
</p>

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Testing & Security](#-testing--security-auditing) • [CI/CD Pipeline](#-cicd-pipeline)

</div>

---

## 🌟 Key Features

### 📅 1. Interactive Weekly Meal Planning
- **7-Day Planner**: Assign breakfast, lunch, dinner, and snacks for each day of the week.
- **80+ Curated Greek Recipes**: Traditional and contemporary dishes with exact metric ingredients ($g$, $ml$, pieces) and estimated cost per serving.
- **Recipe Curation Studio**: Import online recipes via URL, audit ingredient quantities, and customize dishes.

### 🛒 2. Real-Time Supermarket Price Comparison
- **Live Greek Supermarket Data**: Integration with `posokane.gov.gr` (e-Katanalotis) covering:
  - 🟢 **Σκλαβενίτης (Sklavenitis)**
  - 🔴 **ΑΒ Βασιλόπουλος (AB Vassilopoulos)**
  - 🔵 **Μασούτης (Masoutis)**
  - 🟡 **Κρητικός (Kritikos)**
  - 🟠 **Χαλκιαδάκης (Chalkiadakis)**
- **Cheapest Basket Calculation**: Calculates the total cost for each chain and highlights where you save the most money.

### 📦 3. Combinatorial Packaging & Bulk Optimization
- **Smart Unit Normalization**: Automatically converts and sums compatible units (e.g. $250g$ flour $+ 1kg$ flour $\to 1.25kg$).
- **Multi-Pack Solver**: Evaluates available package sizes ($500g$, $1kg$, $5kg$) to minimize surplus waste and optimize cost per unit.
- **Pack Selector Modal**: Swap package alternatives or switch between private-label (branded vs value) options.

### 🏡 4. Smart Pantry Management (Αποθήκη)
- **Zero-Waste Pantry Tracking**: Keep stock of ingredients you already own at home.
- **One-Click Deduplication**: The *"Έχω ήδη στο σπίτι"* (Home) button automatically deducts available quantities from your shopping list.

### 🧹 5. Household & Baby Care Bundles
- **Curated Bundles**: Pre-configured essential packs including **Clean Planner** (monthly household cleaning, family laundry) and **Baby Care** (diapers, wipes, baby toiletries).
- **Independent Save-to-PC Export**: Export bundle shopping lists directly to disk without polluting the weekly food meal plan.

### 📄 6. Save-to-PC & Export Engine
- **A4 Print / Save as PDF**: Beautiful, printer-friendly CSS layout formatted for single or multi-page shopping checklists.
- **Plain Text (.txt)**: Compact checklist formatted for WhatsApp, Viber, or SMS sharing.
- **JSON Backup**: Full offline data portability.

### 🔒 7. Privacy-First & Local-First Architecture
- **Zero Mandatory Accounts**: All meal plans, preferences, and custom recipes function seamlessly with local storage.
- **OWASP ASVS Grade A+**: Comprehensive rate-limiting, timing-safe HMAC admin authentication, and SSRF loopback protections.

---

## 💻 Technology Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Actions, Route Handlers, Turbopack |
| **Frontend Library** | [React 19](https://react.dev/) | Concurrent Rendering, Modern Hooks, Transition API |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking with 100% type safety |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Next-generation utility-first CSS framework with CSS variables |
| **Icons & UI** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **State Management** | Custom Reactive Store | Zustand-inspired decoupled reactive store with microtask scheduling |
| **Database & Auth** | [Supabase](https://supabase.com/) | Optional cloud synchronization for recipe curation studio |
| **Testing** | Custom Native Runner (`tsx`) | Fast, zero-overhead test runner for unit, integration, and security checks |

---

## 🏗️ Architecture

The application is structured into five cohesive tiers designed for extreme performance and maintainability:

```
posokanei-greece-app/
├── src/
│   ├── app/                      # Next.js App Router (Pages, Layouts, API Routes)
│   ├── components/               # React 19 UI Components
│   │   ├── meal-planner/         # Weekly calendar & recipe picker
│   │   ├── grocery-list/         # Shopping list, store comparison & pack selector
│   │   ├── pantry/               # Home inventory & surplus manager
│   │   ├── bundles/              # Clean planner & baby care studios
│   │   ├── admin/                # Curation studio, bundle editor & test center
│   │   └── ui/                   # Reusable atomic UI components
│   ├── lib/                      # Core Domain Logic & Engines
│   │   ├── posokanei/            # Supermarket API client & 10m TTL memory cache
│   │   ├── optimizer/            # Combinatorial packaging solver & store matrix
│   │   ├── storage/              # useMealPlannerStore & instant price recalculator
│   │   ├── recipes/              # 80 seed recipes & ingredient cost calculation
│   │   ├── bundles/              # Household & baby bundle service
│   │   ├── security/             # Rate limiter (sliding window) & HMAC admin auth
│   │   └── export/               # Printable HTML, TXT, and JSON export generators
│   ├── tests/                    # 46 Unit/Integration tests & 32 OWASP pentest rules
│   └── types/                    # Core TypeScript domain models & contracts
├── .github/workflows/ci.yml      # Automated GitHub Actions CI pipeline
├── scripts/push-to-github.ps1    # Automated pre-push validation script
├── ARCHITECTURE.md               # Detailed architectural specs & reading order
└── package.json
```

> 📖 **Deep Dive**: For full structural chokepoint analysis, call-graph centrality scores, sequence diagrams, and data-flow specifications, read [`ARCHITECTURE.md`](ARCHITECTURE.md).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or later (LTS recommended)
- **npm**: `v10.x` or later

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gnikoloudis/pioftina.git
   cd pioftina
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   *(The default `.env.example` provides safe, working development defaults out of the box).*

4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Security Auditing

The repository features an enterprise-grade testing system accessible via both CLI and the web-based Test Center at `/admin/tests`.

```bash
# Run the complete test suite (46 integration & unit tests across 9 suites)
npm test

# Run the OWASP Penetration Testing & ASVS Security Audit (32 security checks)
npm run pentest

# Validate TypeScript type compliance
npx tsc --noEmit

# Automatically regenerate test and security documentation
npm run test:docs
npm run pentest:docs
```

### Security Compliance (OWASP ASVS Grade A+)
The application is continuously audited against the OWASP Top 10 vulnerabilities:
- **A01: Broken Access Control**: Protected administrative API routes requiring HMAC tokens.
- **A03: Injection & Validation**: Strict regex email format validation, XSS filtering, and 255-character input buffers.
- **A04: Insecure Design & DoS**: Sliding-window rate limiter per IP with burst protection and cooldown enforcement.
- **A05: Security Misconfiguration**: Strict HTTP headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `HSTS`, `Referrer-Policy`).
- **A10: SSRF Protection**: Strict blacklisting of loopback (`127.0.0.1`), RFC 1918 private ranges, and cloud metadata services (`169.254.169.254`).

---

## 🚢 CI/CD Pipeline

The repository includes automated CI/CD workflows:
- **GitHub Actions (`.github/workflows/ci.yml`)**: Automatically triggers on every push and PR to `main`, validating type safety, test suites, security rules, and production build integrity.
- **One-Command Ship (`npm run ship`)**: A local PowerShell deployment script (`scripts/push-to-github.ps1`) that executes all quality gates locally before pushing changes to GitHub.

```bash
# Run all quality gates and push to GitHub:
npm run ship
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
