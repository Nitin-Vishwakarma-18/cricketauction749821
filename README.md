# ⚽ EPL Auction Platform (Premier League Edition)

A broadcast-grade real-time player auction management platform designed for auditorium projectors, franchise bidding desks, and auctioneer control.

## ✨ Features & Upgrades

- **Dark Mode / Light Mode Switch**:
  - One-click toggle button in the header (☀️ Light Mode / 🌙 Dark Mode) with instant smooth transitions.
  - Dark Mode: High-contrast pure black & red styling (`#000000`, crimson `#dc2626`, glowing borders).
  - Light Mode: Crisp white & slate styling with vibrant red accents and crystal-clear visibility.
  - Automatically persisted in your browser's local storage.

- **EPL Auction Branding & Logo**:
  - Renamed platform to **EPL AUCTION**.
  - Custom logo featuring the authoritative auctioneer at the podium with gavel.
  - Includes both a realistic 3D broadcast crest (`/epl-logo-realistic.jpg`) and a clean transparent edition (`/epl-logo-transparent.png`).
  - Click on the header logo to toggle between realistic 3D and classic editions!

- **Points Purse System (10,000 Points Economy)**:
  - Each franchise starts with a **10,000 Points (PTS)** purse.
  - Player base prices scaled in points (e.g. 1,000 to 2,000 PTS).
  - Smart dynamic quick-increment buttons calibrated for points: `+25`, `+50`, `+100`, `+200`, `+500`, `+1,000 PTS`.
  - Custom bid input in points with instant validation.

- **Add & Remove Teams and Players**:
  - **Add Teams**: Register new franchises with custom team name, code, brand color, and points purse.
  - **Remove Teams**: Delete teams from the auction with safety checks (players bought by deleted teams are returned to the pool).
  - **Add Players**: Register players with name, role, country, base price in points, and photo.
  - **Remove Players**: Delete players with automated refund of points to the team if previously sold.

- **Real-Time Auction & Roster Management**:
  - Live gavel countdown clock with audio cues and hammer sound synthesizer.
  - Atomic points deduction on "SOLD" hammer strike with celebratory confetti.
  - Instant **UNDO / ROLLBACK** capability (reverses sale, refunds points, resets player state).
  - Auto-updating team squads page with category breakdowns and CSV export.

## 🚀 Running Locally

```bash
# Navigate to project
cd c:\Users\acer\OneDrive\Desktop\auction

# Start the dev server
npm run dev
```

Visit the local URL shown (typically `http://localhost:5173`) in your browser.
Press the **Projector Mode** icon in the header to enter fullscreen auditorium display mode!
