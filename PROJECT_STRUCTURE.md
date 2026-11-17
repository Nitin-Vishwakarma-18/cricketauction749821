# 🏏 Cricket Auction Platform — Complete Project File Map

All project source files, configurations, database schemas, backend engines, and frontend components are cleanly organized inside this folder:

```
c:\Users\acer\OneDrive\Desktop\auction\
```

---

## 📂 File Directory & Architecture Catalog

### 1. Frontend UI Components (`src/components/`)
* **`src/components/LiveAuctionDashboard.tsx`**: Flagship big-screen stage display with real-time player spotlight, Indian currency formatter (Lakhs & Crores), interactive team paddles, quick increment buttons, gavel countdown clock, and decision controls.
* **`src/components/TeamSquadsView.tsx`**: Auto-updating categorized roster management (Batsmen, Bowlers, All-rounders, Wicketkeepers), purse utilization bars, and one-click CSV export.
* **`src/components/SetupView.tsx`**: Pre-auction registry to register franchise teams (with brand colors and budgets) and add players to the pool.

### 2. State Machine & Auction Engine (`src/context/`)
* **`src/context/AuctionContext.tsx`**: Real-time state store with local persistence, countdown interval, audio triggers, confetti effects, atomic budget deductions, and full action rollback/undo support.

### 3. Audio & Currency Utilities (`src/utils/`)
* **`src/utils/audio.ts`**: Zero-dependency Web Audio API procedural sound synthesizer (authentic wooden gavel strikes, crisp bid bells, and sold fanfares).
* **`src/utils/currency.ts`**: Indian currency formatters (`₹ Cr` / `₹ L`) and dynamic IPL increment calculators.

### 4. Types & Initial Data (`src/types/` & `src/data/`)
* **`src/types/auction.ts`**: Strict TypeScript definitions for `Team`, `Player`, `BidRecord`, `AuctionHistoryAction`, and player roles.
* **`src/data/initialData.ts`**: Seed data including IPL franchises (CSK, MI, RCB, KKR, RR, SRH) and star players (Virat Kohli, Jasprit Bumrah, Heinrich Klaasen, etc.).

### 5. Backend Server & Database Schema (`server/`)
* **`server/schema.prisma`**: Complete PostgreSQL / Prisma ORM relational schema with audit tables, constraints, and index optimization.
* **`server/auctionEngine.ts`**: Server-side business logic for bid validation, minimum purse reserve checks, and atomic state transitions.
* **`server/server.ts`**: Node.js + Socket.io real-time WebSocket broadcast server.

### 6. Configuration & Bundling
* **`vite.config.ts`**: Vite configuration with React and Tailwind v4 plugins.
* **`tsconfig.json`**: TypeScript compiler configuration.
* **`package.json`**: Project dependencies, scripts, and dev tools.
* **`index.html`**: HTML5 root entry with Google Fonts (Chakra Petch, Outfit, Teko).
* **`src/index.css`**: Tailwind v4 theme, glow keyframes, and glassmorphism styling.
* **`dist/`**: Production-ready compiled bundle.
