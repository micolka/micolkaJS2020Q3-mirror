/* eslint-disable import/extensions */
import state from '../appState';
import { playSound } from '../utils';

export function initSwitchButton() {
  const switchButton:HTMLElement = document.querySelector('.switch-btn');
  const event = new Event('modeChanged', { bubbles: true });

  switchButton.addEventListener('click', () => {
    switchButton.classList.toggle('switch-on');
    playSound('audio/_switch.mp3', state.audioInstance);
    state.isTrainModeOn = !state.isTrainModeOn;
    switchButton.dispatchEvent(event);
  });
}

export function resetSwitchButton() {
  const switchButton:HTMLElement = document.querySelector('.switch-btn');
  switchButton.classList.remove('switch-on');
}
