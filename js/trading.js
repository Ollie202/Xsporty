import { state } from './state.js';
import { getPrice, getTradeAmount, estimatePnl, formatSigned, humanMarketLabel } from './utils.js';
import { showToast, showTrade, showPositions, setSideButton, setActive, openPnlCard, ticketRow, historyRow } from './ui.js';
import { applyConnectedWallet } from './wallet.js';
import { claimWinnings, submitBackendOrder, refreshPortfolio } from './api.js';
import { SYMBOL } from './constants.js';

const ticketTitle = document.querySelector(".trade-view h2");
const amountInput = document.querySelector(".trade-slip input");
const quoteValues = document.querySelectorAll(".quote-grid strong");
const sideButtons = document.querySelectorAll(".side-toggle button");
const ticketStack = document.querySelector("#ticket-stack");
const confirmTradeButton = document.querySelector("[data-action='confirm-trade']");

export function selectMarket(title, button, choice = {}) {
  if (choice.disabled || button?.disabled || button?.getAttribute("aria-disabled") === "true") {
    showToast(choice.disabledReason || button?.dataset.disabledReason || "Market is closed");
    return;
  }
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
    if (!state.account) {
      showToast("Wallet account not ready. Reconnect wallet.");
      return;
    }
    if (!pending.marketId) {
      showToast("This market is not available for trading yet.");
      return;
    }
    confirmTradeButton.disabled = true;
    try {
      const submitted = await submitBackendOrder(pending, amount);
      await refreshPortfolio();
      applyConnectedWallet();
      if (submitted?.autoMatch?.matched || submitted?.order?.status === "filled") {
        showToast("Ticket confirmed on-chain and moved to My Positions");
      } else {
        showToast("Order accepted and waiting to fill. Balance updates after it matches.");
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
  const rows = getHistoryRows();
  const settled = rows.filter(item => item.kind !== "activity");
  const activity = rows.filter(item => item.kind === "activity");
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
      ${wins.map(item => historyRow(item, rows.indexOf(item))).join("") || `<div class="ticket-empty"><strong>No wins yet</strong><span>Settled winning positions will show here.</span></div>`}
    </article>
    <article class="history-list">
      <h3>Losses</h3>
      ${losses.map(item => historyRow(item, rows.indexOf(item))).join("") || `<div class="ticket-empty"><strong>No losses yet</strong><span>Settled losing positions will show here.</span></div>`}
    </article>
    <article class="history-list">
      <h3>Activity</h3>
      ${activity.map(item => historyRow(item, rows.indexOf(item))).join("") || `<div class="ticket-empty"><strong>No activity yet</strong><span>Filled and cancelled orders will show here.</span></div>`}
    </article>
  `;
  historyColumns.querySelectorAll("[data-history-pnl]").forEach(button => {
    button.addEventListener("click", () => {
      const ticket = rows[Number(button.dataset.historyPnl)];
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
  const portfolio = state.portfolio || {};
  const activityByOutcome = outcomeActivity(portfolio);
  const marketTitles = marketTitleMap(portfolio);
  const settledRows = (portfolio.positions || []).flatMap(position => {
    if (position.resolution?.status !== "submitted" || position.resolution?.outcome === "VOID") return [];
    return netSettledOutcomes(position, activityByOutcome)
      .map(outcome => {
        const side = outcome.outcome?.side || "YES";
        const key = historyKey(position.market?.id || position.marketId, side);
        const activity = activityByOutcome.get(key);
        const balanceMicro = Number(outcome.balance || 0);
        const activitySharesMicro = activity?.sharesMicro || 0;
        const amountMicro = balanceMicro > 0 ? balanceMicro : activitySharesMicro;
        if (amountMicro <= 0) return null;
        const amount = amountMicro / 1000000;
        const winning = Boolean(outcome.winning);
        const claimed = winning && balanceMicro <= 0 && activitySharesMicro > 0;
        const marketCostMicro = marketActivityCost(position.market?.id || position.marketId, activityByOutcome);
        const pnl = settledPnl(outcome, activity, winning, amountMicro, marketCostMicro);
        const settlementAmount = winning
          ? amount
          : (marketCostMicro || Number(outcome.costBasis || activity?.costMicro || amountMicro)) / 1000000;
        return {
          id: `${position.market?.id || "market"}-${outcome.outcome?.side || "outcome"}`,
          kind: "settled",
          title: position.market?.title || "Settled market",
          side,
          price: 0,
          amount,
          pnl,
          status: winning ? (claimed ? "Claimed win" : "Settled win") : "Settled loss",
          details: historyOutcomeDetails(winning, amount, settlementAmount, claimed),
          settlementLabel: winning ? "Payout" : "Lost",
          settlementAmount,
          redeemable: Boolean(outcome.redeemable),
          marketId: position.market?.id || position.marketId
        };
      })
      .filter(Boolean);
  });
  const activityRows = orderActivityRows(portfolio, marketTitles);
  return [...settledRows, ...activityRows];
}

function netSettledOutcomes(position, activityByOutcome) {
  const outcomes = position.outcomes || [];
  const winning = outcomes.filter(outcome =>
    outcome.winning || outcome.outcome?.side === position.resolution?.outcome
  );
  const winningWithAmount = winning
    .map(outcome => outcomeWithHistoryBalance(position, outcome, activityByOutcome))
    .filter(outcome => Number(outcome.balance || 0) > 0);
  if (winningWithAmount.length) return winningWithAmount;

  const losingWithAmount = outcomes
    .filter(outcome => !outcome.winning && outcome.outcome?.side !== position.resolution?.outcome)
    .map(outcome => outcomeWithHistoryBalance(position, outcome, activityByOutcome))
    .filter(outcome => Number(outcome.balance || 0) > 0);
  if (losingWithAmount.length === 1) return losingWithAmount;

  const yes = outcomes.find(outcome => outcome.outcome?.side === "YES");
  const no = outcomes.find(outcome => outcome.outcome?.side === "NO");
  if (!yes || !no) return outcomes;

  const marketId = position.market?.id || position.marketId;
  const yesAmount = historyOutcomeAmountMicro(marketId, yes, activityByOutcome);
  const noAmount = historyOutcomeAmountMicro(marketId, no, activityByOutcome);
  if (yesAmount <= 0 && noAmount <= 0) return [];
  if (yesAmount === noAmount) return [];

  const netOutcome = yesAmount > noAmount ? yes : no;
  return [{ ...netOutcome, balance: String(Math.abs(yesAmount - noAmount)) }];
}

function outcomeWithHistoryBalance(position, outcome, activityByOutcome) {
  const marketId = position.market?.id || position.marketId;
  return {
    ...outcome,
    balance: String(historyOutcomeAmountMicro(marketId, outcome, activityByOutcome))
  };
}

function historyOutcomeAmountMicro(marketId, outcome, activityByOutcome) {
  const side = outcome.outcome?.side || "YES";
  const balanceMicro = Number(outcome.balance || 0);
  if (balanceMicro > 0) return balanceMicro;
  return activityByOutcome.get(historyKey(marketId, side))?.sharesMicro || 0;
}

function outcomeActivity(portfolio) {
  const ordersById = new Map((portfolio.orders?.history || []).map(order => [order.id, order]));
  const activity = new Map();
  for (const fill of portfolio.fills || []) {
    const order = ordersById.get(fill.orderId);
    if (!order) continue;
    const key = historyKey(order.marketId, order.outcomeSide);
    const current = activity.get(key) || { sharesMicro: 0, costMicro: 0 };
    current.sharesMicro += Number(fill.takerAmountFilled || 0);
    current.costMicro += Number(fill.makerAmountFilled || 0);
    activity.set(key, current);
  }
  for (const order of portfolio.orders?.history || []) {
    const key = historyKey(order.marketId, order.outcomeSide);
    if (activity.has(key)) continue;
    const filled = order.status === "filled";
    activity.set(key, {
      sharesMicro: filled ? Number(order.order?.takerAmount || 0) : 0,
      costMicro: filled ? Number(order.order?.makerAmount || 0) : 0
    });
  }
  return activity;
}

function settledPnl(outcome, activity, winning, amountMicro, marketCostMicro = 0) {
  const direct = Number(outcome.unrealizedPnl);
  if (Number.isFinite(direct) && Number(outcome.balance || 0) > 0 && !marketCostMicro) return direct / 1000000;
  const costMicro = Number(outcome.costBasis || activity?.costMicro || 0);
  const totalCostMicro = marketCostMicro || costMicro;
  const currentMicro = winning ? amountMicro : 0;
  if (totalCostMicro > 0) return (currentMicro - totalCostMicro) / 1000000;
  return winning ? amountMicro / 1000000 : -(amountMicro / 1000000);
}

function historyOutcomeDetails(winning, amount, settlementAmount, claimed) {
  if (winning) {
    return `Winning outcome - payout ${settlementAmount.toFixed(2)} ${SYMBOL} - ${amount.toFixed(2)} shares${claimed ? " - claimed" : ""}`;
  }
  return `Losing outcome - lost ${settlementAmount.toFixed(2)} ${SYMBOL} - ${amount.toFixed(2)} shares`;
}

function marketActivityCost(marketId, activityByOutcome) {
  if (!marketId) return 0;
  return [...activityByOutcome.entries()]
    .filter(([key]) => key.startsWith(`${marketId}::`))
    .reduce((sum, [, activity]) => sum + Number(activity.costMicro || 0), 0);
}

function orderActivityRows(portfolio, marketTitles) {
  const fillsByOrder = new Map((portfolio.fills || []).map(fill => [fill.orderId, fill]));
  return (portfolio.orders?.history || []).map(order => {
    const fill = fillsByOrder.get(order.id);
    const filled = order.status === "filled";
    const amountMicro = filled
      ? Number(fill?.takerAmountFilled || order.order?.takerAmount || 0)
      : Math.max(0, Number(order.order?.makerAmount || 0) - Number(order.remainingMaker || 0));
    const amount = amountMicro / 1000000;
    const marketId = order.marketId;
    const title = order.market?.title || marketTitles.get(marketId) || humanMarketLabel(marketId) || "Market order";
    const status = filled ? "Filled order" : "Cancelled order";
    return {
      id: `activity-${order.id}`,
      kind: "activity",
      title,
      side: order.outcomeSide || order.side || "ORDER",
      price: 0,
      amount,
      pnl: 0,
      status,
      details: `${status} - ${amount.toFixed(2)} ${filled ? "shares" : SYMBOL}`,
      marketId
    };
  });
}

function marketTitleMap(portfolio) {
  return new Map((portfolio.positions || []).map(position => [
    position.market?.id || position.marketId,
    position.market?.title
  ]).filter(([id, title]) => id && title));
}

function historyKey(marketId, side) {
  return `${marketId || "market"}::${side || "YES"}`;
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
