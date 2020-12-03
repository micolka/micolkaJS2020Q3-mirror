/* eslint-disable import/extensions */
import state from '../appState';
import { getHash, playSound } from '../utils';

export function getSwitchButton():HTMLElement {
  return document.querySelector('.switch-btn');
}

export function setSwitcherAvailability() {
  if (getHash() === '' || getHash() === 'stats') {
    getSwitchButton().classList.add('invisible');
  } else {
    getSwitchButton().classList.remove('invisible');
  }
}

export function initSwitchButton() {
  const switchButton:HTMLElement = getSwitchButton();
  const event = new Event('modeChanged', { bubbles: true });

  switchButton.addEventListener('click', () => {
    switchButton.classList.toggle('switch-on');
    playSound('audio/_switch.mp3', state.audioInstance);
    state.isTrainModeOn = !state.isTrainModeOn;
    switchButton.dispatchEvent(event);
  });

  setSwitcherAvailability();
}

export function resetSwitchButton() {
  const switchButton:HTMLElement = getSwitchButton();
  switchButton.classList.remove('switch-on');
}
