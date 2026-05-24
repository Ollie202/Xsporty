import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import { URL } from "node:url";

loadEnvFile();

const config = {
  port: Number(process.env.PORT || 8787),
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "change-this-local-verify-token",
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
  appSecret: process.env.WHATSAPP_APP_SECRET || "",
  apiVersion: process.env.WHATSAPP_API_VERSION || "v20.0",
  siteUrl: trimSlash(process.env.SITE_URL || ""),
  marketApiBaseUrl: trimSlash(process.env.MARKET_API_BASE_URL || "http://127.0.0.1:3000"),
  termsUrl: process.env.TERMS_URL || "",
  privacyUrl: process.env.PRIVACY_URL || "",
  supportUrl: process.env.SUPPORT_URL || "",
  sportsApiProvider: process.env.SPORTS_API_PROVIDER || "api-football",
  sportsApiBaseUrl: trimSlash(process.env.SPORTS_API_BASE_URL || "https://v3.football.api-sports.io"),
  sportsApiKey: process.env.SPORTS_API_KEY || process.env.API_FOOTBALL_KEY || process.env.APISPORTS_KEY || "",
  sportsApiHost: process.env.SPORTS_API_HOST || "",
  footballWorldCupLeagueId: process.env.FOOTBALL_WORLD_CUP_LEAGUE_ID || "1",
  footballWorldCupSeason: process.env.FOOTBALL_WORLD_CUP_SEASON || "2026",
};

const sessions = new Map();

const fallbackFixtures = [
  { home: "Brazil", away: "Spain", time: "Today 20:00", market: "Brazil to win", yes: 45, no: 55 },
  { home: "Argentina", away: "France", time: "Live 65'", market: "Argentina to win", yes: 38, no: 62 },
  { home: "England", away: "Germany", time: "Wed 17:45", market: "Over 2.5 goals", yes: 54, no: 46 },
  { home: "USA", away: "Mexico", time: "Thu 18:00", market: "Mexico to win", yes: 47, no: 53 },
];

const fallbackPlayers = [
  { player: "Lionel Messi", market: "Tournament assists over 2.5", yes: 43, no: 57 },
  { player: "Kylian Mbappe", market: "Tournament goals over 4.5", yes: 49, no: 51 },
  { player: "Cristiano Ronaldo", market: "Tournament goals over 2.5", yes: 41, no: 59 },
  { player: "Neymar Jr", market: "To score from a free kick", yes: 18, no: 82 },
];

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/health") {
      return sendJson(res, 200, { ok: true, service: "x-cup-whatsapp-bot" });
    }

    if (req.method === "GET" && url.pathname === "/webhooks/whatsapp") {
      return verifyWebhook(url, res);
    }

    if (req.method === "POST" && url.pathname === "/webhooks/whatsapp") {
      const rawBody = await readBody(req);
      if (!isValidMetaSignature(req, rawBody)) {
        return sendJson(res, 403, { error: "Invalid webhook signature" });
      }

      const payload = parseJson(rawBody);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      await handleWebhookPayload(payload);
      return;
    }

    if (req.method === "POST" && url.pathname === "/dev/reply") {
      const payload = parseJson(await readBody(req));
      const session = getSession("local-dev", "Tester");
      const reply = await buildReply(payload.text || "", session);
      return sendJson(res, 200, { reply });
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    console.error("Request failed:", error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

server.listen(config.port, () => {
  console.log(`X Cup WhatsApp bot listening on http://localhost:${config.port}`);
  if (!config.accessToken || !config.phoneNumberId) {
    console.log("WhatsApp send is disabled until WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID are set.");
  }
});

function verifyWebhook(url, res) {
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === config.verifyToken && challenge) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(challenge);
    return;
  }

  sendJson(res, 403, { error: "Webhook verification failed" });
}

async function handleWebhookPayload(payload) {
  const entries = Array.isArray(payload?.entry) ? payload.entry : [];
  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : [];
    for (const change of changes) {
      const messages = Array.isArray(change?.value?.messages) ? change.value.messages : [];
      for (const message of messages) {
        await handleIncomingMessage(message, change.value);
      }
    }
  }
}

