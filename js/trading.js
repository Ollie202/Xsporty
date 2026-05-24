import { state } from './state.js';
import { getPrice, getTradeAmount, estimatePnl, formatSigned } from './utils.js';
import { showToast, showTrade, showPositions, setSideButton, setActive, openPnlCard, ticketRow, historyRow } from './ui.js';
import { applyConnectedWallet } from './wallet.js';
import { claimWinnings, submitBackendOrder, refreshPortfolio } from './api.js';
import { SYMBOL, FALLBACK_WALLET_ADDRESS } from './constants.js';

const ticketTitle = document.querySelector(".trade-view h2");
const amountInput = document.querySelector(".trade-slip input");
const quoteValues = document.querySelectorAll(".quote-grid strong");
const sideButtons = document.querySelectorAll(".side-toggle button");
const ticketStack = document.querySelector("#ticket-stack");
const confirmTradeButton = document.querySelector("[data-action='confirm-trade']");

export function selectMarket(title, button, choice = {}) {
  const price = getPrice(button.textContent);
  if (!title || !price) return;
  const side = choice.outcomeSide || button.dataset.outcomeSide || (button.classList.contains("down") ? "NO" : "YES");
  state.price = price;
  state.side = side;
  state.pendingTicket = {
    title,
    side,
    price,
    marketId: choice.marketId || button.dataset.marketId || undefined,
    backendMarketId: choice.backendMarketId,
    outcomeSide: choice.outcomeSide || button.dataset.outcomeSide || side,
    marketScope: choice.marketScope
  };
  document.querySelectorAll(".option-row, .player-prop-card").forEach(row => row.classList.remove("is-selected"));
  button.closest(".option-row, .player-prop-card")?.classList.add("is-selected");
  ticketTitle.textContent = title;
  quoteValues[0].textContent = `${price}c`;
  setSideButton(state.side === "NO" || state.side === "UNDER" ? "NO" : "YES");
  updateQuote();
  if (choice.marketScope === "tournament") {
    document.body.classList.add("is-match-open");
    document.body.classList.remove("is-history-page");
  }
  showTrade();
  showToast("Ticket loaded in Trade. Confirm when ready.");
}

export function wireConfirmTrade() {
  confirmTradeButton?.addEventListener("click", async () => {
    const pending = state.pendingTicket;
    if (!pending || !pending.title || !pending.price) {
      showToast("Choose a market price first");
      return;
    }
    const amount = getTradeAmount();
    if (!state.connected) {
      showToast("Connect wallet before confirming");
      return;
    }
    confirmTradeButton.disabled = true;
    try {
      if (state.account && state.account !== FALLBACK_WALLET_ADDRESS) {
        if (!pending.marketId) {
          showToast("This market is preview-only until backend settlement is added.");
          return;
        }
        await submitBackendOrder(pending, amount);
        await refreshPortfolio();
        applyConnectedWallet();
        showToast("Ticket confirmed on-chain and moved to My Positions");
      } else {
        addTicket({ ...pending, amount });
        showToast("Ticket saved locally. Connect a real wallet for on-chain orders.");
      }
      state.pendingTicket = null;
      showPositions();
      updateQuote();
    } catch (error) {
      console.warn(error);
      showToast(error.message || "Order submission failed");
    } finally {
      confirmTradeButton.disabled = false;
    }
  });
}

export function addTicket({ title, side, price, amount }) {
  const existing = state.tickets.find(ticket => ticket.title === title && ticket.side === side);
  if (existing) {
    existing.price = price;
    existing.amount += amount;
    existing.updatedAt = new Date();
  } else {
    state.tickets.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      side,
      price,
      amount,
      updatedAt: new Date(),
    });
  }
  renderTickets();
  updateTicketBadges();
}

export function renderTickets() {
  if (!ticketStack) return;
  const activeTickets = getOpenTickets();

  if (activeTickets.length === 0) {
    ticketStack.innerHTML = `
      <div class="ticket-empty">
        <strong>No positions yet</strong>
      <span>Pick any YES or NO price to create a position.</span>
      </div>
    `;
    updateTicketBadges();
    return;
  }

  ticketStack.innerHTML = `
    <div class="position-tabs" aria-label="My positions">
      ${activeTickets.map((ticket, index) => ticketRow(ticket, index)).join("")}
    </div>
  `;
  ticketStack.querySelectorAll("[data-pnl-ticket]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.pnlTicket);
      const ticket = activeTickets[index];
      openPnlCard({ ...ticket, pnl: getTicketPnl(ticket, index), index });
    });
  });
  updateTicketBadges();
}

export function updateTicketBadges() {
  const count = getOpenTickets().length;
  const unseenCount = Math.max(0, count - (state.seenPositionCount || 0));
  document.querySelectorAll("[data-ticket-count]").forEach(badge => {
    badge.textContent = unseenCount;
    badge.hidden = unseenCount === 0;
  });
}

export function markPositionsSeen() {
  state.seenPositionCount = getOpenTickets().length;
  updateTicketBadges();
}

export function getOpenTickets() {
  return state.tickets;
}

