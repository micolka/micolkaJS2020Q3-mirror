const keyConfig = {
  en: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
    "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
    "done", "space", "en / ru"
  ],
  enShifted: [
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'skip',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}',
    'skip', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'skip',
    'skip', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?',
    'skip', 'skip', 'skip'
  ],
  ru: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "skip",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "skip", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "skip",
    "skip", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
    "skip", "skip", "skip"
  ],
  ruShifted: [
    "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "skip",
    "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ",
    "skip", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "skip",
    "skip", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ",",
    "skip", "skip", "skip"
  ],
}
// TO DO fix bug with shift/lang mixing

class VirtualKeyboard {
  constructor(keyConfig) {
    this.value = '';
    this.engKeyConfig = keyConfig.en;
    this.keyConfig = keyConfig;
    this.cursorPosition = 0;
    this.isCaps = false;
    this.isShifted = false;
    this.language = 'en';
  }

  init() {
    this.textArea = document.querySelector('.use-keyboard-input');
    this.value = this.textArea.value;
    this.keyboard = this._buildKeyboard();
    this._setTextAreaBindings();
  }

  _buildKeyboard() {
    let keyboard = document.createElement('div');
    let keyboardKeys = document.createElement('div');

    keyboard.classList.add('keyboard');//, 'keyboard--hidden');
    keyboardKeys.classList.add('keyboard__keys');
    keyboardKeys.appendChild(this._createKeys());

    keyboard.appendChild(keyboardKeys);
    document.querySelector('body').append(keyboard);

    return keyboard;
  }

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const createIconHTML = (icon) => {
      return `<i class="material-icons">${icon}</i>`
    }

    for (let el in this.engKeyConfig) {
      let key = document.createElement('button');
      key.classList.add('keyboard__key');
      key.textContent = this.engKeyConfig[el];
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

        case `shift`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          key.textContent = 'Shift'

          key.addEventListener('click', () => {
            this._shiftKeys();
            this._toggleShift();
            key.classList.toggle('keyboard__key--active');
          });
          
          break;

        case `en / ru`:
          key.classList.add('keyboard__key--wide');
          key.textContent = 'EN / ru';

          key.addEventListener('click', () => {
            key.textContent === 'EN / ru' ? key.textContent = 'en / RU' : key.textContent = 'EN / ru';
            this._shiftLang();
            this._toggleLang();
          });
          
          break;

        case `caps`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          key.innerHTML = createIconHTML('keyboard_capslock');

          key.addEventListener('click', () => {
            document.querySelectorAll('.keyboard__key').forEach( el => {
              if (this.isCaps) {
                if (el.textContent.length === 1) el.textContent = el.textContent.toLowerCase();
              } else {
                if (el.textContent.length === 1) el.textContent = el.textContent.toUpperCase();
              }
            });
            this._toggleCaps();
            key.classList.toggle('keyboard__key--active');
          });

          break;

        case `done`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          key.innerHTML = createIconHTML('check_circle');

          key.addEventListener('click', () => {
            this.close();
          });

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

      if (key.textContent === 'backspace' || key.textContent === ']' 
            || key.textContent === 'keyboard_return' || key.textContent === '/') {
        fragment.appendChild(document.createElement('br'));
      }
    }

    return fragment;
  }

  _shiftKeys() {
    document.querySelectorAll('.keyboard__key').forEach( (el, i) => {
      let tmp = el.textContent
      if (this.language === 'en') {
        if ( this.keyConfig.enShifted[i] !== 'skip' ) {
          el.textContent = this.keyConfig.enShifted[i];
          this.keyConfig.enShifted[i] = tmp;
        }
      } else {
        if ( this.keyConfig.ruShifted[i] !== 'skip' ) {
          el.textContent = this.keyConfig.ruShifted[i];
          this.keyConfig.ruShifted[i] = tmp;
        }
      }
    })
  }

  _shiftLang() {
    document.querySelectorAll('.keyboard__key').forEach( (el, i) => {
      let tmp = el.textContent
      if (this.isShifted) {
        if ( this.keyConfig.ruShifted[i] !== 'skip' ) {
          el.textContent = this.keyConfig.ruShifted[i];
          this.keyConfig.ruShifted[i] = tmp;
        }
      } else {
        if ( this.keyConfig.ru[i] !== 'skip' ) {
          el.textContent = this.keyConfig.ru[i];
          this.keyConfig.ru[i] = tmp;
        }
      }
    })
  }

  _setTextAreaBindings() {
    this.textArea.addEventListener('focus', () => {
      a4Tech.open();
    })

    this.textArea.addEventListener('input', () => {
      this.value = this.textArea.value;
    })

    this.textArea.addEventListener('click', () => {
      this.cursorPosition = this.textArea.selectionStart;
    })
  }

  _textAreaReturnFocus() {
    this.textArea.selectionStart = this.cursorPosition;
    this.textArea.selectionEnd = this.cursorPosition;
    this.textArea.focus();
  }

  _toggleCaps() {
    this.isCaps ? this.isCaps = false : this.isCaps = true; 
  }  

  _toggleShift() {
    this.isShifted ? this.isShifted = false : this.isShifted = true; 
  }

  _toggleLang() {
    this.language === 'en' ? this.language = 'ru' : this.language = 'en';
  }

  addSymbol(symbol) {
    this.value = this.value.slice(0, this.cursorPosition) 
      + symbol + this.value.slice(this.cursorPosition);
    this.cursorPosition++;
    this.textArea.value = this.value;
    this._textAreaReturnFocus();
  }

  removeSymbol() {
    this.value = this.value.slice(0, this.cursorPosition - 1) 
      + this.value.slice(this.cursorPosition);
    this.cursorPosition--;
    this.textArea.value = this.value;
    this._textAreaReturnFocus();
  }

  open() {
    this.keyboard.classList.remove('keyboard--hidden');
  }

  close() {
    this.keyboard.classList.add('keyboard--hidden');
  }

}

const a4Tech = new VirtualKeyboard(keyConfig);

window.addEventListener('DOMContentLoaded', function() {
  a4Tech.init();
}) 