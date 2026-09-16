# Billium

**Billium** is an open-source, offline-first invoicing and quotation application built for freelancers and small businesses. It runs as a native Electron desktop app *or* as a self-hosted web application — no cloud accounts, no subscriptions, total data privacy.

---

## ✨ Features

- 📄 **Invoices & Quotes** — Create, edit, and manage professional documents with live PDF preview
- 🖨️ **Print & Download** — One-click print dialog or direct PDF download (named with your invoice number)
- 🏢 **Multi-Business** — Manage multiple business profiles and switch between them per invoice
- 👥 **Client Management** — Full client directory with address, GSTIN, PAN, email & phone
- 📦 **Items & Services** — Reusable product/service catalog with category and unit support
- 💱 **Multi-Currency** — Full multi-currency support with amount-in-words (Rupees & Paise, Dollars & Cents, etc.)
- 🏦 **Bank Details** — Attach bank account details to invoices for payment instructions
- 🧾 **Tax Engine** — Tax-inclusive or tax-exclusive pricing per line item with configurable tax rates
- 🔢 **Smart Invoice Numbering** — Sequential, month-aware numbering (e.g. `INV-202609-0001`)
- 💾 **Auto DB Reconnect** — Remembers your last database and reconnects automatically on startup
- 🖥️ **Dual Mode** — Runs as an Electron desktop app (SQLite) or a self-hosted web server (SQLite or PostgreSQL)
- 📊 **Settings** — Configure default business, currency, payment terms, and more

---

## 🗂️ Project Structure

```
billium/
├── src/
│   ├── backend/
│   │   ├── main/               # Electron main process
│   │   │   ├── ipc/            # IPC handlers (DB dialogs, CRUD routes)
│   │   │   └── main.ts         # Electron app entry point
│   │   ├── shared/             # Business logic shared across Electron & Web
│   │   │   ├── db/             # DB connection & migration setup (SQLite/PG)
│   │   │   ├── services/       # CRUD service layer (invoices, clients, etc.)
│   │   │   └── types/          # Shared TypeScript types & interfaces
│   │   └── webserver/          # Express REST API (for self-hosted web mode)
│   │       ├── routes/         # HTTP route definitions
│   │       └── main.ts         # Web server entry point
│   ├── preload/
│   │   └── preload.ts          # Electron contextBridge — exposes IPC as electronAPI
│   └── renderer/               # React frontend (shared between Electron & Web)
│       ├── app/                # Root: App.tsx, AppLayout.tsx, DatabaseChooser.tsx
│       ├── pages/              # Feature pages (invoices, quotes, clients, etc.)
│       ├── shared/
│       │   ├── api/            # Dual-mode API layer (IPC or fetch)
│       │   ├── components/     # Shared UI components (PDF template, CRUD layout, etc.)
│       │   ├── types/          # Frontend-side types
│       │   └── utils/          # Financials, numberToWords, helpers
│       └── state/              # Redux Toolkit store & slices
├── public/                     # Static assets (app icon, logo)
├── electron-builder.yml        # Electron packaging config
├── vite.config.ts              # Frontend Vite config
├── vite.main.config.ts         # Electron main process Vite config
├── vite.preload.config.ts      # Electron preload Vite config
├── vite.migrations.config.ts   # DB migrations Vite config
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher

### Installation

```bash
git clone https://github.com/satyakiabhijit/billium.git
cd billium
npm install
```

---

## 🖥️ Running in Desktop Mode (Electron + SQLite)

This is the primary mode. The app runs as a native desktop application with SQLite for local storage.

```bash
npm run dev
```

On first launch, a **database chooser screen** appears — you can either:
- **Create a new database** — picks a save location and initializes a fresh SQLite file
- **Open an existing database** — browse to an existing `.db` file

After connecting, Billium **remembers your database** and reconnects automatically on every subsequent launch. Click **Logout** in the sidebar to disconnect and switch to a different database.

---

## 🌐 Running in Web / Self-Hosted Mode

For self-hosting on a server or running in a browser without Electron.

```bash
npm run dev:webserver
```

The web server starts at `http://127.0.0.1:3000`.

Set up a `.env` file (copy from `.env.development.example`) to configure the database connection:

```env
# For SQLite (default)
DB_TYPE=sqlite
DB_PATH=./data/billium.db

# For PostgreSQL
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=billium
```

---

## 📦 Building for Production

### Desktop App (Electron)

Build installers for Windows (.exe), macOS (.dmg), and Linux (.AppImage, .deb):

```bash
npm run build
npx electron-builder
```

Output is placed in the `release/` directory.

### Web App

```bash
npm run build:webserver
```

The compiled frontend is placed in `dist-fe/` and can be served by any static file server or Nginx.

---

## 🔑 Key Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Electron desktop app in development mode |
| `npm run dev:webserver` | Start self-hosted web server in development mode |
| `npm run build` | Build all targets (frontend + Electron main + preload + migrations) |
| `npm run build:webserver` | Build frontend only for web deployment |
| `npm run lint` | Run ESLint across the codebase |
| `npm run test` | Run unit tests with Vitest |
| `npm run typecheck` | Run TypeScript type checking |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Material-UI (MUI) v6 |
| State Management | Redux Toolkit |
| PDF Generation | Custom HTML/CSS template + html2pdf.js |
| Desktop Shell | Electron 34 |
| Web Server | Express 4 |
| Database (Desktop) | SQLite via sqlite3 |
| Database (Web) | SQLite or PostgreSQL via pg |
| Build Tooling | Vite 6 |
| Packaging | Electron Builder |
| i18n | i18next + react-i18next |

---

## 🏗️ Architecture: Dual-Mode API Layer

The key architectural feature of Billium is the **transparent dual-mode API**. The React frontend never knows whether it is running inside Electron or a browser:

```
┌─────────────────────────────────────┐
│          React Frontend             │
│                                     │
│   getApi()  ◄── platformApi.ts      │
│       │                   │         │
│  Electron?           Web mode?      │
│       │                   │         │
│  window.electronAPI   fetch()       │
│  (contextBridge IPC)  (REST API)    │
└───────┬───────────────────┬─────────┘
        │                   │
   Electron IPC          Express
   handlers              Routes
        │                   │
        └─────────┬─────────┘
                  │
           Shared Services
           (services/*.ts)
                  │
            DatabaseAdapter
           (SQLite / PostgreSQL)
```

---

## 📄 Invoice Numbering

Invoices and Quotes use smart sequential numbering that resets each month:

```
INV-YYYYMM-XXXX
```

Example: `INV-202609-0001`, `INV-202609-0002`, `INV-202610-0001` (new month, resets)

---

## 💰 Amount in Words

The grand total is automatically converted to words in the selected currency:

```
INR Fifty Two Thousand Six Hundred and Sixty Nine Rupees and Forty Nine Paise Only
```

Supported currencies include INR (Rupees/Paise), USD (Dollars/Cents), EUR (Euros/Cents), GBP (Pounds/Pence), and many more.

---

## 🔒 Data Privacy

- **All data is stored locally** on your machine (SQLite) or your own server (PostgreSQL)
- **No telemetry, no cloud sync, no accounts required**
- Database files are plain `.db` files — you can back them up, move them, or open them with any SQLite viewer

---

## 📝 License

MIT — free to use, modify, and distribute.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