export function getTicketPnl(ticket, index) {
  return typeof ticket.pnl === "number" ? ticket.pnl : estimatePnl(ticket, index);
}

export function updateQuote() {
  const amount = getTradeAmount();
  const shares = state.price > 0 ? amount / (state.price / 100) : 0;
  quoteValues[1].textContent = shares.toFixed(1);
  quoteValues[2].textContent = `$${shares.toFixed(2)}`;
}

amountInput?.addEventListener("input", () => {
  amountInput.value = amountInput.value.replace(/[^0-9.]/g, "");
  updateQuote();
});

export function renderHistoryPage() {
  const historyPage = document.querySelector("#history-page");
  const historyColumns = document.querySelector("#history-columns");
  const historyWinCount = document.querySelector("#history-win-count");
  const historyLossCount = document.querySelector("#history-loss-count");
  const historyNetPnl = document.querySelector("#history-net-pnl");
  if (!historyColumns) return;
  const settled = getHistoryRows();
  const wins = settled.filter(item => item.pnl >= 0);
  const losses = settled.filter(item => item.pnl < 0);
  const net = settled.reduce((sum, item) => sum + item.pnl, 0);

  historyWinCount.textContent = wins.length;
  historyLossCount.textContent = losses.length;
  historyNetPnl.textContent = `${formatSigned(net)} ${SYMBOL}`;
  historyNetPnl.className = net >= 0 ? "is-profit" : "is-loss";
  historyColumns.innerHTML = `
    <article class="history-list">
      <h3>Wins</h3>
      ${wins.map(item => historyRow(item, settled.indexOf(item))).join("") || `<div class="ticket-empty"><strong>No wins yet</strong><span>Settled winning positions will show here.</span></div>`}
    </article>
    <article class="history-list">
      <h3>Losses</h3>
      ${losses.map(item => historyRow(item, settled.indexOf(item))).join("") || `<div class="ticket-empty"><strong>No losses yet</strong><span>Settled losing positions will show here.</span></div>`}
    </article>
  `;
  historyColumns.querySelectorAll("[data-history-pnl]").forEach(button => {
    button.addEventListener("click", () => {
      const ticket = settled[Number(button.dataset.historyPnl)];
      openPnlCard(ticket);
    });
  });
  historyColumns.querySelectorAll("[data-claim-market]").forEach(button => {
    button.addEventListener("click", handleHistoryClaimClick);
    button.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      handleHistoryClaimClick(event);
    });
  });
}

export function getHistoryRows() {
  return (state.portfolio?.positions || []).flatMap(position => {
    if (position.resolution?.status !== "submitted" || position.resolution?.outcome === "VOID") return [];
    return (position.outcomes || [])
      .filter(outcome => Number(outcome.balance || 0) > 0)
      .map(outcome => {
        const amount = Number(outcome.balance || 0) / 1000000;
        const winning = Boolean(outcome.winning);
        return {
          id: `${position.market?.id || "market"}-${outcome.outcome?.side || "outcome"}`,
          title: position.market?.title || "Settled market",
          side: outcome.outcome?.side || "YES",
          price: 0,
          amount,
          pnl: Number(outcome.unrealizedPnl ?? (winning ? outcome.currentValue : `-${outcome.costBasis || outcome.balance}`)) / 1000000 || (winning ? amount : -amount),
          status: winning ? "Settled win" : "Settled loss",
          details: `${winning ? "Winning outcome" : "Losing outcome"} - ${amount.toFixed(2)} shares`,
          redeemable: Boolean(outcome.redeemable),
          marketId: position.market?.id || position.marketId
        };
      });
  });
}

async function handleHistoryClaimClick(event) {
  event.stopPropagation();
  const button = event.currentTarget;
  if (button.dataset.claiming === "true") return;
  const marketId = button.dataset.claimMarket;
  if (!marketId) return;
  button.dataset.claiming = "true";
  button.setAttribute("aria-disabled", "true");
  const previous = button.textContent;
  button.textContent = "Claiming";
  try {
    await claimWinnings(marketId);
    showToast("Winnings claimed");
    await refreshPortfolio();
    renderHistoryPage();
    renderTickets();
  } catch (error) {
    console.warn("Claim failed:", error);
    showToast(error.message || "Claim failed");
  } finally {
    button.dataset.claiming = "false";
    button.removeAttribute("aria-disabled");
    button.textContent = previous || "Claim winnings";
  }
}

export async function openHistoryPage() {
  document.body.classList.add("is-history-page");
  document.querySelector("#match-page").hidden = true;
  document.querySelectorAll(".home-section").forEach(section => (section.hidden = true));
  document.querySelector("#positions-dashboard").hidden = true;
  const historyPage = document.querySelector("#history-page");
  const historyColumns = document.querySelector("#history-columns");
  if (historyColumns) {
    historyColumns.innerHTML = `<article class="history-list"><div class="ticket-empty"><strong>Loading history</strong><span>Checking settled markets.</span></div></article>`;
  }
  historyPage.hidden = false;
  historyPage.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    if (state.connected && state.account) await refreshPortfolio();
  } catch (error) {
    console.warn("History portfolio refresh failed:", error);
  }
  renderHistoryPage();

}
