# X Cup WhatsApp Bot

Official WhatsApp Cloud API bot for World Cup updates and X Cup market discovery.

The WhatsApp bot is intentionally a private chat assistant. It does not execute trades or accept stakes in WhatsApp. When a user wants to play, it sends them to the web app where wallet connection, age checks, terms, and jurisdiction controls can happen.

## What It Does

- Answers basic World Cup fixture, live, and market discovery prompts.
- Shows safe summaries of popular markets.
- Redirects users to the X Cup website for any trading flow.
- Supports `STOP` for opt-out.
- Includes 18+ and jurisdiction reminders in play/market flows.
- Verifies Meta webhook challenge requests.
- Optionally validates `X-Hub-Signature-256` if `WHATSAPP_APP_SECRET` is set.

## Run Locally

```bash
cd whatsapp-bot
copy .env.example .env
npm start
```

Then expose the local port with a tunnel such as ngrok/cloudflared and set your Meta webhook callback URL to:

```text
https://your-tunnel.example/webhooks/whatsapp
```

Use the same verify token as `WHATSAPP_VERIFY_TOKEN`.

## Required Meta Setup

1. Create or use a Meta app with WhatsApp enabled.
2. Add a WhatsApp Business phone number.
3. Copy the permanent or temporary access token into `WHATSAPP_ACCESS_TOKEN`.
4. Copy the phone number id into `WHATSAPP_PHONE_NUMBER_ID`.
5. Configure the webhook URL and verify token.
6. Subscribe to `messages` webhook events.

## Environment

- `WHATSAPP_VERIFY_TOKEN`: token Meta uses during webhook verification.
- `WHATSAPP_ACCESS_TOKEN`: Cloud API bearer token.
- `WHATSAPP_PHONE_NUMBER_ID`: sender phone number id.
- `WHATSAPP_APP_SECRET`: optional app secret for webhook signature validation.
- `SITE_URL`: X Cup website link used in redirects. Leave blank until deployed.
- `MARKET_API_BASE_URL`: backend market API. The bot tries `/markets/cards`.
- `SPORTS_API_PROVIDER`: currently supports `api-football`.
- `SPORTS_API_BASE_URL`: direct API-SPORTS URL or RapidAPI URL.
- `SPORTS_API_KEY`: private sports data key. Do not commit the real value.
- `SPORTS_API_HOST`: only needed for RapidAPI keys.
- `FOOTBALL_WORLD_CUP_LEAGUE_ID`: World Cup league id for the sports provider.
- `FOOTBALL_WORLD_CUP_SEASON`: tournament season, usually `2026`.

## How Replies Are Powered

The bot checks data in this order:

1. X Cup backend through `MARKET_API_BASE_URL`.
2. Sports data API through `SPORTS_API_KEY`.
3. Local demo fallback data so development never feels empty.

That means the bot can work now, then automatically get smarter as the backend comes online.

## Test Without WhatsApp

Start the bot:

```bash
npm start
```

In another terminal:

```bash
curl -X POST http://127.0.0.1:8787/dev/reply \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Brazil fixtures\"}"
```

Useful prompts:

- `Who hosts the World Cup?`
- `World Cup groups`
- `Brazil fixtures`
- `Live games`
- `Popular markets`
- `Messi player markets`
- `Basketball markets`
- `Cricket markets`
- `F1 races`
- `UFC markets`

## Compliance Notes

- Keep trading outside WhatsApp.
- Do not send unsolicited market promos.
- Use approved message templates for proactive messages outside the 24-hour user window.
- Keep age and jurisdiction messaging visible before redirecting users to the app.
- Respect `STOP` and keep an opt-out store in production.
- Replace the in-memory session store with a database before launch.
