import { escapeHtml, formatSigned, estimateCurrentPrice, estimatePnl } from './utils.js';
import { selectMarket, getTicketPnl } from './trading.js';
import { SYMBOL } from './constants.js';

const toast = createToast();

export function closePnlCard() {
  const pnlModal = document.querySelector("#pnl-modal");
  if (pnlModal) pnlModal.hidden = true;
  document.body.classList.remove("has-pnl-modal");
}

export function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function createToast() {
  const element = document.createElement("div");
  element.className = "toast";
  element.setAttribute("role", "status");
  document.body.appendChild(element);
  return element;
}

export function setActive(items, activeItem) {
  items.forEach(item => item.classList.toggle("is-active", item === activeItem));
}

export function showTrade() {
  setActive(document.querySelectorAll(".slip-tabs button"), document.querySelector(".slip-tabs button"));
  document.querySelector(".trade-view")?.classList.add("is-active");
  document.querySelector(".positions-view")?.classList.remove("is-active");
}

export function showPositions() {
  const tabs = document.querySelectorAll(".slip-tabs button");
  setActive(tabs, tabs[1]);
  document.querySelector(".trade-view")?.classList.remove("is-active");
  document.querySelector(".positions-view")?.classList.add("is-active");
}

export function setSideButton(side) {
  document.querySelectorAll(".side-toggle button").forEach(button => button.classList.toggle("is-active", button.textContent.trim() === side));
}

export function setConnectButtons(label, disabled) {
  document.querySelectorAll("[data-action='connect']").forEach(connectButton => {
    if (label) connectButton.textContent = label;
    connectButton.disabled = disabled;
  });
}

export function applyProfileImage(imageUrl) {
  document.querySelectorAll("[data-profile-avatar]").forEach(avatar => {
    avatar.replaceChildren();
    avatar.style.backgroundImage = `url("${imageUrl}")`;
  });
}

export function optionRow(title, label, yes, no, marketId, upSide = "YES", upLabel = "Yes", downSide = "NO", downLabel = "No", disabledReason = "") {
  const row = document.createElement("article");
  row.className = "option-row";
  const disabled = Boolean(disabledReason);
  if (disabled) row.classList.add("is-disabled");
  row.innerHTML = `
        <div><strong>${escapeHtml(title)}</strong><span>${escapeHtml(label)}</span></div>
    <button class="price up" type="button" data-market-id="${escapeHtml(marketId || "")}" data-outcome-side="${escapeHtml(upSide)}" data-disabled-reason="${escapeHtml(disabledReason)}" ${disabled ? "disabled aria-disabled=\"true\"" : ""}>${escapeHtml(upLabel)} ${Number(yes)}c</button>
    <button class="price down" type="button" data-market-id="${escapeHtml(marketId || "")}" data-outcome-side="${escapeHtml(downSide)}" data-disabled-reason="${escapeHtml(disabledReason)}" ${disabled ? "disabled aria-disabled=\"true\"" : ""}>${escapeHtml(downLabel)} ${Number(no)}c</button>
  `;
  row.querySelectorAll(".price").forEach(button => button.addEventListener("click", () => selectMarket(title, button, { disabled, disabledReason })));
  return row;
}

export function openPnlCard(ticket) {
  const pnlModal = document.querySelector("#pnl-modal");
  if (!ticket || !pnlModal) return;
  const pnl = ticket.pnl ?? 0;
  const currentPrice = typeof ticket.currentPrice === "number"
    ? ticket.currentPrice
    : estimateCurrentPrice(ticket.price, pnl, ticket.amount, ticket.side);
  const shares = ticket.price > 0 ? ticket.amount / (ticket.price / 100) : 0;
  const payout = shares;
  document.querySelector("#share-pnl-status").textContent = pnl >= 0 ? "Winning position" : "Position down";
  document.querySelector("#share-pnl-title").textContent = ticket.title;
  document.querySelector("#share-pnl-amount").textContent = `${formatSigned(pnl)} ${SYMBOL}`;
  document.querySelector("#share-pnl-stake").textContent = `${ticket.amount.toFixed(0)} ${SYMBOL}`;
}

export function ticketRow(ticket, index) {
  const pnl = getTicketPnl(ticket, index);
  return `
    <button class="ticket-card" type="button" data-pnl-ticket="${index}">
      <div>
        <span class="ticket-side ${escapeHtml(ticket.side.toLowerCase())}">${escapeHtml(ticket.side)}</span>
        <strong>${escapeHtml(ticket.title)}</strong>
        <small>${ticket.price}c entry - ${ticket.amount.toFixed(0)} ${SYMBOL}</small>
      </div>
      <b class="${pnl >= 0 ? "is-profit" : "is-loss"}">${formatSigned(pnl)}</b>
    </button>
  `;
}

export function historyRow(item, index) {
  const details = item.details || `${item.status} - ${item.price}c entry - ${item.amount.toFixed(0)} ${SYMBOL}`;
  const settlementAmount = typeof item.settlementAmount === "number"
    ? `<span class="history-row__settlement">${escapeHtml(item.settlementLabel || "Amount")} ${item.settlementAmount.toFixed(2)} ${SYMBOL}</span>`
    : "";
  return `
    <button class="ticket-card history-row" type="button" data-history-pnl="${index}">
      <div>
        <span class="ticket-side ${escapeHtml(item.side.toLowerCase())}">${escapeHtml(item.side)}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(details)}</small>
      </div>
      <span class="history-row__actions">
        ${settlementAmount}
        <b class="${item.pnl >= 0 ? "is-profit" : "is-loss"}">${formatSigned(item.pnl)} ${SYMBOL}</b>
        ${item.redeemable && item.marketId ? `<span class="claim-button" role="button" tabindex="0" data-claim-market="${escapeHtml(item.marketId)}">Claim winnings</span>` : ''}
      </span>
    </button>
  `;
}