async function handleIncomingMessage(message, value) {
  const from = message.from;
  const contactName = value?.contacts?.[0]?.profile?.name || "there";
  const text = extractMessageText(message);

  if (!from || !text) return;

  const session = getSession(from, contactName);
  const reply = await buildReply(text, session);
  await sendWhatsAppText(from, reply);
}

async function buildReply(rawText, session) {
  const text = normalize(rawText);

  if (["stop", "unsubscribe", "cancel"].includes(text)) {
    session.optedOut = true;
    return "You are opted out. We will not send updates here. Message START if you want to chat again.";
  }

  if (["start", "restart"].includes(text)) {
    session.optedOut = false;
    session.ageConfirmed = false;
    return welcome(session);
  }

  if (session.optedOut) {
    return "You are currently opted out. Message START to use X Cup updates again.";
  }

  if (["yes", "yes i am", "i am 18", "18", "18+"].includes(text)) {
    session.ageConfirmed = true;
    return [
      "Nice. You can use this bot for World Cup updates and market discovery.",
      "",
      "Trading only happens on the X Cup site after wallet connection and local eligibility checks.",
      "",
      menuLine(),
    ].join("\n");
  }

  if (["no", "under 18", "not 18"].includes(text)) {
    session.ageConfirmed = false;
    return "Thanks for being honest. X Cup market links are only for users who are 18+ and allowed in their jurisdiction. I can still answer general World Cup info.";
  }

  if (containsAny(text, ["sports", "categories", "available sports", "what can i ask"])) {
    return [
      "Sports I can help with",
      "",
      "- Football: World Cup fixtures, live scores, groups, player markets, match markets",
      "- Basketball: featured games and market summaries from X Cup",
      "- Cricket: featured games and market summaries from X Cup",
      "- Formula 1: race winner markets from X Cup",
      "- UFC: fight winner markets from X Cup",
      "",
      "Try: Brazil fixtures, live games, World Cup groups, Messi markets, UFC markets, F1 races.",
    ].join("\n");
  }

  if (containsAny(text, ["help", "menu", "commands", "hi", "hello"])) {
    return welcome(session);
  }

  if (containsAny(text, ["host", "hosts", "where is world cup", "where is the world cup"])) {
    return "The 2026 FIFA World Cup is hosted across the United States, Canada, and Mexico. Ask FIXTURES or GROUPS when you want live tournament data.";
  }

  if (containsAny(text, ["format", "how many teams", "48 teams"])) {
    return "The 2026 World Cup uses an expanded 48-team format. For live groups, standings, and fixtures, I will use the connected sports API once your key is set.";
  }

  if (containsAny(text, ["standing", "standings", "table", "tables", "group", "groups"])) {
    const standings = await loadWorldCupStandings();
    return standings;
  }

  if (containsAny(text, ["fixture", "fixtures", "games", "matches", "today", "schedule"])) {
    const fixtures = await loadFixtureSummaries({ query: text });
    return [
      "World Cup fixtures",
      "",
      ...fixtures.slice(0, 6).map((fixture, index) => `${index + 1}. ${fixture.time} - ${fixture.home} vs ${fixture.away}`),
      "",
      "Reply MARKETS to see active market summaries.",
    ].join("\n");
  }

  if (containsAny(text, ["live", "score", "updates", "update"])) {
    const live = (await loadFixtureSummaries({ live: true })).filter(fixture => /live/i.test(fixture.time));
    if (!live.length) {
      return "No live World Cup fixtures in the demo feed right now. Reply FIXTURES for upcoming games.";
    }
    return [
      "Live World Cup updates",
      "",
      ...live.map(fixture => `- ${fixture.home} vs ${fixture.away}: live market active`),
      "",
      safePlayLine("live"),
    ].join("\n");
  }

  if (containsAny(text, ["basketball", "cricket", "formula", "f1", "ufc", "fight", "mma"])) {
    return sportMarketReply(text);
  }

  if (containsAny(text, ["market", "markets", "odds", "prediction", "predict"])) {
    const fixtures = await loadFixtureSummaries({ query: text });
    return [
      "Popular X Cup markets",
      "",
      ...fixtures.slice(0, 5).map(fixture => `- ${fixture.market}: YES ${fixture.yes}c / NO ${fixture.no}c`),
      "",
      safePlayLine("markets"),
    ].join("\n");
  }

  if (containsAny(text, ["player", "players", "messi", "ronaldo", "mbappe", "neymar"])) {
    const playerMarkets = await loadPlayerMarketSummaries(text);
    return [
      "Player markets",
      "",
      ...playerMarkets.slice(0, 8).map(item => `- ${item.player}: ${item.market} - YES ${item.yes}c / NO ${item.no}c`),
      "",
      safePlayLine("players"),
    ].join("\n");
  }

  if (containsAny(text, ["play", "trade", "bet", "open app", "site", "website"])) {
    if (!session.ageConfirmed) {
      return [
        "Before I send market links: are you 18+ and allowed to access prediction markets where you live?",
        "",
        "Reply YES to continue or NO to stop market links.",
      ].join("\n");
    }
    return [
      "Open X Cup",
      config.siteUrl,
      "",
      "18+ only. Availability depends on your location. Trading happens only on the website after wallet connection and eligibility checks.",
    ].join("\n");
  }

  if (containsAny(text, ["terms", "privacy", "support", "responsible"])) {
    return importantLinksReply();
  }

  return generalSportsReply(text);
}

