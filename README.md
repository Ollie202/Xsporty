# Xsporty

**Xsporty** is a sports prediction market built on **X Layer**. Stake on real-world sports outcomes, settle on-chain, and trade positions through a CLOB-style order flow — all from a fast, static-first web app.

Live at **[xsporty.xyz](https://xsporty.xyz)**.

---

## What makes Xsporty different

### 1. An on-site assistant that actually does things

Most prediction markets make you hunt through tabs to figure out what to bet on. Xsporty ships with a built-in assistant that lets you talk to the market in plain English. Type things like:

- *"What are the odds on Argentina vs Brazil tonight?"*
- *"Give me a breakdown of the Lakers game — who's the smart pick?"*
- *"Put 20 USDC on Real Madrid to win."*

The assistant answers questions, surfaces insights across markets, compares prices, and can load a ready-to-confirm prediction ticket for you. You stay in control — it prepares the trade, you sign.

It lives in the floating action button on every page. See [`Xsporty_Assistant/`](./Xsporty_Assistant) for the implementation.

### 2. A Telegram bot for the World Cup

For World Cup matches, you don't even need to open the site. Our Telegram bot lets you:

- Browse live markets
- Check prices and your portfolio
- Place predictions directly inside the chat

Same backend, same settlement, same wallet — just a different surface. Built for people who already live in Telegram during match days.

### 3. Built on X Layer

Xsporty runs on **X Layer** (X Layer Testnet today), which means:

- Cheap, fast transactions — settlements feel instant
- USDC-denominated markets
- Non-custodial: positions and balances live in your wallet, not ours
- On-chain order book via a CLOB exchange contract

---

## Repository layout

This repo is the **frontend** for Xsporty.

```
.
├── index.html               # Page shell
├── base.css / layout.css / components.css / markets.css / responsive.css
├── js/                      # Vanilla-JS modular runtime (main.js is the entry)
├── src/                     # React/Vite islands (wallet runtime, etc.)
├── Xsporty_Assistant/       # On-site natural-language assistant
├── scripts/                 # Build + local-dev helpers
├── runtime-config.js        # Injected at build time with the API base URL
└── vercel.json              # Deploy config (legacy — primary host is xsporty.xyz)
```

## Runtime config

By default the frontend calls the backend at:

```
https://x-cup-backend-production.up.railway.app
```

To override locally:

```js
localStorage.setItem("xsporty-api-base-url", "http://localhost:3000")
```

Or set `window.XSPORTY_API_BASE_URL` before `js/main.js` loads. The legacy `XCUP_API_BASE_URL` name still works as a fallback for now.

## Running locally

```bash
npm install
npm run dev
```

That starts Vite on `127.0.0.1`. To build a static bundle:

```bash
npm run build
```

The build runs `scripts/build-runtime-config.mjs`, which writes `runtime-config.js` from `XSPORTY_API_BASE_URL` (or falls back to the default Railway URL).

## Backend integration

The frontend talks to the backend over these endpoints:

- `GET /wallet/config` — X Layer wallet metadata
- `GET /markets/cards` — market discovery cards
- `GET /portfolio/:account` — wallet positions after connect
- `POST /clob/orders/prepare` → `eth_signTypedData_v4` → `POST /clob/orders` — live CLOB order submission

A demo (wallet-less) mode keeps order state in memory so the UI is explorable without a connected wallet. Real connected wallets submit on-chain orders and require X Layer Testnet USDC plus exchange approval.

## Deploy

Production is served from **xsporty.xyz**. The legacy Vercel deploy is no longer the source of truth — `vercel.json` is kept only for preview environments.

Whatever host you point at the repo, configure:

- Build command: `npm run build`
- Output directory: `.`
- Public env var: `XSPORTY_API_BASE_URL` (the backend URL)

Make sure the backend's CORS allowlist includes `https://xsporty.xyz`.

## Stylesheet split

CSS loads in this order — keep new rules in the narrowest matching file:

1. `base.css` — tokens, resets, global affordances
2. `layout.css` — shell, header, hero, rail, footer
3. `components.css` — buttons, wallet/profile UI, tickets, modals, animations
4. `markets.css` — market cards, match rows, league/player/detail views
5. `responsive.css` — all media-query overrides

## The Xsporty Assistant

Lives in [`Xsporty_Assistant/`](./Xsporty_Assistant). Active product direction is the on-site assistant: ask sports questions, compare markets, load a ticket — all from natural language.

```bash
cd Xsporty_Assistant
cp .env.example .env   # or: copy .env.example .env  on Windows
npm install
npm start
```

---

## Status

- Frontend: live on xsporty.xyz
- Backend: Railway (`x-cup-backend-production.up.railway.app`)
- Chain: X Layer Testnet
- Telegram bot: live for World Cup markets

## License

Private — all rights reserved until further notice.
