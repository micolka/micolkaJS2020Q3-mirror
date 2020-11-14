// TODO: нормальный рандом

import {
  getFormattedTimerData, createIconHTML, genUrlNumber, playSound,
} from './utils.js';
import { createButton, createAnyElement, toggleDisabledProp } from './dom.js';
import imagesText from './images.js';

class GemPuzzle {
  constructor() {
    this.tileSize = 75;
    this.tileGap = 1;
    this.fieldSize = 4;
    this.xOffset = 0;
    this.yOffset = 0;
    this.turnsCount = 0;
    this.initTimeValue = 0;
    this.duration = 0;
    this.isSoundOn = false;
    this.scores = [];
    this.stackOfSteps = [];
    this.isButtonsDisabled = false;
    this.pictureNumber = genUrlNumber();
  }

  init() {
    this.body = document.querySelector('body');
    this.calculateTileSize();
    this.scores = JSON.parse(localStorage.getItem('scores'));
    this.wrapper = createAnyElement('div', 'wrapper', '');
    this.body.appendChild(this.wrapper);
    this.field = this.createTileFiled();
    this.stats = this.createStatsPanel();
    this.turnsCounter = document.querySelector('.turns-counter');
    this.gameTimer = document.querySelector('.game_timer');
    this.newGame();
  }

  // Main param depends of window size
  calculateTileSize() {
    const windowSize = this.body.getBoundingClientRect().width;
    if (windowSize <= 610) {
      this.tileSize = 300 / this.fieldSize;
    } else if (windowSize > 1500) {
      this.tileSize = 744 / this.fieldSize;
    } else {
      this.tileSize = (windowSize / 2 - (this.tileGap * this.fieldSize + 1)) / this.fieldSize;
    }
  }

  // Create field of tiles
  createTileFiled() {
    const {
      tileSize, tileGap, fieldSize,
    } = this;

    const field = createAnyElement('div', 'field', '');
    field.style.width = `${(tileGap + tileSize) * fieldSize + tileGap}px`;
    field.style.height = field.style.width;
    if (this.field) {
      this.wrapper.replaceChild(field, this.field);
    } else {
      this.wrapper.appendChild(field);
    }

    this.xOffset = field.offsetLeft;
    this.yOffset = field.offsetTop;

    let j = -1;
    for (let i = 0; i < fieldSize ** 2; i += 1) {
      // Create tile and place it on the field
      const tile = createAnyElement('div', 'tile', '');
      tile.style.width = `${tileSize}px`;
      tile.style.height = `${tileSize}px`;
      tile.style.left = `${this.xOffset + tileGap + (i % fieldSize) * (tileSize + tileGap)}px`;
      if (i % fieldSize === 0) j += 1;
      tile.style.top = `${this.yOffset + tileGap + j * (tileSize + tileGap)}px`;
      tile.id = i;
      if (i < fieldSize ** 2 - 1) {
        tile.innerText = `${i + 1}`;
      } else {
        tile.classList.add('empty');
      }
      this.setBackGround(tile, i, j, this.pictureNumber);
      tile.addEventListener('mousedown', (event) => {
        this.grabTile(event);
      });
      tile.ondragstart = () => false;

      field.appendChild(tile);
    }
    return field;
  }

