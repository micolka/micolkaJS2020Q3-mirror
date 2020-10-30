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
    'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', '{', '}',
    'skip', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', ':', '"', 'skip',
    'skip', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', '<', '>', '?',
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
    "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr",
    "skip", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "skip",
    "skip", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", ",",
    "skip", "skip", "skip"
  ],
}

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
    this.keyboardKeys = document.querySelectorAll('.keyboard__key');
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
          this.engKeyConfig[el] = 'skip';

          key.addEventListener('click', () => {
            this.removeSymbol();
          })       

          break;

        case `space`:
          key.classList.add('keyboard__key--extra-wide');
          key.innerHTML = createIconHTML('space_bar');
          this.engKeyConfig[el] = 'skip';

          key.addEventListener('click', () => {
            this.addSymbol(' ');
          })

          break;

        case `shift`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          key.textContent = 'Shift'
          this.engKeyConfig[el] = 'skip';

          key.addEventListener('click', () => {
            this._toggleShift();
            this._shiftKeys();
            key.classList.toggle('keyboard__key--active');
          });
          
          break;

        case `en / ru`:
          key.classList.add('keyboard__key--wide');
          key.textContent = 'EN / ru';
          this.engKeyConfig[el] = 'skip';

          key.addEventListener('click', () => {
            key.textContent === 'EN / ru' ? key.textContent = 'en / RU' : key.textContent = 'EN / ru';
            this._toggleLang();
            this._changeLang();
          });
          
          break;

        case `caps`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          key.innerHTML = createIconHTML('keyboard_capslock');
          this.engKeyConfig[el] = 'skip';

          key.addEventListener('click', () => {
            this._toggleCaps();
            document.querySelectorAll('.keyboard__key').forEach( (el, i) => {
              if (el.textContent.length === 1) {
                el.textContent = this._convertCase(el);
              } 
            });
            
            key.classList.toggle('keyboard__key--active');
          });

          break;

        case `done`:
          key.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          key.innerHTML = createIconHTML('check_circle');
          this.engKeyConfig[el] = 'skip';

          key.addEventListener('click', () => {
            this.close();
          });

          break;  

        case `enter`:
          key.classList.add('keyboard__key--wide');
          key.innerHTML = createIconHTML('keyboard_return');
          this.engKeyConfig[el] = 'skip';

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
    this.keyboardKeys.forEach( (el, i) => { 
      if (this.language === 'en') {
        this.isShifted === false 
              ? this._swingKeys(el, this.engKeyConfig[i]) 
              : this._swingKeys(el, this.keyConfig.enShifted[i]);
      } else { 
        this.isShifted === false 
              ? this._swingKeys(el, this.keyConfig.ru[i]) 
              : this._swingKeys(el, this.keyConfig.ruShifted[i]);
      }
    })
  }

  _changeLang() {
    this.keyboardKeys.forEach( (el, i) => { 
      if (this.language === 'ru') {
        this._swingKeys(el, this.keyConfig.ru[i]);
      } else {
        this._swingKeys(el, this.engKeyConfig[i]); 
      }
    })
    if (this.isShifted) {   
      this._shiftKeys();
    }
  }

  _swingKeys(el, key) {
    if ( key !== 'skip' ) {
      if ( key === 'ltr' ) {
        el.textContent = this._convertCase(el);
      } else {
        el.textContent = key;
      }
    }
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

  _convertCase(el) {
    if ( (this.isCaps && this.isShifted) || (!this.isCaps && !this.isShifted)) return el.textContent.toLowerCase();
    if ( (!this.isCaps && this.isShifted) || (this.isCaps && !this.isShifted)) return el.textContent.toUpperCase();
  }

  _toggleCaps() {
    this.isCaps ? this.isCaps = false : this.isCaps = true; 
    console.log('isCaps:' + this.isCaps);
  }  

  _toggleShift() {
    this.isShifted ? this.isShifted = false : this.isShifted = true;
    console.log('isShifted:' + this.isShifted);
  }

  _toggleLang() {
    this.language === 'en' ? this.language = 'ru' : this.language = 'en';
    console.log(this.language);
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