function welcome(session) {
  return [
    `Hey ${session.name}. I am the X Cup World Cup assistant.`,
    "",
    "I can show fixtures, live updates, and prediction market summaries. I cannot place trades inside WhatsApp.",
    "",
    "For market links, please confirm you are 18+ and allowed to access prediction markets where you live.",
    "",
    "Reply YES to confirm, or use: FIXTURES, LIVE, GROUPS, MARKETS, PLAYERS, SPORTS, TERMS, STOP.",
  ].join("\n");
}

function menuLine() {
  return "Try: FIXTURES, LIVE, GROUPS, MARKETS, PLAYERS, SPORTS, PLAY, TERMS, STOP.";
}

function safePlayLine(intent) {
  if (!config.siteUrl) {
    return "The X Cup web app link is not live yet. Once SITE_URL is set, I will send users straight to the right market page.";
  }
  const url = `${config.siteUrl}?source=whatsapp&intent=${encodeURIComponent(intent)}`;
  return `To play, continue on the website: ${url}\n18+ only. Location and wallet eligibility checks apply.`;
}

async function loadFixtureSummaries({ live = false, query = "" } = {}) {
  try {
    const response = await fetch(`${config.marketApiBaseUrl}/markets/cards?limit=24&sort=kickoff_time`);
    if (!response.ok) throw new Error(`Market API ${response.status}`);
    const payload = await response.json();
    const cards = Array.isArray(payload?.cards) ? payload.cards : [];
    let mapped = cards.map(cardToFixtureSummary).filter(Boolean);
    if (live) mapped = mapped.filter(fixture => /live/i.test(fixture.time));
    mapped = filterByQuery(mapped, query);
    return mapped.length ? mapped : fallbackFixtures;
  } catch (error) {
    const sportsApiFixtures = await loadFootballFixturesFromSportsApi({ live, query });
    return sportsApiFixtures.length ? sportsApiFixtures : filterByQuery(fallbackFixtures, query);
  }
}

async function loadPlayerMarketSummaries(query = "") {
  try {
    const response = await fetch(`${config.marketApiBaseUrl}/markets/cards?category=player_future&status=open&limit=100&sort=newest_activity`);
    if (!response.ok) throw new Error(`Player market API ${response.status}`);
    const payload = await response.json();
    const cards = Array.isArray(payload?.cards) ? payload.cards : [];
    const mapped = cards.map(cardToPlayerMarket).filter(Boolean);
    const filtered = filterByQuery(mapped, query, ["player", "market"]);
    return filtered.length ? filtered : fallbackPlayers;
  } catch (error) {
    return filterByQuery(fallbackPlayers, query, ["player", "market"]);
  }
}

async function loadFootballFixturesFromSportsApi({ live = false, query = "" } = {}) {
  if (!config.sportsApiKey || config.sportsApiProvider !== "api-football") return [];
  try {
    const payload = await sportsApiGet("/fixtures", {
      league: config.footballWorldCupLeagueId,
      season: config.footballWorldCupSeason,
      ...(live ? { live: "all" } : {}),
    });
    const fixtures = Array.isArray(payload?.response) ? payload.response : [];
    return filterByQuery(fixtures.map(apiFootballFixtureToSummary).filter(Boolean), query);
  } catch (error) {
    console.warn("Sports API fixtures unavailable:", error.message);
    return [];
  }
}

