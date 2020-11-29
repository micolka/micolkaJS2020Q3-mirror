/* eslint-disable import/extensions */
import state from '../appState';

function initSwitchButton() {
  const switchButton = document.querySelector('.switch-btn');
  const event = new Event('modeChanged', { bubbles: true });

  switchButton.addEventListener('click', () => {
    switchButton.classList.toggle('switch-on');
    state.isTrainModeOn = !state.isTrainModeOn;
    switchButton.dispatchEvent(event);
  });
}

export default initSwitchButton;
