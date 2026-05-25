import { showToast } from './ui.js?v=55';
import { renderGameTiles, syncSportHero, initializeImageFallbacks, openMatchPage, showHome } from './rendering.js?v=55';
import { updateQuote, renderTickets, wireConfirmTrade } from './trading.js?v=55';
import { hydrateFromBackend } from './api.js?v=55';
import { state } from './state.js?v=55';
import { wireConnectButtons, wireProfileMenu, initializeProfileImage, restoreWalletSession } from './wallet.js?v=55';
import { wireNavigation, wireTopSportNav, syncTopSportNav, wireBoardTabs, wireDashboardTools, wireFooterLinks, wireSlipTabs, wireSideToggle, wireOutsideClose, wirePnlModal } from './navigation.js?v=55';
import { wirePortfolioDashboard } from './portfolio.js?v=55';

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
    syncTopSportNav();
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
