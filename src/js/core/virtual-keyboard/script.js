import layouts from './layouts/index.js';

const Keyboard = {
  elements: {
    main: null,
    keyContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: '',
    capsLock: false,
    capsText: false,
    shift: false,
    voice: false,
    volume: true,
    lang: 'en',
    keyboardInput: null
  },

  layouts: layouts,

  printCodes: [
    ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
    ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
    ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash'],
    ['Voice', 'Volume', 'Lang', 'Space', 'ArrowLeft', 'ArrowRight', 'Done']
  ],

  init() {
    this.elements.main = document.createElement('div');
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');

    this.elements.keyContainer = document.createElement('div');
    this.elements.keyContainer.classList.add('keyboard__keys');
    this.elements.keyContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keyContainer);
    document.body.appendChild(this.elements.main);

    document.querySelectorAll('.use-keyboard-input').forEach(element => {

      // Capslock checking with a physical keyboard
      element.addEventListener('click', (e) => {
        this.properties.keyboardInput = element;
        // this.properties.capsLock = !e.getModifierState('CapsLock');
        // this._toggleCapsLock();
        // document.querySelector('.caps').classList.toggle('keyboard__key--active', this.properties.capsLock)
      });

      element.addEventListener('click', (e) => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
          element.dispatchEvent(new Event('input'));
          this.properties.keyboardInput.focus();
        });

        // Blinking cursor
        this.elements.main.onmousedown = function (e) {
          if (document.activeElement === element) {
            e.preventDefault();
          }
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      const btnKey = document.querySelector(`[data-code=${e.code}]`);
      if (btnKey) {
        btnKey.click();
        btnKey.classList.add('keyboard__key--press');

        setTimeout(function () {
          btnKey.classList.remove('keyboard__key--press');
        }, 100);
      }
    });

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;

    this.recognition.addEventListener('result', e => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩') + ' ';

      if (e.results[0].isFinal) {
        let { startCursor, endCursor } = this._getCursor();
        const textBeforeCursor = this.properties.value.substring(0, startCursor);
        const textAfterCursor = this.properties.value.substring(endCursor, this.properties.value.length);
        this.properties.value = textBeforeCursor + poopScript + textAfterCursor;
        this._triggerEvent('oninput');
        this._setCursorPosition(endCursor + poopScript.length);
      }
    });
  },

  _getCursor() {
    const startCursor = this.properties.keyboardInput.selectionStart;
    const endCursor = this.properties.keyboardInput.selectionEnd;
    return { startCursor, endCursor };
  },

  _setCursorPosition(cursor) {
    if (cursor < 0) cursor = 0;
    this.properties.keyboardInput.setSelectionRange(cursor, cursor);
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    const createIconHTML = (iconName) => {
      return `<i class='material-icons'>${iconName}</i>`;
    };

    this.printCodes.forEach(line => {
      line.forEach(key => {
        const keyElement = document.createElement('button');

        keyElement.setAttribute('type', 'button');
        keyElement.classList.add('keyboard__key');

        keyElement.dataset.code = key;

        switch (key) {
          case 'Lang':
            keyElement.textContent = this.layouts[this.properties.lang][key].default;

            keyElement.addEventListener('click', () => {
              this._toggleLang();
              keyElement.textContent = this.layouts[this.properties.lang][key].default;
            });

            break;

          case 'Voice':
            keyElement.classList.add('keyboard__key--activatable');
            keyElement.innerHTML = createIconHTML('keyboard_voice');

            keyElement.addEventListener('click', () => {
              this.properties.voice = !this.properties.voice;
              this._playSound('voice');
              keyElement.classList.toggle('keyboard__key--active', this.properties.voice);

              this.recognition.lang = this.properties.lang === 'en' ? 'en-US' : 'ru';

              if (this.properties.voice) {
                this.recognition.addEventListener('end', this.recognition.start);
                this.recognition.start();
              } else {
                this.recognition.removeEventListener('end', this.recognition.start);
                this.recognition.stop();
              }

            });

            break;

          case 'Volume':
            keyElement.classList.add('keyboard__key--activatable');
            keyElement.innerHTML = createIconHTML('volume_up');
            keyElement.classList.toggle('keyboard__key--active', this.properties.volume);

            keyElement.addEventListener('click', () => {
              this.properties.volume = !this.properties.volume;
              this._playSound('volume');
              keyElement.classList.toggle('keyboard__key--active', this.properties.volume);
            });

            break;

          case 'ArrowLeft':
            keyElement.innerHTML = createIconHTML('keyboard_arrow_left');

            keyElement.addEventListener('click', () => {
              this._playSound('enter');

              let currenCursor = this.properties.keyboardInput.selectionStart;
              this._setCursorPosition(currenCursor - 1);
            });

            break;

          case 'ArrowRight':
            keyElement.innerHTML = createIconHTML('keyboard_arrow_right');

            keyElement.addEventListener('click', () => {
              this._playSound('enter');

              let currenCursor = this.properties.keyboardInput.selectionStart;
              this._setCursorPosition(currenCursor + 1);
            });

            break;

          case 'Backspace':
            keyElement.classList.add('keyboard__key--wide');
            keyElement.innerHTML = createIconHTML('backspace');

            keyElement.addEventListener('click', () => {
              let { startCursor, endCursor } = this._getCursor();
              if (startCursor === endCursor) startCursor -= 1;
              const textBeforeCursor = this.properties.value.substring(0, startCursor);
              const textAfterCursor = this.properties.value.substring(endCursor, this.properties.value.length);
              this.properties.value = textBeforeCursor + textAfterCursor;

              this._playSound('backspace');
              this._triggerEvent('oninput');

              this._setCursorPosition(startCursor);
            });

            break;

          case 'CapsLock':
            keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'caps');
            keyElement.innerHTML = createIconHTML('keyboard_capslock');

            keyElement.addEventListener('click', () => {
              this._toggleCapsLock();
              this._playSound('caps');
              keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
            });

            break;

          case 'ShiftLeft':
            keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
            keyElement.textContent = 'Shift';
            keyElement.classList.toggle('keyboard__key--active', this.properties.shift);

            keyElement.addEventListener('click', () => {
              this._toggleShift();
              this._playSound('shift');
              keyElement.classList.toggle('keyboard__key--active', this.properties.shift);
            });

            break;

          case 'Enter':
            keyElement.classList.add('keyboard__key--wide');
            keyElement.innerHTML = createIconHTML('keyboard_return');

            keyElement.addEventListener('click', () => {
              let { startCursor, endCursor } = this._getCursor();
              const textBeforeCursor = this.properties.value.substring(0, startCursor);
              const textAfterCursor = this.properties.value.substring(endCursor, this.properties.value.length);
              this.properties.value = textBeforeCursor + '\n' + textAfterCursor;

              this._playSound('enter');
              this._triggerEvent('oninput');

              this._setCursorPosition(startCursor + 1);
            });

            break;

          case 'Space':
            keyElement.classList.add('keyboard__key--extra-wide');
            keyElement.innerHTML = createIconHTML('space_bar');

            keyElement.addEventListener('click', () => {
              let { startCursor, endCursor } = this._getCursor();
              const textBeforeCursor = this.properties.value.substring(0, startCursor);
              const textAfterCursor = this.properties.value.substring(endCursor, this.properties.value.length);
              this.properties.value = textBeforeCursor + ' ' + textAfterCursor;

              this._playSound('space');
              this._triggerEvent('oninput');

              this._setCursorPosition(startCursor + 1);
            });

            break;

          case 'Done':
            keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
            keyElement.innerHTML = createIconHTML('keyboard_hide');

            keyElement.addEventListener('click', () => {
              this.close();
              this._triggerEvent('onclose');
            });

            break;

          default:
            const lang = this.properties.lang;
            keyElement.textContent = this.properties.shift ? this.layouts[lang][key].shift : this.layouts[lang][key].default;
            keyElement.classList.add('keyboard__key--caps');

            keyElement.addEventListener('click', () => {
              let { startCursor, endCursor } = this._getCursor();
              const textBeforeCursor = this.properties.value.substring(0, startCursor);
              const textAfterCursor = this.properties.value.substring(endCursor, this.properties.value.length);
              this.properties.value = textBeforeCursor + keyElement.textContent + textAfterCursor;

              this._playSound('key');
              this._triggerEvent('oninput');

              this._setCursorPosition(startCursor + 1);
            });

            break;
        }

        fragment.appendChild(keyElement);
      })

      fragment.appendChild(document.createElement('br'));
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this._toggleKeyboard();
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;
    this._toggleKeyboard();
  },

  _toggleLang() {
    this.properties.lang = this.properties.lang === 'ru' ? 'en' : 'ru';
    if (this.properties.voice) {
      this.recognition.removeEventListener('end', this.recognition.start);
      this.recognition.stop();
      this.recognition.lang = this.properties.lang === 'en' ? 'en-US' : 'ru';
      this.recognition.addEventListener('end', this.recognition.start);
      //this.recognition.start();
    }
    this._playSound(this.properties.lang);
    this._toggleKeyboard();
  },

  _toggleKeyboard() {
    for (const key of this.elements.keys) {
      if (key.classList.contains('keyboard__key--caps')) {
        const lang = this.properties.lang;
        const keyCode = key.dataset.code;
        key.textContent = this.properties.shift ? this.layouts[lang][keyCode].shift : this.layouts[lang][keyCode].default;
        this.properties.capsText = (!this.properties.capsLock && this.properties.shift || this.properties.capsLock && !this.properties.shift) || false;
        key.textContent = this.properties.capsText ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _playSound(keyCode) {
    if (!this.properties.volume) return;

    if (keyCode === 'key') keyCode = this.properties.lang;

    const audio = new Audio(`../assets/audio/btn_${keyCode}.wav`);
    audio.currentTime = 0;
    audio.play();
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
    this.properties.keyboardInput.blur();
  }

};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init();
});
