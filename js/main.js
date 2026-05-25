import { showToast } from './ui.js';
import { renderGameTiles, syncSportHero, initializeImageFallbacks, openMatchPage, showHome } from './rendering.js';
import { updateQuote, renderTickets, wireConfirmTrade } from './trading.js';
import { hydrateFromBackend } from './api.js';
import { state } from './state.js';
import { wireConnectButtons, wireProfileMenu, initializeProfileImage, restoreWalletSession } from './wallet.js';
import { wireNavigation, wireTopSportNav, wireBoardTabs, wireDashboardTools, wireFooterLinks, wireSlipTabs, wireSideToggle, wireOutsideClose, wirePnlModal } from './navigation.js';
import { wirePortfolioDashboard } from './portfolio.js';

const errorScreen = document.getElementById("error-screen");

function clearSkeletons() {
  document.querySelectorAll(".skeleton-card").forEach(el => el.remove());
}

function showError() {
  clearSkeletons();
  if (errorScreen) errorScreen.hidden = false;
}

async function bootApp() {
  wireNavigation();
  wireTopSportNav();
  wireBoardTabs();
  wireDashboardTools();
  wireFooterLinks();
  wireProfileMenu();
  wireOutsideClose();
  wireSlipTabs();
  wireSideToggle();
  wireConnectButtons();
  wireConfirmTrade();
  wirePnlModal();
  wirePortfolioDashboard();
  initializeProfileImage();
  initializeImageFallbacks();

  const loaded = await hydrateFromBackend();
  if (loaded) {
    await restoreWalletSession();
    renderGameTiles();
    updateQuote();
    renderTickets();
    syncSportHero();
    if (errorScreen) errorScreen.hidden = true;

  } else {
    showError();
  }
}

window.XCupMarkets = { openMatchPage, showHome };

bootApp();
