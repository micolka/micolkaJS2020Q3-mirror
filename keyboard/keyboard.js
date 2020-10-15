const keyConfig = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
  "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
  "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
  "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
  "space"
];


class VirtualKeyboard {
  constructor(keyConfig) {
    this.value = '';
    this.keyConfig = keyConfig;
  }

  init(initialValue) {
    this.value = initialValue;
    this._buildKeyboard();
  }

  _buildKeyboard() {
    let keyboard = document.createElement('div');
    let keyboardKeys = document.createElement('div');

    keyboard.classList.add('keyboard');
    keyboardKeys.classList.add('keyboard__keys');
    keyboardKeys.appendChild(this._createKeys());

    keyboard.appendChild(keyboardKeys);
    document.querySelector('body').append(keyboard);
  }

  _createKeys() {
    const fragment = document.createDocumentFragment();

    for (let el in this.keyConfig) {
      let key = document.createElement('button');
      key.classList.add('keyboard__key');
      key.textContent = this.keyConfig[el];
      fragment.appendChild(key);
    }

    return fragment;

  }

}

const a4Tech = new VirtualKeyboard(keyConfig);

window.addEventListener('DOMContentLoaded', function() {
  a4Tech.init();
}) 