async function loadWorldCupStandings() {
  if (!config.sportsApiKey) {
    return [
      "World Cup groups",
      "",
      "Connect a sports API key to answer current group tables here.",
      "",
      "Set SPORTS_API_PROVIDER=api-football and SPORTS_API_KEY in whatsapp-bot/.env.",
    ].join("\n");
  }

  try {
    const payload = await sportsApiGet("/standings", {
      league: config.footballWorldCupLeagueId,
      season: config.footballWorldCupSeason,
    });
    const groups = payload?.response?.[0]?.league?.standings || [];
    if (!groups.length) throw new Error("No standings returned");
    return [
      "World Cup groups",
      "",
      ...groups.slice(0, 4).flatMap((group, groupIndex) => [
        `Group ${String.fromCharCode(65 + groupIndex)}`,
        ...group.slice(0, 4).map(row => `${row.rank}. ${row.team?.name || "Team"} - ${row.points ?? 0} pts`),
        "",
      ]),
    ].join("\n").trim();
  } catch (error) {
    return "I could not load current World Cup standings yet. Check the sports API key, league id, and season in whatsapp-bot/.env.";
  }
}

async function sportsApiGet(path, params = {}) {
  const url = new URL(config.sportsApiBaseUrl + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, value);
  });
  const headers = { "Accept": "application/json" };
  if (config.sportsApiHost) {
    headers["x-rapidapi-key"] = config.sportsApiKey;
    headers["x-rapidapi-host"] = config.sportsApiHost;
  } else {
    headers["x-apisports-key"] = config.sportsApiKey;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Sports API ${response.status}`);
  return response.json();
}

function cardToFixtureSummary(card) {
  const fixture = card.fixture || card.summaries?.[0]?.fixture;
  const summary = card.summaries?.[0];
  const market = summary?.market;
  if (!fixture || !market) return null;

  const prices = summary.summary?.prices || {};
  const yes = cents(prices.YES?.bestAsk ?? prices.YES?.midpoint ?? prices.YES?.lastTradePrice) ?? 50;
  const no = cents(prices.NO?.bestAsk ?? prices.NO?.midpoint ?? prices.NO?.lastTradePrice) ?? 100 - yes;

  return {
    home: fixture.homeCompetitor || "Home",
    away: fixture.awayCompetitor || "Away",
    time: fixture.status === "live" ? "Live" : formatKickoff(fixture.kickoffTime),
    market: market.title || `${fixture.homeCompetitor} vs ${fixture.awayCompetitor}`,
    yes,
    no,
  };
}

function cardToPlayerMarket(card) {
  const summary = card.summaries?.[0];
  const market = summary?.market;
  const player = market?.template?.player || card.player || {};
  if (!market) return null;
  const prices = summary?.summary?.prices || {};
  const yes = cents(prices.YES?.bestAsk ?? prices.YES?.midpoint ?? prices.YES?.lastTradePrice) ?? 50;
  const no = cents(prices.NO?.bestAsk ?? prices.NO?.midpoint ?? prices.NO?.lastTradePrice) ?? 100 - yes;
  return {
    player: player.playerName || card.player?.playerName || "Player",
    market: market.title || "Player market",
    yes,
    no,
  };
}

function apiFootballFixtureToSummary(item) {
  const home = item?.teams?.home?.name;
  const away = item?.teams?.away?.name;
  if (!home || !away) return null;
  const elapsed = item?.fixture?.status?.elapsed;
  return {
    home,
    away,
    time: item?.fixture?.status?.short === "LIVE" || elapsed ? `Live ${elapsed || ""}'`.trim() : formatKickoff(item?.fixture?.date),
    market: `${home} vs ${away}`,
    yes: 50,
    no: 50,
  };
}

