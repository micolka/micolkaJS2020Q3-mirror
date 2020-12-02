/* eslint-disable import/extensions */
import './src/scss/index.scss';
import { initBurgerMenu } from './src/components/burgerMenu';
import { transformCardsMode } from './src/components/card';
import { initSwitchButton, resetSwitchButton, setSwitcherAvailability } from './src/components/switchButton';
import state from './src/appState';
import { initStartGameButton, resetGameButton, showGameButton } from './src/components/gameButton';
import { createMainPageContent, openSelectedSet } from './src/components/main';

state.audioInstance = new Audio();

window.onpopstate = () => {
  openSelectedSet();
  setSwitcherAvailability();
};

document.addEventListener('modeChanged', () => {
  transformCardsMode();
  showGameButton();
});

document.addEventListener('resetMainPage', () => {
  createMainPageContent();
  resetGameButton();
  resetSwitchButton();
});

createMainPageContent();
initSwitchButton();
initStartGameButton();
initBurgerMenu();
