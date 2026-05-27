import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { Search } from 'lucide-react';
import { useAccount } from 'wagmi';
import { hydrateFromBackend, refreshPortfolio, submitBackendOrder } from '../js/api.js';
import { gameMarkets, playerPropMarkets, quickChoices } from '../js/data.js';
import { state as legacyState } from '../js/state.js';
import { FALLBACK_WALLET_ADDRESS, sportLabels, SYMBOL, WC_ANIMS } from '../js/constants.js';
import { flagUrl, getInitials, shortAddress } from '../js/utils.js';

const appState = legacyState as {
  selectedWalletId: string | null;
  walletProvider: unknown;
  account: string | null;
  connected: boolean;
  balance: number | null;
  portfolio: unknown;
  pendingTicket: PendingTicket | null;
  price: number;
  side: string;
  sport: string;
  tickets: Ticket[];
};
const labelsBySport = sportLabels as Record<string, { title: string; icon: string }>;

type MatchOption = [string, string, number, number, string?, string?, string?, string?, string?, string?];
type Choice = {
  label: string;
  price: string;
  title: string;
  marketId?: string;
  backendMarketId?: string;
  outcomeSide?: string;
  cssClass?: string;
  disabled?: boolean;
  disabledReason?: string;
  marketScope?: string;
};
type MarketMatch = {
  id: string;
  sport: string;
  group: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  homeCode: string;
  awayCode: string;
  time: string;
  marketId?: string;
  leagueName?: string;
  leagueKey?: string;
  homeLogoUrl?: string;
  awayLogoUrl?: string;
  isLive?: boolean;
  options: MatchOption[];
  quick?: Choice[];
  fixture?: {
    kickoffTime?: string;
    status?: string;
    competition?: { name?: string; kind?: string };
  };
};
type PlayerMarket = {
  name: string;
  country: string;
  image?: string;
  title: string;
  label: string;
  yes: number;
  no: number;
  marketId?: string;
  backendMarketId?: string;
  marketScope?: string;
};
type Ticket = {
  id: string;
  title: string;
  side: string;
  price: number;
  amount: number;
  marketId?: string;
  outcomeSide?: string;
  pnl?: number;
  updatedAt: Date;
};
type PendingTicket = Omit<Ticket, 'id' | 'amount' | 'updatedAt'> & {
  backendMarketId?: string;
  marketScope?: string;
};
type PageName = 'home' | 'match' | 'positions';
type RouteState = {
  page: PageName;
  sport: string;
  category: string;
  matchId?: string;
};

const sports = ['football', 'basketball', 'cricket', 'tennis', 'formula-1', 'ufc', 'esports'];
const footballTabs = [
  ['all', 'All Games'],
  ['world-cup', 'FIFA World Cup'],
  ['international-friendly', 'Int. Friendly Games'],
  ['leagues', 'Leagues'],
  ['players', 'Player Futures'],
];
const nonFootballTabs = [['all', 'All Games']];

function parseRoute(): RouteState {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const sport = params.get('sport') || 'football';
  const fallbackCategory = sport === 'football' ? 'world-cup' : 'all';
  const page = (params.get('page') || 'home') as PageName;
  return {
    page: page === 'match' || page === 'positions' ? page : 'home',
    sport,
    category: params.get('category') || fallbackCategory,
    matchId: params.get('match') || undefined,
  };
}