function sportMarketReply(text) {
  const sport = text.includes("basketball") ? "Basketball"
    : text.includes("cricket") ? "Cricket"
      : text.includes("formula") || text.includes("f1") ? "Formula 1"
        : text.includes("ufc") || text.includes("fight") || text.includes("mma") ? "UFC"
          : "Sports";

  const examples = {
    Basketball: ["Lakers to win", "Total points over 214.5", "Player 25+ points"],
    Cricket: ["India to win", "Total sixes over 12.5", "Top batter market"],
    "Formula 1": ["Canadian GP winner", "Lando Norris race winner", "Max Verstappen podium finish"],
    UFC: ["Main event winner", "Fight ends inside distance", "Women fight winner"],
  };

  return [
    `${sport} markets`,
    "",
    "I will pull live markets from the X Cup backend when MARKET_API_BASE_URL is online.",
    "",
    ...(examples[sport] || examples.Basketball).map(item => `- ${item}`),
    "",
    safePlayLine(sport.toLowerCase().replace(/\s+/g, "-")),
  ].join("\n");
}

function generalSportsReply(text) {
  const lower = text.toLowerCase();
  if (containsAny(lower, ["brazil", "argentina", "france", "england", "germany", "spain", "portugal", "mexico", "usa"])) {
    return [
      "I can answer team questions once the sports API or backend is live.",
      "",
      "Try: Brazil fixtures, Brazil markets, Brazil players, live Brazil game.",
    ].join("\n");
  }

  return [
    "I can help with World Cup fixtures, live updates, groups, player markets, and the sports available on X Cup.",
    "",
    "Ask naturally, for example:",
    "- Who hosts the World Cup?",
    "- Brazil fixtures",
    "- World Cup groups",
    "- Messi player markets",
    "- UFC markets",
    "- F1 races",
    "",
    menuLine(),
  ].join("\n");
}

function importantLinksReply() {
  const rows = ["Important links"];
  if (config.termsUrl) rows.push(`Terms: ${config.termsUrl}`);
  if (config.privacyUrl) rows.push(`Privacy: ${config.privacyUrl}`);
  if (config.supportUrl) rows.push(`Support: ${config.supportUrl}`);
  if (rows.length === 1) rows.push("Terms, privacy, and support links are not live yet. Set TERMS_URL, PRIVACY_URL, and SUPPORT_URL when the site is deployed.");
  rows.push("", "Reply STOP any time to opt out.");
  return rows.join("\n");
}

function filterByQuery(items, query = "", fields = ["home", "away", "market"]) {
  const usefulTerms = normalize(query)
    .split(" ")
    .filter(term => term.length > 2 && !["fixture", "fixtures", "games", "matches", "today", "market", "markets", "world", "cup", "live"].includes(term));
  if (!usefulTerms.length) return items;
  const filtered = items.filter(item => {
    const haystack = fields.map(field => item[field] || "").join(" ").toLowerCase();
    return usefulTerms.some(term => haystack.includes(term));
  });
  return filtered.length ? filtered : items;
}

function cents(value) {
  if (value == null || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(1, Math.min(99, Math.round(number <= 1 ? number * 100 : number)));
}

function formatKickoff(value) {
  if (!value) return "Upcoming";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Upcoming";
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function sendWhatsAppText(to, body) {
  if (!config.accessToken || !config.phoneNumberId) {
    console.log("[dry-run] WhatsApp reply to", to, "\n" + body);
    return;
  }

  const response = await fetch(`https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: {
        preview_url: true,
        body: body.slice(0, 4096),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("WhatsApp send failed:", response.status, errorText);
  }
}

function extractMessageText(message) {
  if (message.type === "text") return message.text?.body || "";
  if (message.type === "button") return message.button?.text || message.button?.payload || "";
  if (message.type === "interactive") {
    return message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || "";
  }
  return "";
}

function getSession(phone, name) {
  if (!sessions.has(phone)) {
    sessions.set(phone, {
      name,
      ageConfirmed: false,
      optedOut: false,
      createdAt: Date.now(),
    });
  }
  const session = sessions.get(phone);
  session.name = session.name || name;
  session.lastSeenAt = Date.now();
  return session;
}

function isValidMetaSignature(req, rawBody) {
  if (!config.appSecret) return true;
  const signature = req.headers["x-hub-signature-256"];
  if (!signature || !signature.startsWith("sha256=")) return false;

  const expected = "sha256=" + crypto.createHmac("sha256", config.appSecret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function containsAny(text, terms) {
  return terms.some(term => text.includes(term));
}

function normalize(text) {
  return String(text || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function parseJson(rawBody) {
  if (!rawBody.length) return {};
  return JSON.parse(rawBody.toString("utf8"));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function trimSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function loadEnvFile() {
  const envPath = new URL(".env", import.meta.url);
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}
