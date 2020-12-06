/* eslint-disable import/extensions */
import './src/scss/index.scss';
import { initBurgerMenu } from './src/components/burgerMenu';
import { transformCardsMode } from './src/components/card';
import { initSwitchButton, resetSwitchButton, setSwitcherAvailability } from './src/components/switchButton';
import state from './src/appState';
import { initStartGameButton, resetGameButton, showGameButton } from './src/components/gameButton';
import { createMainPageContent, openSelectedSet } from './src/components/main';
import { resetStarsQueue } from './src/components/stars';
import { initStatsData, saveStatsToLocalStorage } from './src/statsLogger';
import { resetGame } from './src/gameEngine';

state.audioInstance = new Audio();

window.onpopstate = () => {
  resetGame();
  saveStatsToLocalStorage();
  openSelectedSet();
  setSwitcherAvailability();
  resetGameButton();
  resetSwitchButton();
};

document.addEventListener('modeChanged', () => {
  transformCardsMode();
  showGameButton();
});

document.addEventListener('resetMainPage', () => {
  createMainPageContent();
  resetGameButton();
  resetSwitchButton();
  resetStarsQueue();
  window.location.href = '/#';
});

createMainPageContent();
initSwitchButton();
initStartGameButton();
initBurgerMenu();
initStatsData();
