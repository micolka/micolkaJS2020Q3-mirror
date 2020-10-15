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

  init(textArea) {
    this.textArea = textArea;
    this.value = textArea.value;
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

    const createIconHTML = (icon) => {
      return `<i class="material-icons">${icon}</i>`
    }

    for (let el in this.keyConfig) {
      let key = document.createElement('button');
      key.classList.add('keyboard__key');
      key.textContent = this.keyConfig[el];
      key.type = 'button';

      switch (key.textContent) {

        case `backspace`:
          key.classList.add('keyboard__key--wide');
          key.innerHTML = createIconHTML('backspace');

          key.addEventListener('click', () => {
            this.removeSymbol();
          })
          break;

        case `space`:
          key.classList.add('keyboard__key--extra-wide');
          key.innerHTML = createIconHTML('space_bar');
          key.addEventListener('click', () => {
            this.addSymbol(' ');
          })  
          break;

        case `caps`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          key.innerHTML = createIconHTML('keyboard_capslock');
          break;

        case `done`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          key.innerHTML = createIconHTML('check_circle');
          break;  

        case `enter`:
          key.classList.add('keyboard__key--wide');
          key.innerHTML = createIconHTML('keyboard_return');

          key.addEventListener('click', () => {
            this.addSymbol('\n');
          })  
          break;

        default:
          key.addEventListener('click', () => {
            this.addSymbol(key.textContent);
          })  
      }
      fragment.appendChild(key);

      if (key.textContent === 'backspace' || key.textContent === 'p' 
            || key.textContent === 'enter' || key.textContent === '?') {
        fragment.appendChild(document.createElement('br'));
      }
    }

    return fragment;
  }

  addSymbol(symbol) {
    this.value += symbol;
    this.textArea.value = this.value;
  }

  removeSymbol() {
    this.value = this.value.slice(0, this.value.length - 1);
    this.textArea.value = this.value;
  }

}

const a4Tech = new VirtualKeyboard(keyConfig);
let textArea = document.querySelector('.use-keyboard-input');

window.addEventListener('DOMContentLoaded', function() {
  a4Tech.init(textArea);
}) 