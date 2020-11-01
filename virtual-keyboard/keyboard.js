import {keyConfig} from './config.js'

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
    this.panel = this._buildOptionsPanel();
    this._initVoiceRecognition();
    this.keyboardKeys = document.querySelectorAll('.keyboard__key');
  }

  _buildKeyboard() {
    let keyboard = document.createElement('div');
    let keyboardKeys = document.createElement('div');

    keyboard.classList.add('keyboard', 'keyboard--hidden');
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
      key.setAttribute('data-key-code', keyConfig.keyCodes[el]);
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
            this.addString(' ');
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
            this.addString('\n');
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
            this.addString(key.textContent);
            (this.language === 'en') ? this._playSound('any_key') : this._playSound('any_key_ru');
          })  
      }
      fragment.appendChild(key);

      if (key.textContent === 'backspace' || key.textContent === ']' 
            || key.textContent === "'" || key.textContent === '/') {
        fragment.appendChild(document.createElement('br'));
      }
    }

    return fragment;
  }

  _buildOptionsPanel() {
    let panel = document.createElement('div');
    panel.classList.add('options_panel', 'options_panel-hidden');

    const createIconHTML = (icon) => {
      return `<i class="material-icons">${icon}</i>`
    }

    let soundKey = document.createElement('button');
    soundKey.classList.add('options__key-sound');
    soundKey.innerHTML = createIconHTML('volume_up');
    soundKey.addEventListener('click', () => {
      this._toggleSound();
      this._playSound('onoff');
      soundKey.innerHTML = this.isSoundOn ? createIconHTML('volume_up') : createIconHTML('volume_off');
      this._textAreaReturnFocus();
    })  
    panel.appendChild(soundKey);

    let recordKey = document.createElement('button');
    recordKey.classList.add('options__key-microphone');
    recordKey.innerHTML = createIconHTML('mic_off');
    recordKey.addEventListener('click', () => {
      this._toggleVoiceInput();
      this._playSound('onoff');
      recordKey.innerHTML = this.isVoiceInputOn ? createIconHTML('mic') : createIconHTML('mic_off');
      recordKey.classList.toggle('options__key-active');
      this._recognizeVoiceInput();
      this._textAreaReturnFocus();
    })  
    panel.appendChild(recordKey);

    document.querySelector('body').append(panel);

    return panel;
  }
  
  _toggleVoiceInput() {
    this.isVoiceInputOn = !this.isVoiceInputOn;
  }

  _initVoiceRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.tmpResult = '';

    this.recognition.addEventListener('result', e => {
      let transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      console.log(transcript);
      if (e.results[0].isFinal) {
        this.addString(transcript);
      }
    });    

    this.recognition.addEventListener('end', () => {
      if (this.isVoiceInputOn) {
        this.recognition.start();
      }
    });
  }

  _recognizeVoiceInput() {
    if (this.isVoiceInputOn) {
      this.recognition.lang = this.language === 'en' ? 'en-US' : 'ru-RU';
      this.recognition.start();
    } else {
      this.recognition.stop();
    }
  }

  _toggleSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  _playSound(filename) {
    if (this.isSoundOn) {
      let audio = new Audio();
      audio.preload = 'auto';
      audio.src = `assets/sound/${filename}.mp3`;
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
      if (el.textContent.length === 1) {
        el.textContent = this._convertCase(el);
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
    });

    this.textArea.addEventListener('input', () => {
      this.value = this.textArea.value;
      this.cursorPosition = this.textArea.selectionStart;
    });

    this.textArea.addEventListener('click', () => {
      this.cursorPosition = this.textArea.selectionStart;
    });

    this.textArea.addEventListener('keydown', (event) => {
      this.keyboardKeys.forEach( (el) => {
        if (+event.keyCode === +el.dataset.keyCode) {

          switch (+el.dataset.keyCode) {
            case 20: 
             if (event.repeat === false) {
                this._toggleCaps();
                document.querySelectorAll('.keyboard__key').forEach( (key) => {
                  if (key.textContent.length === 1) {
                    key.textContent = this._convertCase(key);
                  } 
                });
                el.classList.toggle('keyboard__key--active');
                el.classList.toggle('keyboard__key_pressed');
              }
              break;
              
            case 16:
              if (event.repeat === false) {
                this._toggleShift();
                this._shiftKeys();
                el.classList.toggle('keyboard__key--active');
                el.classList.toggle('keyboard__key_pressed');
              }
              break;
            default:
              el.classList.toggle('keyboard__key_pressed');
          }
        }
      });
    });

    this.textArea.addEventListener('keyup', (event) => {
      this.keyboardKeys.forEach( (el) => {
        if (+event.keyCode === +el.dataset.keyCode) {
          el.classList.toggle('keyboard__key_pressed');
          if (+el.dataset.keyCode === 16) {
            this._toggleShift();
            this._shiftKeys();
            el.classList.toggle('keyboard__key--active');
          }
        }  
      });
    });

  }

  _textAreaReturnFocus() {
    this.textArea.selectionStart = this.cursorPosition;
    this.textArea.selectionEnd = this.cursorPosition;
    this.textArea.focus();
  }

  _convertCase(el) {
      if ( (this.isCaps && this.isShifted) || (!this.isCaps && !this.isShifted)) {
        return el.textContent.toLowerCase();
      }
      if ( (!this.isCaps && this.isShifted) || (this.isCaps && !this.isShifted)) {
        return el.textContent.toUpperCase();
      }
  }

  _toggleCaps() {
    this.isCaps = !this.isCaps;
  }  

  _toggleShift() {
    this.isShifted = !this.isShifted;
  }

  _toggleLang() {
    this.language === 'en' ? this.language = 'ru' : this.language = 'en';
  }

  addString(text) {
    this.value = this.value.slice(0, this.cursorPosition) 
      + text + this.value.slice(this.cursorPosition);
    this.cursorPosition += text.length;
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
      this.panel.classList.remove('options_panel-hidden');
      this._playSound('show');
    }
  }

  close() {
    this.keyboard.classList.add('keyboard--hidden');
    this.panel.classList.add('options_panel-hidden');
    this._playSound('hide');
  }
}

const a4Tech = new VirtualKeyboard(keyConfig);

window.addEventListener('DOMContentLoaded', function() {
  a4Tech.init();
}) 