  // Create panels for diff info and buttons
  createStatsPanel() {
    const infoPanel = createAnyElement('div', 'stats-panel', '');
    infoPanel.style.width = this.field.style.width;
    this.wrapper.appendChild(infoPanel);
    // Turns counter
    infoPanel.appendChild(createAnyElement('span', 'turns-counter', this.turnsCount));
    // Game timer
    infoPanel.appendChild(createAnyElement('span', 'game_timer', 'Time: 00:00:00'));
    // Sound on/off key
    const soundKey = createButton('options__key-sound', '', () => {});
    soundKey.innerHTML = createIconHTML('volume_off');
    soundKey.addEventListener('click', () => {
      this.toggleSound();
      soundKey.innerHTML = this.isSoundOn ? createIconHTML('volume_up') : createIconHTML('volume_off');
      playSound('onoff', this.isSoundOn);
    });
    infoPanel.appendChild(soundKey);

    const buttonsPanel = createAnyElement('div', 'buttons-panel', '');
    buttonsPanel.style.width = this.field.style.width;
    this.wrapper.appendChild(buttonsPanel);
    // New game button
    buttonsPanel.appendChild(createButton('new_game-button', 'New', this.newGame.bind(this)));
    // Save game button
    buttonsPanel.appendChild(createButton('save_game-button', 'Save', this.saveGame.bind(this)));
    // Load game button
    buttonsPanel.appendChild(createButton('load_game-button', 'Load', this.loadGame.bind(this)));
    // Resolve game button
    buttonsPanel.appendChild(createButton('resolve_game-button', 'Give up', this.resolvePuzzle.bind(this)));
    // Field size selector
    const select = createAnyElement('select', 'btn', '');
    for (let i = 3; i <= 8; i += 1) {
      const option = createAnyElement('option', 'option-size', '');
      option.value = i;
      option.selected = (i === +this.fieldSize);
      option.innerText = `${i}x${i}`;
      select.appendChild(option);
    }
    select.addEventListener('change', () => {
      this.stackOfSteps = [];
      this.fieldSize = select.value;
      this.calculateTileSize();
      this.field = this.createTileFiled();
      this.newGame();
    });
    buttonsPanel.appendChild(select);
    return infoPanel;
  }

  setBackGround(tile, i, j, n) {
    tile.style.backgroundImage = `url('./assets/images/${n}.jpg')`;
    tile.style.backgroundSize = `${this.tileSize * this.fieldSize}px`;
    tile.style.backgroundPositionX = `${(i % this.fieldSize) * -this.tileSize}px`;
    tile.style.backgroundPositionY = `${j * -this.tileSize}px`;
  }

  changeBackGround() {
    this.pictureNumber = genUrlNumber();
    this.field.childNodes.forEach((el) => {
      el.style.backgroundImage = `url('./assets/images/${this.pictureNumber}.jpg')`;
    });
  }

  // Move tiles in random order
  shuffleTiles() {
    for (let i = 0; i < 125 * this.fieldSize; i += 1) {
      const index = Math.floor(Math.random() * (this.fieldSize ** 2 - 1));
      const tile = this.field.childNodes[index];
      if (this.isTargetNearEmptySpace(tile)) {
        this.shiftTiles(tile);
        this.logTurnsInStackOfSteps(tile);
        this.updateCounter();
      }
    }
    playSound('shuffle', this.isSoundOn);
  }

  // Gets rid of repetitive turns while logging
  logTurnsInStackOfSteps(tile) {
    if (tile.innerText === this.stackOfSteps[this.stackOfSteps.length - 1]) {
      this.stackOfSteps.pop();
    } else {
      this.stackOfSteps.push(tile.innerText);
    }
  }

  // Shift tile with and empty space
  shiftTiles(tile, emptyChild) {
    const { top, left } = tile.style;
    const { id } = tile;

    if (!emptyChild) {
      const emptyChildIndex = this.fieldSize ** 2 - 1;
      emptyChild = this.field.childNodes[emptyChildIndex];
    }

    tile.style.top = emptyChild.style.top;
    tile.style.left = emptyChild.style.left;
    tile.id = emptyChild.id;

    emptyChild.style.left = left;
    emptyChild.style.top = top;
    emptyChild.id = id;
  }

  updateCounter() {
    this.turnsCount += 1;
    this.turnsCounter.innerText = `Turns: ${this.turnsCount}`;
  }

  resetCounter() {
    this.turnsCount = 0;
    this.turnsCounter.innerText = `Turns: ${this.turnsCount}`;
  }

  isTargetNearEmptySpace(target) {
    const { top, left } = target.style;
    const delta = this.tileSize + this.tileGap;
    const emptyChild = document.querySelector('.empty');

    const dLeft = Math.abs(parseFloat(left, 10) - parseFloat(emptyChild.style.left, 10)) - delta;
    const dTop = Math.abs(parseFloat(top, 10) - parseFloat(emptyChild.style.top, 10)) - delta;

    return (top === emptyChild.style.top && Math.round(dLeft) === 0)
      || (left === emptyChild.style.left && Math.round(dTop) === 0);
  }

  isGameSolved() {
    for (let i = 0; i < this.fieldSize ** 2; i += 1) {
      if (+this.field.childNodes[i].id !== i) return false;
    }
    return true;
  }

