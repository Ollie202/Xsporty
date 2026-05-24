# X Cup Markets Frontend

Static-first frontend for a World Cup-themed prediction market on X Layer. The app hydrates markets and wallet state from the backend and keeps demo-only behavior local to the fallback wallet.

## Files

- `index.html` contains the page structure.
- `base.css`, `layout.css`, `components.css`, `markets.css`, and `responsive.css` contain the loaded stylesheet split.
- `js/main.js` is the active module entrypoint loaded by `index.html`.
- `js/api.js`, `js/rendering.js`, `js/trading.js`, `js/wallet.js`, `js/navigation.js`, `js/ui.js`, `js/state.js`, `js/data.js`, `js/utils.js`, and `js/constants.js` contain the modular runtime.
- `wc2026.png` is the floating World Cup action button asset.

## Runtime config

By default the frontend calls `http://127.0.0.1:3000`. To point it elsewhere, set either:

`localStorage.setItem("x-cup-api-base-url", "http://localhost:3000")`

or define `window.XCUP_API_BASE_URL` before `js/main.js` loads.

## Backend integration

Implemented progressive wiring:

- `GET /wallet/config` for X Layer wallet metadata.
- `GET /markets/cards` for market discovery cards.
- `GET /portfolio/:account` for wallet positions after connect.
- `POST /clob/orders/prepare`, optional approval transaction, wallet `eth_signTypedData_v4`, and `POST /clob/orders` for live CLOB order submission.

Demo wallet orders remain in local in-memory UI state. Real connected wallets submit backend on-chain orders and require X Layer Testnet USDC balance plus exchange approval.

Remaining production hardening:

- Replace demo-only sports that the backend does not yet support.
- Continue moving render paths from `innerHTML` to DOM builders where practical; backend-provided strings are escaped on the active card, ticket, history, and portfolio render paths.
- Add automated browser smoke tests for market hydration, wallet-less fallback, and responsive layouts.

## Stylesheet Split

The active page loads CSS in this order:

1. `base.css` for tokens, resets, root elements, and global affordances.
2. `layout.css` for shell, header, hero, rail, and footer layout.
3. `components.css` for reusable controls, wallet/profile UI, tickets, modals, and animation utilities.
4. `markets.css` for market cards, match rows, league/player/detail views, and sport-specific presentations.
5. `responsive.css` for all media-query overrides.

Keep new styles in the narrowest matching file.
