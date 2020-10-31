const keyConfig = {
  en: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
    "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
    "done", "space", "en / ru", "left", "right"
  ],
  enShifted: [
    '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'skip',
    'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', '{', '}',
    'skip', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', ':', '"', 'skip',
    'skip', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', 'ltr', '<', '>', '?',
    'skip', 'skip', 'skip', 'skip', 'skip'
  ],
  ru: [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "skip",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "skip", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "skip",
    "skip", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
    "skip", "skip", "skip", 'skip', 'skip'
  ],
  ruShifted: [
    "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "skip",
    "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr",
    "skip", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "skip",
    "skip", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", "ltr", ",",
    "skip", "skip", "skip", 'skip', 'skip'
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
    this.isSoundOn = true;
    this.isVoiceInputOn = false;
  }

  init() {
    this.textArea = document.querySelector('.use-keyboard-input');
    this.value = this.textArea.value;
    this.keyboard = this._buildKeyboard();
    this._setTextAreaBindings();
    this._buildOptionsPanel();
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
            this._playSound('backspace');
          })       

          break;

        case `space`:
          key.classList.add('keyboard__key--extra-wide');
          key.innerHTML = createIconHTML('space_bar');
          this.engKeyConfig[el] = 'skip';

          key.addEventListener('click', () => {
            this.addSymbol(' ');
            this._playSound('space_bar');
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
            this._playSound('shift');
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
            this._playSound('lang');
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
            this._playSound('caps');
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
            this._playSound('return');
          })  

          break;

          case `left`:
            key.classList.add('keyboard__key');
            key.innerHTML = createIconHTML('keyboard_arrow_left');
            this.engKeyConfig[el] = 'skip';
  
            key.addEventListener('click', () => {          
              this.cursorPosition !== 0 ? this.cursorPosition-- : this.cursorPosition = 0;
              this._textAreaReturnFocus();
              this._playSound('caps');
            })  
  
            break;          
            
          case `right`:
            key.classList.add('keyboard__key');
            key.innerHTML = createIconHTML('keyboard_arrow_right');
            this.engKeyConfig[el] = 'skip';
  
            key.addEventListener('click', () => {
              this.cursorPosition !== this.value.length ? this.cursorPosition++ : this.cursorPosition = this.value.length;
              this._textAreaReturnFocus();
              this._playSound('caps');
            })  
  
            break;

        default:
          key.addEventListener('click', () => {
            this.addSymbol(key.textContent);
            (this.language === 'en') ? this._playSound('any_key') : this._playSound('any_key_ru');
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

  _buildOptionsPanel() {
    let panel = document.createElement('div');
    panel.classList.add('options_panel');

    const createIconHTML = (icon) => {
      return `<i class="material-icons">${icon}</i>`
    }

    let soundKey = document.createElement('button');
    soundKey.classList.add('options__key', 'sound');
    soundKey.innerHTML = createIconHTML('volume_up');
    soundKey.addEventListener('click', () => {
      this._toggleSound();
      this._playSound('onoff');
      if (this.isSoundOn) {
        soundKey.innerHTML = createIconHTML('volume_up');
      } else {
        soundKey.innerHTML = createIconHTML('volume_off');
      }

    })  
    panel.appendChild(soundKey);

    let recordKey = document.createElement('button');
    recordKey.classList.add('options__key', 'microphone');
    recordKey.innerHTML = createIconHTML('mic');
    recordKey.addEventListener('click', () => {
      this._toggleVoiceInput();
      this._playSound('onoff');
    })  
    panel.appendChild(recordKey);

    document.querySelector('body').append(panel);
  }

  _toggleSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  _toggleVoiceInput() {
    this.isVoiceInputOn = !this.isVoiceInputOn;
  }

  _playSound(filename) {
    if (this.isSoundOn) {
      let audio = new Audio();
      audio.preload = 'auto';
      audio.src = `keyboard/assets/sound/${filename}.mp3`;
      audio.play();
    }
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
      this._convertCase(el);
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

    this.textArea.addEventListener('input', (e) => {
      console.log(e);
      this.value = this.textArea.value;
      this.cursorPosition = this.textArea.selectionStart;
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
    if (this.keyboard.classList.contains('keyboard--hidden')) {
      this.keyboard.classList.remove('keyboard--hidden');
      this._playSound('show');
    }
  }

  close() {
    this.keyboard.classList.add('keyboard--hidden');
    this._playSound('hide');
  }
}

const a4Tech = new VirtualKeyboard(keyConfig);

window.addEventListener('DOMContentLoaded', function() {
  a4Tech.init();
}) 