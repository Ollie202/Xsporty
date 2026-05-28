# Xsporty Assistant

Assistant service for sports answers, market discovery, and natural-language xSporty experiences.

The product direction is the on-site assistant. This folder keeps the reusable assistant reply service and local dev endpoint while the React app renders the floating assistant on the page.

## Run Locally

```bash
cd Xsporty_Assistant
copy .env.example .env
npm start
```

Test a reply:

```bash
curl -X POST http://127.0.0.1:8787/dev/reply \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Brazil fixtures\"}"
```

## Environment

- `XSPORTY_ASSISTANT_VERIFY_TOKEN`: webhook verify token if a chat channel is connected later.
- `XSPORTY_ASSISTANT_ACCESS_TOKEN`: optional outbound channel token.
- `XSPORTY_ASSISTANT_CHANNEL_ID`: optional outbound channel id.
- `XSPORTY_ASSISTANT_APP_SECRET`: optional webhook signature secret.
- `XSPORTY_ASSISTANT_API_VERSION`: optional provider API version.
- `SITE_URL`: xSporty website link used in redirects.
- `MARKET_API_BASE_URL`: backend market API. The assistant tries `/markets/cards`.
- `SPORTS_API_PROVIDER`: currently supports `api-football`.
- `SPORTS_API_BASE_URL`: direct API-SPORTS URL or RapidAPI URL.
- `SPORTS_API_KEY`: private sports data key. Do not commit the real value.
- `SPORTS_API_HOST`: only needed for RapidAPI keys.
- `FOOTBALL_WORLD_CUP_LEAGUE_ID`: World Cup league id for the sports provider.
- `FOOTBALL_WORLD_CUP_SEASON`: tournament season, usually `2026`.

## Notes

- Final trading confirmation stays on the website.
- Do not expose `SPORTS_API_KEY` in frontend code.
- Replace the in-memory session store with persistent storage before production chat-channel use.
