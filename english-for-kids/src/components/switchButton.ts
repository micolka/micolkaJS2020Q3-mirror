/* eslint-disable import/extensions */
import state from '../appState';
import { playSound } from '../utils';

function initSwitchButton(audio:HTMLAudioElement) {
  const switchButton:HTMLElement = document.querySelector('.switch-btn');
  const event = new Event('modeChanged', { bubbles: true });

  switchButton.addEventListener('click', () => {
    switchButton.classList.toggle('switch-on');
    playSound('audio/_switch.mp3', audio);
    state.isTrainModeOn = !state.isTrainModeOn;
    switchButton.dispatchEvent(event);
  });
}

export default initSwitchButton;