function writeRoute(route: RouteState) {
  const params = new URLSearchParams();
  params.set('page', route.page);
  params.set('sport', route.sport);
  params.set('category', route.category);
  if (route.page === 'match' && route.matchId) params.set('match', route.matchId);
  const nextHash = `#${params.toString()}`;
  if (window.location.hash !== nextHash) window.history.replaceState(null, '', nextHash);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutId = 0;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function imageFor(match: MarketMatch, side: 'home' | 'away') {
  if (side === 'home') return match.homeLogoUrl || flagUrl(match.homeFlag || 'un');
  return match.awayLogoUrl || flagUrl(match.awayFlag || 'un');
}

function priceNumber(price: string | number) {
  const value = Number(String(price).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(value)) return 50;
  return String(price).includes('.') ? Math.max(1, Math.min(99, Math.round(100 / value))) : value;
}

function marketSearch(match: MarketMatch) {
  return `${match.home} ${match.away} ${match.homeCode} ${match.awayCode} ${match.leagueName || ''}`.toLowerCase();
}

function dedupeMatches(matches: MarketMatch[]) {
  const seen = new Set<string>();
  return matches.filter(match => {
    const key = [match.sport, match.group, match.time, match.home, match.away].join('|').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function optionCategory(option: MatchOption) {
  return option[1] || 'Main';
}

function optionChoices(option: MatchOption, match: MarketMatch): Choice[] {
  return [
    {
      label: option[6] || 'Yes',
      price: `${option[2]}c`,
      title: option[0],
      marketId: option[4],
      outcomeSide: option[5] || 'YES',
      cssClass: 'up',
      disabled: Boolean(option[9]),
      disabledReason: option[9] || '',
    },
    {
      label: option[8] || 'No',
      price: `${option[3]}c`,
      title: option[0],
      marketId: option[4],
      outcomeSide: option[7] || 'NO',
      cssClass: 'down',
      disabled: Boolean(option[9]),
      disabledReason: option[9] || '',
    },
  ].map(choice => ({
    ...choice,
    label:
      choice.label === match.home || choice.label === match.away || choice.label === 'Draw' || choice.label === 'Yes' || choice.label === 'No'
        ? choice.label
        : choice.label,
  }));
}

function pNl(ticket: Ticket, index: number) {
  if (typeof ticket.pnl === 'number') return ticket.pnl;
  const move = index % 2 === 0 ? 0.16 : -0.07;
  return ticket.amount * move;
}

function WalletSync({ onWalletChange }: { onWalletChange: () => void }) {
  const { address, connector, isConnected } = useAccount();

  useEffect(() => {
    let cancelled = false;

    async function syncWallet() {
      if (!isConnected || !address || !connector) {
        if (appState.selectedWalletId === 'rainbowkit') {
          appState.selectedWalletId = null;
          appState.walletProvider = null;
          appState.account = null;
          appState.connected = false;
          appState.balance = null;
          appState.portfolio = null;
          appState.pendingTicket = null;
        }
        onWalletChange();
        return;
      }

      const provider = await connector.getProvider();
      if (cancelled) return;

      appState.selectedWalletId = 'rainbowkit';
      appState.walletProvider = provider;
      appState.account = address;
      appState.connected = true;
      appState.balance = null;
      appState.portfolio = null;

      await refreshPortfolio().catch(() => undefined);
      onWalletChange();
    }

    syncWallet().catch(error => {
      console.warn('Wallet sync failed:', error);
      onWalletChange();
    });

    return () => {
      cancelled = true;
    };
  }, [address, connector, isConnected, onWalletChange]);

  return null;
}

function Header({
  sport,
  setSport,
  query,
  setQuery,
  positionCount,
  onOpenPositions,
  onHome,
  connected,
}: {
  sport: string;
  setSport: (sport: string) => void;
  query: string;
  setQuery: (query: string) => void;
  positionCount: number;
  onOpenPositions: () => void;
  onHome: () => void;
  connected: boolean;
}) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <button className="brand brand-button" type="button" aria-label="Xsporty home" onClick={onHome}>
          <span className="brand__mark">X</span>
          <span>
            <strong>Xsporty</strong>
            <small>Prediction Market</small>
          </span>
        </button>

        <label className="search-box header-search">
          <Search aria-hidden="true" size={22} />
          <input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Search teams, players, markets" />
        </label>

        <div className="wallet-panel">
          {connected ? (
            <button className="positions-top-btn" type="button" onClick={onOpenPositions}>
              My Positions
              {positionCount > 0 ? <span className="ticket-count-badge">{positionCount}</span> : null}
            </button>
          ) : null}
          <ConnectButton chainStatus="none" accountStatus="address" showBalance={false} />
        </div>

        <nav className="top-sport-nav" aria-label="Sports">
          {sports.map(item => (
            <button
              key={item}
              className={sport === item ? 'is-active' : ''}
              type="button"
              data-sport={item}
              onClick={() => setSport(item)}
            >
              {labelsBySport[item]?.title || item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ match, onOpen }: { match?: MarketMatch; onOpen: (match: MarketMatch) => void }) {
  const title = match ? `${match.home}\nVS\n${match.away}` : 'World Cup\nHeadline\nMarket';
  return (
    <section className="hero-banner wc-hero-banner home-section" aria-label="Featured World Cup market">
      <div className="wc-hero-bg" />
      <div className="wc-hero-overlay" />
      <div className="wc-hero-content">
        <div className="wc-hero-left">
          <span className="wc-hero-eyebrow">FIFA World Cup 2026 - Prediction Market</span>
          <h1 className="wc-hero-title">
            {title.split('\n').map((line, index) => (
              <React.Fragment key={line + index}>
                {index === 1 ? <span>{line}</span> : line}
                {index < title.split('\n').length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </h1>
          <p className="wc-hero-subtitle">{match ? `${match.time} - ${match.options.length} open markets from live backend data.` : 'Live markets load from the Railway backend.'}</p>
          <div className="wc-hero-badges">
            <span>{match?.homeCode || 'WC'}</span>
            <span>{match?.awayCode || '2026'}</span>
            <span>World Cup</span>
            <span>X Layer</span>
          </div>
          {match ? (
            <button className="wc-hero-action" type="button" onClick={() => onOpen(match)}>
              Open market
            </button>
          ) : null}
        </div>

        <div className="wc-hero-mid" aria-hidden="true">
          <div className="wc-hero-divider" />
          <div className="wc-hero-stats">
            <div>
              <strong>{match?.options.length || '--'}</strong>
              <span>Markets</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Teams</span>
            </div>
            <div>
              <strong>2026</strong>
              <span>World Cup</span>
            </div>
          </div>
          <div className="wc-hero-divider" />
        </div>

        <div className="wc-hero-right">
          <img className="wc-hero-logo" src="wc2026.png" alt="FIFA World Cup 2026" />
          <div className="wc-hero-teams" aria-label="Featured matchup teams">
            <span>{match ? <img src={imageFor(match, 'home')} alt={match.home} /> : null}</span>
            <b>VS</b>
            <span>{match ? <img src={imageFor(match, 'away')} alt={match.away} /> : null}</span>
          </div>
          <span className="wc-hero-hosts">USA - Mexico - Canada</span>
        </div>
      </div>
    </section>
  );
}

function PriceButton({ choice, onPick, compact = false }: { choice: Choice; onPick: (choice: Choice) => void; compact?: boolean }) {
  const showLabel = !compact || choice.label.toLowerCase() === 'draw';
  return (
    <button
      className={choice.cssClass || ''}
      type="button"
      aria-label={`${choice.label} ${choice.disabled ? 'Closed' : choice.price}`}
      disabled={choice.disabled}
      aria-disabled={choice.disabled || undefined}
      onClick={event => {
        event.stopPropagation();
        onPick(choice);
      }}
    >
      {showLabel ? <span>{choice.label}</span> : null}
      <b>{choice.disabled ? 'Closed' : choice.price}</b>
    </button>
  );
}

function FeaturedStrip({
  matches,
  mode,
  setMode,
  onOpen,
  onPick,
}: {
  matches: MarketMatch[];
  mode: string;
  setMode: (mode: string) => void;
  onOpen: (match: MarketMatch) => void;
  onPick: (choice: Choice) => void;
}) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const visible = mode === 'live' ? matches.filter(match => match.isLive) : matches.slice(0, 8);

  return (
    <section className="featured-strip home-section" aria-label="Most popular games">
      <div className="compact-section-head">
        <div className="featured-mode-tabs" aria-label="Featured market view">
          <button className={mode === 'popular' ? 'is-active' : ''} type="button" onClick={() => setMode('popular')}>
            Most Popular
          </button>
          <button className={mode === 'live' ? 'is-active' : ''} type="button" onClick={() => setMode('live')}>
            Live
          </button>
        </div>
        <div>
          <button type="button" aria-label="Scroll featured markets left" onClick={() => scroller.current?.scrollBy({ left: -360, behavior: 'smooth' })}>
            &lt;
          </button>
          <button type="button" aria-label="Scroll featured markets right" onClick={() => scroller.current?.scrollBy({ left: 360, behavior: 'smooth' })}>
            &gt;
          </button>
        </div>
      </div>
      <div className="featured-games" ref={scroller}>
        {visible.map(match => {
          const choices = quickChoices(match) as Choice[];
          return (
            <article
              key={match.id}
              className={`featured-card ${choices.length === 3 ? 'featured-card--three-way' : ''}`}
              data-search={marketSearch(match)}
              onClick={() => onOpen(match)}
            >
              <span className="sport-icon">{labelsBySport[match.sport]?.icon || '•'}</span>
              <span className="feature-time">{match.isLive ? <><span className="status-dot live" /><span className="live-label">LIVE</span></> : match.time.toUpperCase()}</span>
              <div className="featured-flags">
                <img src={imageFor(match, 'home')} alt={match.home} />
                <strong>VS</strong>
                <img src={imageFor(match, 'away')} alt={match.away} />
              </div>
              <div className="featured-names">
                <span>{match.home}</span>
                <span>{match.away}</span>
              </div>
              <div className="featured-odds">
                {choices.map(choice => (
                  <PriceButton key={`${match.id}-${choice.title}-${choice.label}`} choice={choice} onPick={onPick} compact />
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MatchCard({ match, onOpen, onPick }: { match: MarketMatch; onOpen: (match: MarketMatch) => void; onPick: (choice: Choice) => void }) {
  const choices = quickChoices(match) as Choice[];
  return (
    <article className="match-row" data-search={marketSearch(match)} onClick={() => onOpen(match)}>
      <div className="match-meta">
        <span>{match.isLive ? 'LIVE' : match.time}</span>
      </div>
      <div className="match-teams">
        <div>
          <img src={imageFor(match, 'home')} alt={match.home} />
          <strong>{match.home}</strong>
        </div>
        <b>VS</b>
        <div>
          <img src={imageFor(match, 'away')} alt={match.away} />
          <strong>{match.away}</strong>
        </div>
      </div>
      <div className="quick-odds">
        {choices.map(choice => (
          <PriceButton key={`${match.id}-${choice.title}-${choice.label}`} choice={choice} onPick={onPick} compact />
        ))}
      </div>
    </article>
  );
}

function PlayerMarketCard({ player, onPick }: { player: PlayerMarket; onPick: (choice: Choice) => void }) {
  const playerKey = player.name.toLowerCase().replaceAll(' ', '-');
  return (
    <article className="player-prop-card" data-player={playerKey} data-search={`${player.name} ${player.country} ${player.title} ${player.label}`.toLowerCase()}>
      <div className="player-prop-image" data-initials={getInitials(player.name)}>
        {player.image ? <img src={player.image} alt={player.name} /> : null}
      </div>
      <div className="player-prop-copy">
        <span>
          {player.country} - {player.label}
        </span>
        <strong>{player.title}</strong>
        <small>{player.name}</small>
      </div>
      <div className="player-prop-prices">
        <button className="price up" type="button" onClick={() => onPick({ label: 'Yes', price: `${player.yes}c`, title: player.title, marketId: player.marketId, backendMarketId: player.backendMarketId, outcomeSide: 'YES', marketScope: player.marketScope })}>
          Yes {player.yes}c
        </button>
        <button className="price down" type="button" onClick={() => onPick({ label: 'No', price: `${player.no}c`, title: player.title, marketId: player.marketId, backendMarketId: player.backendMarketId, outcomeSide: 'NO', marketScope: player.marketScope })}>
          No {player.no}c
        </button>
      </div>
    </article>
  );
}

function MarketBoard({
  sport,
  category,
  setCategory,
  matches,
  players,
  query,
  onOpen,
  onPick,
}: {
  sport: string;
  category: string;
  setCategory: (category: string) => void;
  matches: MarketMatch[];
  players: PlayerMarket[];
  query: string;
  onOpen: (match: MarketMatch) => void;
  onPick: (choice: Choice) => void;
}) {
  const tabs = sport === 'football' ? footballTabs : nonFootballTabs;
  const filteredMatches = matches.filter(match => {
    if (match.sport !== sport) return false;
    if (query && !marketSearch(match).includes(query.toLowerCase())) return false;
    if (sport !== 'football') return true;
    if (category === 'all') return true;
    if (category === 'players') return false;
    return match.group === category;
  });
  const filteredPlayers = players.filter(player => {
    if (category !== 'players') return false;
    if (!query) return true;
    return `${player.name} ${player.country} ${player.title} ${player.label}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <section className="market-board home-section" id="games-board">
      <div className="section-head">
        <div>
          <h2>
            <span className="sport-icon-inline">{labelsBySport[sport]?.icon}</span> {labelsBySport[sport]?.title || 'Markets'}
          </h2>
        </div>
      </div>
      <div className="market-tabs">
        {tabs.map(([key, label]) => (
          <button key={key} className={category === key ? 'is-active' : ''} type="button" onClick={() => setCategory(key)}>
            {label}
          </button>
        ))}
      </div>
      {category === 'players' ? (
        <div className="player-market-grid">
          {filteredPlayers.map(player => (
            <PlayerMarketCard key={`${player.name}-${player.title}`} player={player} onPick={onPick} />
          ))}
          {!filteredPlayers.length ? <EmptyState title="No player markets found" text="Try another search term or check back after the next sync." /> : null}
        </div>
      ) : (
        <div className="match-list" aria-label="Market game cards">
          {filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} onOpen={onOpen} onPick={onPick} />
          ))}
          {!filteredMatches.length ? <EmptyState title={`No ${labelsBySport[sport]?.title || 'sports'} markets yet`} text="The backend is online, but this sport has no open cards right now." /> : null}
        </div>
      )}
    </section>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function LoadingMarkets() {
  return (
    <div className="loading-markets" role="status" aria-live="polite">
      <span />
      Loading live markets from Railway...
    </div>
  );
}

function MatchPage({ match, onBack, onPick }: { match: MarketMatch; onBack: () => void; onPick: (choice: Choice) => void }) {
  const [group, setGroup] = useState('All');
  const groups = useMemo(() => ['All', ...Array.from(new Set(match.options.map(optionCategory)))], [match]);
  const shownOptions = group === 'All' ? match.options : match.options.filter(option => optionCategory(option) === group);

  useEffect(() => {
    setGroup('All');
  }, [match.id]);

  return (
    <section className="match-page" id="match-page">
      <button className="back-button" type="button" onClick={onBack}>
        Back to games
      </button>
      <div className="match-detail-card">
        <div className="match-meta detail-meta">
          <span>{match.time} - Prediction markets available</span>
        </div>
        <div className="detail-title-row">
          <div className="detail-matchup">
            <div className="detail-team">
              <img src={imageFor(match, 'home')} alt={match.home} />
              <span>{match.homeCode}</span>
            </div>
            <h2>{match.home} vs {match.away}</h2>
            <div className="detail-team">
              <img src={imageFor(match, 'away')} alt={match.away} />
              <span>{match.awayCode}</span>
            </div>
          </div>
        </div>
        <div className="stats-toggle-box">
          <button className="stats-toggle" type="button">STATS</button>
        </div>
        <div className="option-tabs" aria-label="Match market groups">
          {groups.map(item => (
            <button key={item} className={group === item ? 'is-active' : ''} type="button" onClick={() => setGroup(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="option-list">
          {shownOptions.map(option => (
            <div className={`option-row ${option[9] ? 'is-disabled' : ''}`} key={`${option[4]}-${option[0]}`}>
              <div>
                <strong>{option[0]}</strong>
                <span>{optionCategory(option)}</span>
              </div>
              {optionChoices(option, match).map(choice => (
                <button
                  key={`${option[4]}-${choice.outcomeSide}`}
                  className={`price ${choice.cssClass || ''}`}
                  type="button"
                  disabled={choice.disabled}
                  onClick={() => onPick(choice)}
                >
                  {choice.label} {choice.price}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TradeSlip({
  pending,
  amount,
  setAmount,
  tickets,
  view,
  setView,
  connected,
  onConfirm,
  onPnl,
}: {
  pending: PendingTicket | null;
  amount: string;
  setAmount: (amount: string) => void;
  tickets: Ticket[];
  view: 'trade' | 'positions';
  setView: (view: 'trade' | 'positions') => void;
  connected: boolean;
  onConfirm: () => void;
  onPnl: (ticket: Ticket, index: number) => void;
}) {
  const numericAmount = Number(amount) || 0;
  const price = pending?.price || 50;
  const shares = price > 0 ? numericAmount / (price / 100) : 0;

  return (
    <aside className="right-rail">
      <section className="trade-slip">
        <div className="slip-tabs">
          <button className={view === 'trade' ? 'is-active' : ''} type="button" onClick={() => setView('trade')}>Trade</button>
          <button className={view === 'positions' ? 'is-active positions-tab' : 'positions-tab'} type="button" onClick={() => setView('positions')}>
            My Positions
            {tickets.length ? <span className="ticket-count-badge">{tickets.length}</span> : null}
          </button>
        </div>
        {view === 'trade' ? (
          <div className="ticket-view trade-view is-active">
            <div className="side-toggle" role="group" aria-label="Trade side">
              <button className={pending?.side !== 'NO' ? 'is-active' : ''} type="button">YES</button>
              <button className={pending?.side === 'NO' ? 'is-active' : ''} type="button">NO</button>
            </div>
            <h2>{pending?.title || 'Choose a market price'}</h2>
            <label>
              Amount
              <span className="amount-wrap">
                <input value={amount} onChange={event => setAmount(event.target.value.replace(/[^0-9.]/g, ''))} type="text" inputMode="decimal" aria-label="Trade amount" />
                <span className="amount-suffix">{SYMBOL}</span>
              </span>
            </label>
            <div className="quote-grid">
              <span>Avg price</span>
              <strong>{price}c</strong>
              <span>Est. shares</span>
              <strong>{shares.toFixed(1)}</strong>
              <span>Max payout</span>
              <strong>${shares.toFixed(2)}</strong>
            </div>
            <button className="connect-btn full confirm-trade" type="button" onClick={onConfirm}>
              {connected ? 'Confirm ticket' : 'Connect wallet first'}
            </button>
          </div>
        ) : (
          <div className="ticket-view positions-view is-active">
            <h2 className="positions-title">My Positions</h2>
            <div className="ticket-stack">
              {tickets.length ? (
                <div className="position-tabs" aria-label="My positions">
                  {tickets.map((ticket, index) => (
                    <button className="ticket-card" type="button" key={ticket.id} onClick={() => onPnl(ticket, index)}>
                      <span className={`ticket-side ${ticket.side.toLowerCase()}`}>{ticket.side}</span>
                      <strong>{ticket.title}</strong>
                      <small>{ticket.price}c entry - {ticket.amount.toFixed(2)} {SYMBOL}</small>
                      <b className={pNl(ticket, index) >= 0 ? 'is-profit' : 'is-loss'}>
                        {pNl(ticket, index) >= 0 ? '+' : ''}{pNl(ticket, index).toFixed(2)}
                      </b>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="ticket-empty">
                  <strong>No positions yet</strong>
                  <span>Pick any YES or NO price to create a position.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </aside>
  );
}

function PositionsPage({ tickets, onBack, onPnl }: { tickets: Ticket[]; onBack: () => void; onPnl: (ticket: Ticket, index: number) => void }) {
  const net = tickets.reduce((sum, ticket, index) => sum + pNl(ticket, index), 0);
  return (
    <section className="positions-dashboard">
      <button className="back-button" type="button" onClick={onBack}>Back to games</button>
      <div className="history-hero">
        <div>
          <span className="status-dot" />
          <h2>My Positions</h2>
        </div>
        <p>Track open prediction market positions from your connected wallet.</p>
      </div>
      <div className="history-summary positions-dashboard__summary">
        <article><span>Open Positions</span><strong>{tickets.length}</strong></article>
        <article><span>Net P/L</span><strong className={net >= 0 ? 'is-profit' : 'is-loss'}>{net >= 0 ? '+' : ''}{net.toFixed(2)} {SYMBOL}</strong></article>
        <article><span>Markets</span><strong>{new Set(tickets.map(ticket => ticket.marketId || ticket.title)).size}</strong></article>
      </div>
      <div className="positions-dashboard__grid">
        <article className="history-list positions-dashboard__history">
          <h3>Positions</h3>
          <div className="dashboard-list">
            {tickets.map((ticket, index) => (
              <button className="dashboard-row" type="button" key={ticket.id} onClick={() => onPnl(ticket, index)}>
                <div>
                  <span className={`ticket-side ${ticket.side.toLowerCase()}`}>{ticket.side}</span>
                  <strong>{ticket.title}</strong>
                  <small>{ticket.amount.toFixed(2)} shares at {ticket.price}c</small>
                </div>
                <b className={pNl(ticket, index) >= 0 ? 'is-profit' : 'is-loss'}>{pNl(ticket, index) >= 0 ? '+' : ''}{pNl(ticket, index).toFixed(2)} {SYMBOL}</b>
              </button>
            ))}
            {!tickets.length ? <div className="ticket-empty"><strong>No positions</strong><span>Confirmed tickets appear here.</span></div> : null}
          </div>
        </article>
      </div>
    </section>
  );
}

function PnlModal({ ticket, onClose }: { ticket: Ticket | null; onClose: () => void }) {
  if (!ticket) return null;
  const pnl = pNl(ticket, 0);
  return (
    <div className="pnl-modal">
      <button className="pnl-modal__backdrop" type="button" onClick={onClose} aria-label="Close PnL card" />
      <article className="share-pnl-card" role="dialog" aria-modal="true" aria-labelledby="share-pnl-title">
        <button className="share-pnl-card__close" type="button" onClick={onClose} aria-label="Close PnL card">x</button>
        <div className="share-pnl-card__brand">
          <span className="brand__mark">X</span>
          <div><strong>Xsporty Markets</strong><small>Position on X Layer</small></div>
        </div>
        <div className="share-pnl-card__headline">
          <span>Open position</span>
          <h2 id="share-pnl-title">{ticket.title}</h2>
        </div>
        <div className={`share-pnl-card__amount ${pnl >= 0 ? 'is-profit' : 'is-loss'}`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} {SYMBOL}</div>
        <div className="share-pnl-card__meta">
          <div><span>Side</span><strong>{ticket.side}</strong></div>
          <div><span>Entry</span><strong>{ticket.price}c</strong></div>
          <div><span>Stake</span><strong>{ticket.amount.toFixed(2)} {SYMBOL}</strong></div>
          <div><span>Status</span><strong>Open</strong></div>
        </div>
        <div className="share-pnl-card__bar"><span style={{ width: `${Math.min(100, Math.max(10, ticket.price))}%` }} /></div>
        <p>Screenshot-ready Xsporty position card.</p>
      </article>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a className="brand footer-logo" href="#" onClick={event => event.preventDefault()}>
            <span className="brand__mark">X</span>
            <span><strong>Xsporty</strong><small>Prediction Market on X Layer</small></span>
          </a>
          <p>World Cup markets for match outcomes and player moments.</p>
          <div className="footer-socials" aria-label="Social links">
            <a href="https://x.com/XLayerOfficial" target="_blank" rel="noreferrer" aria-label="X Layer on X">X</a>
            <a href="https://t.me/okxofficial_en" target="_blank" rel="noreferrer" aria-label="Telegram">TG</a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" aria-label="Discord">DC</a>
          </div>
        </div>
        <nav className="footer-links" aria-label="Market links">
          <h2>Markets</h2>
          <a href="#games-board">Markets</a>
          <a href="#games-board">How It Works</a>
          <a href="#games-board">Terms &amp; Conditions</a>
          <a href="#games-board">Privacy Policy</a>
        </nav>
        <nav className="footer-links" aria-label="Help links">
          <h2>Help</h2>
          <a href="#games-board">FAQ</a>
          <a href="#games-board">Wallet Support</a>
          <a href="https://www.okx.com/xlayer/docs" target="_blank" rel="noreferrer">X Layer Docs</a>
        </nav>
      </div>
    </footer>
  );
}

export function App() {
  const initialRoute = useRef<RouteState>(parseRoute());
  const [matches, setMatches] = useState<MarketMatch[]>([]);
  const [players, setPlayers] = useState<PlayerMarket[]>([]);
  const [sport, setSport] = useState(initialRoute.current.sport);
  const [category, setCategory] = useState(initialRoute.current.category);
  const [query, setQuery] = useState('');
  const [featuredMode, setFeaturedMode] = useState('popular');
  const [selectedMatch, setSelectedMatch] = useState<MarketMatch | null>(null);
  const [pending, setPending] = useState<PendingTicket | null>(null);
  const [amount, setAmount] = useState('100');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [slipView, setSlipView] = useState<'trade' | 'positions'>('trade');
  const [page, setPage] = useState<PageName>(initialRoute.current.page === 'match' && !initialRoute.current.matchId ? 'home' : initialRoute.current.page);
  const [pnlTicket, setPnlTicket] = useState<Ticket | null>(null);
  const [apiError, setApiError] = useState('');
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [, setWalletPulse] = useState(0);
  const orbRef = useRef<HTMLButtonElement | null>(null);
  const didHandleInitialSport = useRef(false);
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const refreshWalletState = useCallback(() => {
    setWalletPulse(value => value + 1);
    setTickets([...(appState.tickets || [])] as Ticket[]);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setApiError('');
      const fallbackMatches = dedupeMatches([...(gameMarkets as MarketMatch[])]);
      if (fallbackMatches.length && !cancelled) {
        setMatches(fallbackMatches);
        setPlayers([...(playerPropMarkets as PlayerMarket[])]);
        setLoadingMarkets(false);
      }

      const ok = await withTimeout(hydrateFromBackend(), 15000, 'Backend market load');
      if (cancelled) return;
      const nextMatches = dedupeMatches([...(gameMarkets as MarketMatch[])]);
      if (nextMatches.length) setMatches(nextMatches);
      setPlayers([...(playerPropMarkets as PlayerMarket[])]);
      if (!sports.includes(sport)) setSport(appState.sport || 'football');
      const route = initialRoute.current;
      if (route.page === 'match' && route.matchId) {
        const routeMatch = nextMatches.find(match => match.id === route.matchId);
        if (routeMatch) {
          setSelectedMatch(routeMatch);
          setPage('match');
        }
      }
      if (!ok && !fallbackMatches.length) setApiError('Could not connect to backend market data.');
      setLoadingMarkets(false);
    }

    load().catch(error => {
      console.warn('Market load failed:', error);
      if (!cancelled) {
        const fallbackMatches = dedupeMatches([...(gameMarkets as MarketMatch[])]);
        if (fallbackMatches.length) {
          setMatches(fallbackMatches);
          setPlayers([...(playerPropMarkets as PlayerMarket[])]);
        } else {
          setApiError('Could not connect to backend market data.');
        }
        setLoadingMarkets(false);
      }
    });
    const refreshId = window.setInterval(() => {
      load().catch(error => console.warn('Market refresh failed:', error));
    }, 60000);
    return () => {
      cancelled = true;
      window.clearInterval(refreshId);
    };
  }, []);

  useEffect(() => {
    if (!didHandleInitialSport.current) {
      didHandleInitialSport.current = true;
      return;
    }
    setCategory(sport === 'football' ? 'world-cup' : 'all');
    setSelectedMatch(null);
    setPage('home');
  }, [sport]);

  useEffect(() => {
    if (page === 'match' && !selectedMatch) return;
    writeRoute({
      page,
      sport,
      category,
      matchId: selectedMatch?.id,
    });
  }, [category, page, selectedMatch?.id, sport]);

  useEffect(() => {
    function handleRouteChange() {
      const route = parseRoute();
      setSport(route.sport);
      setCategory(route.category);
      if (route.page === 'match' && route.matchId) {
        const routeMatch = matches.find(match => match.id === route.matchId);
        if (routeMatch) {
          setSelectedMatch(routeMatch);
          setPage('match');
          return;
        }
      }
      setSelectedMatch(null);
      setPage(route.page === 'match' ? 'home' : route.page);
    }

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [matches]);

  const sportMatches = useMemo(() => matches.filter(match => match.sport === sport), [matches, sport]);
  const heroMatch = useMemo(() => {
    const worldCup = matches.filter(match => match.sport === 'football' && match.group === 'world-cup');
    return worldCup[0] || matches.find(match => match.sport === 'football') || matches[0];
  }, [matches]);

  const pickMarket = useCallback((choice: Choice) => {
    if (choice.disabled) {
      window.alert(choice.disabledReason || 'Market is closed');
      return;
    }
    const price = priceNumber(choice.price);
    const side = choice.outcomeSide || (choice.cssClass === 'down' ? 'NO' : 'YES');
    const next = {
      title: choice.title,
      side,
      price,
      marketId: choice.marketId,
      backendMarketId: choice.backendMarketId,
      outcomeSide: choice.outcomeSide || side,
      marketScope: choice.marketScope,
    };
    appState.pendingTicket = next;
    appState.price = price;
    appState.side = side;
    setPending(next);
    setSlipView('trade');
  }, []);

  const openMatch = useCallback((match: MarketMatch) => {
    setSelectedMatch(match);
    setPage('match');
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, []);

  const showHome = useCallback(() => {
    setSelectedMatch(null);
    setPage('home');
    window.requestAnimationFrame(() => {
      const target = document.querySelector('.wc-hero-banner') || document.querySelector('#games-board');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const confirmTicket = useCallback(async () => {
    if (!pending) {
      window.alert('Choose a market price first');
      return;
    }
    const stake = Number(amount) || 0;
    if (!stake) {
      window.alert('Enter an amount');
      return;
    }
    if (!isConnected || !address) {
      openConnectModal?.();
      return;
    }
    try {
      if (address !== FALLBACK_WALLET_ADDRESS && pending.marketId) {
        await submitBackendOrder(pending, stake);
        await refreshPortfolio().catch(() => undefined);
      }
      const ticket: Ticket = { ...pending, id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, amount: stake, updatedAt: new Date() };
      const nextTickets = [ticket, ...tickets];
      appState.tickets = nextTickets;
      setTickets(nextTickets);
      setPending(null);
      setSlipView('positions');
    } catch (error) {
      console.warn(error);
      window.alert(error instanceof Error ? error.message : 'Order submission failed');
    }
  }, [address, amount, isConnected, openConnectModal, pending, tickets]);

  const animateOrb = useCallback(() => {
    const node = orbRef.current;
    if (!node) return;
    node.classList.remove(...WC_ANIMS);
    void node.offsetWidth;
    node.classList.add(WC_ANIMS[Math.floor(Math.random() * WC_ANIMS.length)]);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Math.random() < 0.45) animateOrb();
    }, 14000);
    return () => window.clearInterval(timer);
  }, [animateOrb]);

  return (
    <>
      <WalletSync onWalletChange={refreshWalletState} />
      <Header
        sport={sport}
        setSport={setSport}
        query={query}
        setQuery={setQuery}
        positionCount={tickets.length}
        onOpenPositions={() => setPage('positions')}
        onHome={showHome}
        connected={isConnected}
      />
      <main className={`dashboard-shell ${page === 'match' ? 'is-match-open' : ''} ${pending || tickets.length || page === 'positions' ? 'has-right-rail' : 'no-right-rail'}`}>
        <section className="main-column">
          {page === 'home' ? (
            <>
              {sport === 'football' ? <Hero match={heroMatch} onOpen={openMatch} /> : null}
              {sport === 'football' ? (
                <FeaturedStrip matches={sportMatches} mode={featuredMode} setMode={setFeaturedMode} onOpen={openMatch} onPick={pickMarket} />
              ) : null}
              {loadingMarkets ? <LoadingMarkets /> : null}
              <MarketBoard sport={sport} category={category} setCategory={setCategory} matches={matches} players={players} query={query} onOpen={openMatch} onPick={pickMarket} />
              {apiError ? <div id="error-screen"><div className="error-content"><strong>Backend unavailable</strong><p>{apiError}</p><button type="button" onClick={() => window.location.reload()}>Retry</button></div></div> : null}
            </>
          ) : null}
          {page === 'match' && selectedMatch ? <MatchPage match={selectedMatch} onBack={() => setPage('home')} onPick={pickMarket} /> : null}
          {page === 'positions' ? <PositionsPage tickets={tickets} onBack={() => setPage('home')} onPnl={setPnlTicket} /> : null}
        </section>
        <TradeSlip
          pending={pending}
          amount={amount}
          setAmount={setAmount}
          tickets={tickets}
          view={slipView}
          setView={setSlipView}
          connected={isConnected}
          onConfirm={confirmTicket}
          onPnl={setPnlTicket}
        />
      </main>
      <button className="floating-ticket-button" type="button" ref={orbRef} onClick={() => (tickets.length ? setPage('positions') : animateOrb())} aria-label={tickets.length ? 'Open positions' : 'FIFA World Cup 2026'}>
        {tickets.length ? <span className="ticket-count-badge">{tickets.length}</span> : null}
        <img src="wc2026.png" alt="FIFA World Cup 2026" className="wc26-logo" />
      </button>
      <PnlModal ticket={pnlTicket} onClose={() => setPnlTicket(null)} />
      <Footer />
    </>
  );
}