  // Display time wasted for puzzle solution
  runGameTimer(countDate) {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      this.duration = now - countDate + this.initTimeValue;
      const data = getFormattedTimerData(this.duration);

      this.gameTimer.innerHTML = `Time: ${data}`;
    }, 1000);
  }

  toggleSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  // Resets counter, timer and generates new field
  newGame() {
    this.shuffleTiles();
    this.changeBackGround();
    this.resetCounter();
    this.duration = 0;
    this.initTimeValue = 0;
    this.runGameTimer(new Date().getTime());
  }

  // Save game status into local storage
  saveGame() {
    const acc = [];
    this.field.childNodes.forEach((el) => {
      acc.push({ style: el.style.cssText, id: el.id });
    });
    localStorage.setItem('saveGame', JSON.stringify(acc));
    localStorage.setItem('turns', JSON.stringify(this.turnsCount));
    localStorage.setItem('duration', JSON.stringify(this.duration));
    localStorage.setItem('fieldSize', JSON.stringify(this.fieldSize));
    localStorage.setItem('stackOfSteps', JSON.stringify(this.stackOfSteps));
    localStorage.setItem('backGroundId', JSON.stringify(this.pictureNumber));
    playSound('onoff', this.isSoundOn);
  }

  // Load game status from local storage
  loadGame() {
    this.pictureNumber = JSON.parse(localStorage.getItem('backGroundId'));
    this.fieldSize = JSON.parse(localStorage.getItem('fieldSize'));
    this.repositionTiles();
    this.field = this.createTileFiled();
    document.querySelectorAll('.option-size').forEach((el) => {
      if (+el.value === this.fieldSize) el.selected = true;
    });

    this.stackOfSteps = JSON.parse(localStorage.getItem('stackOfSteps'));

    const acc = JSON.parse(localStorage.getItem('saveGame'));
    this.field.childNodes.forEach((el, index) => {
      el.style.cssText = acc[index].style;
      el.id = acc[index].id;
    });

    this.turnsCount = JSON.parse(localStorage.getItem('turns'));
    this.turnsCounter.innerText = `Turns: ${this.turnsCount}`;
    this.initTimeValue = JSON.parse(localStorage.getItem('duration'));
    this.duration = 0;
    this.runGameTimer(new Date().getTime());
    playSound('shuffle', this.isSoundOn);
  }

  updateScores(time) {
    const date = new Date().toLocaleDateString();
    const data = {
      date,
      fieldSize: this.fieldSize,
      turnsCount: this.turnsCount,
      time,
    };
    this.scores.push(data);
    this.scores = this.scores.sort((a, b) => a.turnsCount - b.turnsCount);
    this.scores = this.scores.filter((_, i) => i < 10);
    localStorage.setItem('scores', JSON.stringify(this.scores));
  }

  // Mousedown function for drag and drop tiles
  grabTile(grabEvent) {
    const target = grabEvent.currentTarget;
    if (!this.isTargetNearEmptySpace(target)) return false;

    let isMoved = false;
    const { top, left } = target.style;
    const { id } = target;
    const shiftX = grabEvent.clientX - target.getBoundingClientRect().left;
    const shiftY = grabEvent.clientY - target.getBoundingClientRect().top;
    target.style.zIndex = 1000;
    function onMouseMove(moveEvent) {
      if (Math.abs(grabEvent.pageX - moveEvent.pageX) > 10
          || Math.abs(grabEvent.pageY - moveEvent.pageY) > 10) {
        isMoved = true;
      }
      if (isMoved) {
        target.style.left = `${moveEvent.pageX - shiftX}px`;
        target.style.top = `${moveEvent.pageY - shiftY}px`;
      }
    }

    document.addEventListener('mousemove', onMouseMove);

    const emptyChildIndex = this.fieldSize ** 2 - 1;
    const emptyChild = this.field.childNodes[emptyChildIndex];

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      // If moved tile is farther then 45px returns to initial position, else moves to empty one
      if ((Math.sqrt((parseInt(target.style.top, 10) - parseInt(emptyChild.style.top, 10)) ** 2
        + (parseInt(target.style.left, 10) - parseInt(emptyChild.style.left, 10)) ** 2) < 45)
        || !isMoved) {
        target.style.top = emptyChild.style.top;
        target.style.left = emptyChild.style.left;
        target.id = emptyChild.id;

        emptyChild.style.left = left;
        emptyChild.style.top = top;
        emptyChild.id = id;

        playSound('move', this.isSoundOn);
        this.stackOfSteps.push(target.innerText);
        this.updateCounter();
      } else {
        target.style.top = top;
        target.style.left = left;
      }
      target.style.zIndex = 'auto';

      if (this.isGameSolved()) {
        setTimeout(() => {
          playSound('win31', this.isSoundOn);
          this.displayWinGameMessage();
        }, 200);
      }

      target.onmouseup = null;
    }

    target.onmouseup = onMouseUp.bind(this);
    return true;
  }

  // Win game function
  displayWinGameMessage() {
    const data = getFormattedTimerData(this.duration);
    clearInterval(this.timer);
    this.updateScores(data);
    this.field.childNodes.forEach((el) => {
      el.style.transform = 'scale(0)';
    });
    this.toggleBlockMenu();
    // Add full image and win message
    const fullImage = createAnyElement('div', 'result-image', '');
    fullImage.style.backgroundImage = `url('./assets/images/${this.pictureNumber}.jpg')`;
    fullImage.style.backgroundSize = 'cover';
    this.field.appendChild(fullImage);
    const winMessage = createAnyElement('div', 'result-message', '');
    winMessage.innerText = `Ура! Вы решили головоломку за ${data} и ${this.turnsCount} ходов`;
    fullImage.appendChild(winMessage);
    this.scoresElem = createAnyElement('div', 'scores-wrapper', '');
    fullImage.appendChild(this.scoresElem);
    const buttonsElem = createAnyElement('div', 'scores_buttons-wrapper', '');
    fullImage.appendChild(buttonsElem);
    // Scores button
    buttonsElem.appendChild(createButton('scores-button', 'Scores', this.showScores.bind(this)));
    // Subscription of the painting
    const subsData = imagesText[this.pictureNumber - 1];
    const subsText = `"${subsData.name}" - ${subsData.author}, ${subsData.year}`;
    buttonsElem.appendChild(createAnyElement('div', 'result-message', subsText));
    // Close button
    buttonsElem.appendChild(createButton('close-button', 'X', this.closeMessage.bind(this)));
    this.isScoresDisplayed = false;
  }

  closeMessage() {
    this.toggleBlockMenu();
    this.field.removeChild(document.querySelector('.result-image'));
    this.field.childNodes.forEach((el) => {
      el.style.transform = 'scale(1)';
    });
  }

  showScores() {
    this.isScoresDisplayed = !this.isScoresDisplayed;
    const data = JSON.parse(localStorage.getItem('scores'));
    if (this.isScoresDisplayed) {
      data.forEach((el, i) => {
        const text = `${i + 1}. ${el.fieldSize}x${el.fieldSize}, turns: ${el.turnsCount}, time: ${el.time}`;
        this.scoresElem.appendChild(createAnyElement('div', 'scores-line', text));
      });
    } else {
      document.querySelectorAll('.scores-line').forEach((el) => {
        this.scoresElem.removeChild(el);
      });
    }
  }

  // Keep tiles in the field during window resizing
  repositionTiles() {
    this.calculateTileSize();
    this.field = this.createTileFiled();
    this.wrapper.removeChild(document.querySelector('.stats-panel'));
    this.wrapper.removeChild(document.querySelector('.buttons-panel'));
    this.stats = this.createStatsPanel();
  }

  // Gives game solution (kind of)
  resolvePuzzle() {
    this.toggleBlockMenu();
    clearInterval(this.timer);
    let timer = 0;
    for (let i = this.stackOfSteps.length - 1; i >= 0; i -= 1) {
      const tile = this.field.childNodes[this.stackOfSteps[i] - 1];
      setTimeout(() => {
        this.shiftTiles(tile);
        playSound('move', this.isSoundOn);
      }, timer += 200);
    }
    setTimeout(() => {
      playSound('win31', this.isSoundOn);
      this.toggleBlockMenu();
    }, timer += 200);
    this.stackOfSteps = [];
  }

  toggleBlockMenu() {
    this.isButtonsDisabled = !this.isButtonsDisabled;
    toggleDisabledProp(['.new_game-button', '.save_game-button', '.load_game-button', '.resolve_game-button', 'select'], this.isButtonsDisabled);
  }
}

const superPuzzle = new GemPuzzle();
superPuzzle.init();

window.onresize = () => {
  superPuzzle.repositionTiles();
};
