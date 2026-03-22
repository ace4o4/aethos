# Aethos — Decentralized AI Swarm Platform

> *"Your phone trains a personal AI. That AI secretly makes humanity smarter — without ever sharing your data."*

--


## What Is This?

Aethos is a **mobile-first Progressive Web App (PWA)** where every user births and raises a personal AI agent called an **Evo Twin**. The twin trains entirely on-device using your daily inputs (text, camera, motion) and then contributes anonymously to a global AI swarm via Zero-Knowledge proofs — **zero raw data ever leaves your phone**.

The core thesis: personal AI models today never improve from real life, and collective intelligence stays trapped in centralized labs. Aethos breaks both locks at once.

---

## What Is Currently Happening (Present State)

### ✅ Built & Working

| Area | What Exists |
|---|---|
| **UI Shell** | Full Next.js 15 App Router PWA with dark glassmorphic design |
| **Evo Twin Avatar** | Animated AI character with 6 mood states (idle, happy, thinking, training, sleeping, success), cursor-tracking eyes, orbiting particles, neon glow — all driven by Framer Motion |
| **3-State Dashboard** | Landing (unauthenticated) → Onboarding (twin init) → Active Dashboard (daily quest + stats) |
| **Daily Micro-Quest UI** | `MicroQuest.tsx` — the 30-second task interface that drives the core training loop |
| **Auth Layer** | Privy embedded-wallet wrapper (`PrivyProviderWrapper.tsx`) — users log in with email/social, a crypto wallet is silently created in the background |
| **On-Device ML (Mock)** | `src/lib/ml.ts` — TensorFlow.js "Burst Training" scaffolded and wired up |
| **ZK Privacy Layer (Mock)** | `src/lib/zk.ts` — Differential Privacy noise injection + StarkWare S-two proof generation stubbed out |
| **Agent Memory (Mock)** | `src/lib/letta.ts` — Letta API integration for context/replay-buffer management stubbed out |
| **Navigation** | `TopBar` + `BottomNav` for Home / Twin / Swarm / Profile routes |
| **Sub-pages** | `/twin`, `/swarm`, `/profile` pages scaffolded |

### ⚠️ Current Limitations (Honest Assessment)

- The ML, ZK-proof, and Letta integrations are **mocked** — the scaffolding is there but no real on-device training or proof generation runs yet.
- No test suite exists.
- The Privy auth is wrapped but not fully wired to a live app ID.
- `rust-libp2p` P2P swarm networking is not yet implemented.
- The README was a boilerplate Next.js file (this is the fix for that).

---

## What Can Happen (Roadmap)

### Phase 1 — Make the Core Loop Real
- Replace `ml.ts` mock with actual TensorFlow.js Lite int8 model training running in the browser
- Wire up a real Letta API key for agent memory & replay buffer
- Swap stubbed ZK proofs for live StarkWare S-two proof generation on-device
- Connect Privy to a real app ID; test embedded wallet creation end-to-end

### Phase 2 — The Swarm
- Compile `rust-libp2p` to WebAssembly with WebTransport support
- Build the P2P gossip layer: nodes broadcast `[ZK-Proof + Noisy Weights]` directly phone-to-phone
- Implement Federated Averaging: every node verifies incoming proofs and merges weights into its local model

### Phase 3 — Intelligence Economy (Post-Hackathon)
- Deploy smart contracts on Polygon zkEVM for on-chain "Evolution Certificates"
- Launch a decentralized marketplace: top Evo Twins can be anonymously cloned or merged for on-chain rewards
- Financial incentives for nodes contributing high-quality real-world training data to the global swarm

### Phase 4 — Planetary Superintelligence
- Passive background sensor training (accelerometer, microphone, camera) — 95% automatic after onboarding
- The swarm becomes antifragile: more diverse nodes → faster and smarter collective model
- The more users quit or jurisdictions ban phones, the stronger the remaining swarm gets

---

## How the Data Actually Moves

```
[ User Interface (Next.js PWA) ]
       │
       ▼  (no seed phrases, invisible wallet)
[ Auth & Key Mgmt (Privy) ]
       │
       ▼  (local data capture only — never sent to a server)
[ Agent State & Replay Buffer (Letta) ] ──────┐
       │                                       │ (mix new + historical data)
       ▼                                       ▼
[ On-Device ML (TensorFlow.js Lite) ] ◄────────┘
       │
       ▼  (raw training data permanently deleted after weights are computed)
[ Differential Privacy ] → noise injected into weights
       │
       ▼
[ StarkWare S-two ] → ZK proof that the computation was valid
       │
       ▼  (only proof + noisy weights leave the device)
[ Decentralized Swarm (rust-libp2p / WebTransport) ]
```

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript | PWA shell, SSR, type safety |
| Styling | Tailwind CSS 4, Framer Motion | Glassmorphic dark UI, fluid animations |
| Auth | Privy (embedded wallets) | Zero-friction Web3 login — no seed phrases |
| On-Device ML | TensorFlow.js Lite, MediaPipe | Browser-native int8 model training without battery drain |
| Agent Memory | Letta API | Replay buffer, context window, Catastrophic Forgetting prevention |
| Privacy | Differential Privacy (custom) | Mathematical noise prevents model-inversion attacks |
| ZK Proofs | StarkWare S-two | Fast ZK proofs over 31-bit Mersenne prime field, optimized for mobile |
| P2P Networking | rust-libp2p → WebAssembly | Direct phone-to-phone weight sharing, no central server |
| Blockchain | Polygon zkEVM | On-chain evolution certificates, future reward contracts |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Main dashboard (3 states: landing / onboarding / active)
│   ├── layout.tsx       # Root layout with auth provider & navigation
│   ├── twin/page.tsx    # Evo Twin detail view
│   ├── swarm/page.tsx   # Global swarm stats
│   └── profile/page.tsx # User profile
├── components/
│   ├── EvoTwin.tsx      # Animated AI avatar (6 moods, cursor-tracking eyes)
│   ├── MicroQuest.tsx   # Daily 30-second task UI
│   ├── TopBar.tsx       # Header navigation
│   └── BottomNav.tsx    # Bottom tab navigation
├── lib/
│   ├── ml.ts            # TensorFlow.js Burst Training (mock → real)
│   ├── zk.ts            # Differential Privacy + StarkWare ZK proofs (mock → real)
│   └── letta.ts         # Letta agent memory integration (mock → real)
└── providers/
    ├── PrivyProviderWrapper.tsx  # Auth provider (mock mode)
    └── RealPrivyProvider.tsx     # Production Privy setup
docs/
├── idea.txt   # Core vision & contrarian thesis
├── prd.txt    # Full Product Requirements Document
├── arch.txt   # 4-layer architecture & step-by-step data flow
└── tech.txt   # Technology choices with rationale
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # ESLint
```

---

## Success Metrics (MVP KPIs)

| Metric | Target |
|---|---|
| Time to initialize Evo Twin | < 10 seconds from app launch |
| Burst Training duration | < 30 seconds per daily quest |
| Daily quest completion rate | Primary retention signal |

---

## More Details

See the [`/docs`](./docs) directory for the full Product Requirements Document, architecture diagrams, tech stack rationale, and the original contrarian vision document.
