function initSwitchButton() {
  const switchButton = document.querySelector('.switch-btn');

  switchButton.addEventListener('click', () => {
    switchButton.classList.toggle('switch-on');
  });
}

export default initSwitchButton;
