import { getFormattedTimerData, createIconHTML } from './utils.js';

class GemPuzzle {
  constructor() {
    this.tileSize = 80;
    this.tileGap = 3;
    this.fieldSize = 4;
    this.xOffset = 10;
    this.yOffset = 10;
    this.turnsCount = 0;
    this.initTimeValue = 0;
    this.duration = 0;
    this.isSoundOn = false;
  }

  init() {
    this.body = document.querySelector('body');
    this.field = this.createTileFiled();
    this.stats = this.createStatsPanel();
    this.newGame();
    this.gameTimer = document.querySelector('.game_timer');
  }

  // Create field of tiles
  createTileFiled() {
    const {
      tileSize, tileGap, fieldSize, yOffset, xOffset,
    } = this;

    const field = document.createElement('div');
    field.classList.add('field');
    field.style.width = `${(tileGap + tileSize) * fieldSize + tileGap}px`;
    field.style.height = field.style.width;
    const pictureNumber = Math.floor(Math.random() * 149) + 1;

    let j = -1;
    for (let i = 0; i < fieldSize ** 2; i += 1) {
      // Create tile and place it on the field
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.style.left = `${xOffset + (i % fieldSize) * (tileSize + tileGap)}px`;
      if (i % fieldSize === 0) j += 1;
      tile.style.top = `${yOffset + j * (tileSize + tileGap)}px`;
      tile.id = i;
      if (i < fieldSize ** 2 - 1) {
        tile.innerText = `${i + 1}`;
      } else {
        tile.classList.add('empty');
      }
      this.setBackGround(tile, i, j, pictureNumber);

      tile.addEventListener('mousedown', (event) => {
        this.grabTile(event);
      });
      tile.ondragstart = () => false;

      field.appendChild(tile);
    }

    if (this.field) {
      this.body.replaceChild(field, this.field);
    } else {
      this.body.appendChild(field);
    }

    return field;
  }

  setBackGround(tile, i, j, n) {
    tile.style.backgroundImage = `url('./assets/images/${n}.jpg')`;
    tile.style.backgroundSize = `${this.tileSize * this.fieldSize}px`;
    tile.style.backgroundPositionX = `${(i % this.fieldSize) * -this.tileSize}px`;
    tile.style.backgroundPositionY = `${j * -this.tileSize}px`;
  }

  changeBackGround() {
    const pictureNumber = Math.floor(Math.random() * 149) + 1;
    this.field.childNodes.forEach((el) => {
      el.style.backgroundImage = `url('./assets/images/${pictureNumber}.jpg')`;
    });
  }

  // Shift tile with and empty space if it nearby
  shiftTiles(target) {
    if (this.isTargetNearEmptySpace(target)) {
      const tile = target;
      const { top, left } = target.style;
      const { id } = target;

      const emptyChildIndex = this.fieldSize ** 2 - 1;
      const emptyChild = this.field.childNodes[emptyChildIndex];

      tile.style.top = emptyChild.style.top;
      tile.style.left = emptyChild.style.left;
      tile.id = emptyChild.id;

      emptyChild.style.left = left;
      emptyChild.style.top = top;
      emptyChild.id = id;
      this.updateCounter();
    }
  }

  updateCounter() {
    this.turnsCount += 1;
    this.stats.innerText = `Turns: ${this.turnsCount}`;
  }

  resetCounter() {
    this.turnsCount = 0;
    this.stats.innerText = `Turns: ${this.turnsCount}`;
  }

  isTargetNearEmptySpace(target) {
    const { top, left } = target.style;
    const delta = this.tileSize + this.tileGap;

    const emptyChildIndex = this.fieldSize ** 2 - 1;
    const emptyChild = this.field.childNodes[emptyChildIndex];

    return (top === emptyChild.style.top
      && Math.abs(parseInt(left, 10) - parseInt(emptyChild.style.left, 10)) === delta)
      || (left === emptyChild.style.left
      && Math.abs(parseInt(top, 10) - parseInt(emptyChild.style.top, 10)) === delta);
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

  // Create panel for diff info and buttons
  createStatsPanel() {
    const panel = document.createElement('div');
    panel.classList.add('stats-panel');
    // Turns counter
    panel.innerText = this.turnsCount;
    this.body.appendChild(panel);
    // Game timer
    const timer = document.createElement('span');
    timer.classList.add('game_timer');
    this.body.appendChild(timer);
    // New game button
    const newGame = document.createElement('button');
    newGame.classList.add('new_game-button');
    newGame.innerText = 'New Game';
    newGame.addEventListener('click', () => {
      this.newGame();
    });
    this.body.appendChild(newGame);
    // Save game button
    const saveGame = document.createElement('button');
    saveGame.classList.add('save_game-button');
    saveGame.innerText = 'Save Game';
    saveGame.addEventListener('click', () => {
      this.saveGame();
    });
    this.body.appendChild(saveGame);
    // Load game button
    const loadGame = document.createElement('button');
    loadGame.classList.add('load_game-button');
    loadGame.innerText = 'Load Game';
    loadGame.addEventListener('click', () => {
      this.loadGame();
    });
    this.body.appendChild(loadGame);
    // Field size selector
    const select = document.createElement('select');
    for (let i = 3; i <= 8; i += 1) {
      const option = document.createElement('option');
      option.value = i;
      if (i === 4) option.selected = true;
      option.innerText = `${i}x${i}`;
      select.appendChild(option);
    }
    select.addEventListener('change', () => {
      this.fieldSize = select.value;
      this.field = this.createTileFiled();
      this.newGame();
    });
    this.body.appendChild(select);
    // Sound on/off key
    const soundKey = document.createElement('button');
    soundKey.classList.add('options__key-sound');
    soundKey.innerHTML = createIconHTML('volume_up');
    soundKey.addEventListener('click', () => {
      this.toggleSound();
      soundKey.innerHTML = this.isSoundOn ? createIconHTML('volume_up') : createIconHTML('volume_off');
    });
    this.body.appendChild(soundKey);

    return panel;
  }

  toggleSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  playSound(filename) {
    if (this.isSoundOn) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = `assets/sound/${filename}.mp3`;
      audio.play();
    }
  }

  // Move tiles in random order
  shuffleTiles() {
    for (let i = 0; i < 5000 * this.fieldSize; i += 1) {
      const index = Math.floor(Math.random() * (this.fieldSize ** 2 - 1));
      this.shiftTiles(this.field.childNodes[index]);
    }
    this.playSound('shuffle');
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
      acc.push(el.style.cssText);
    });
    localStorage.setItem('save', JSON.stringify(acc));
    localStorage.setItem('turns', JSON.stringify(this.turnsCount));
    localStorage.setItem('duration', JSON.stringify(this.duration));
  }

  // Load game status from local storage
  loadGame() {
    const acc = JSON.parse(localStorage.getItem('save'));
    this.field.childNodes.forEach((el, index) => {
      el.style.cssText = acc[index];
    });

    this.turnsCount = JSON.parse(localStorage.getItem('turns'));
    this.stats.innerText = `Turns: ${this.turnsCount}`;
    this.initTimeValue = JSON.parse(localStorage.getItem('duration'));
    this.duration = 0;
    this.runGameTimer(new Date().getTime());
  }

  updateScores(time) {
    const scores = [];
    const date = new Date().toLocaleDateString();
    const data = {
      date,
      fieldSize: this.fieldSize,
      turnsCount: this.turnsCount,
      time,
    };
    scores.push(data);
    localStorage.setItem('scores', JSON.stringify(scores));
  }

  // Mousedown function for drag and drop tiles
  grabTile(event) {
    const target = event.currentTarget;
    if (!this.isTargetNearEmptySpace(target)) return false;

    let isMoved = false;
    const { top, left } = target.style;
    const { id } = target;
    const shiftX = event.clientX - target.getBoundingClientRect().left;
    const shiftY = event.clientY - target.getBoundingClientRect().top;
    target.style.zIndex = 1000;

    function onMouseMove(e) {
      isMoved = true;
      target.style.left = `${e.pageX - shiftX}px`;
      target.style.top = `${e.pageY - shiftY}px`;
    }

    document.addEventListener('mousemove', onMouseMove);

    const emptyChildIndex = this.fieldSize ** 2 - 1;
    const emptyChild = this.field.childNodes[emptyChildIndex];

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      // If moved tile is farther then 45 returns to initial position, else moves to empty one
      if ((Math.sqrt((parseInt(target.style.top, 10) - parseInt(emptyChild.style.top, 10)) ** 2
        + (parseInt(target.style.left, 10) - parseInt(emptyChild.style.left, 10)) ** 2) < 45)
        || !isMoved) {
        target.style.top = emptyChild.style.top;
        target.style.left = emptyChild.style.left;
        target.id = emptyChild.id;
        emptyChild.style.left = left;
        emptyChild.style.top = top;
        emptyChild.id = id;
        this.playSound('move');
      } else {
        target.style.top = top;
        target.style.left = left;
      }
      target.style.zIndex = 'auto';
      this.updateCounter();

      if (this.isGameSolved()) {
        this.playSound('win31');

        const data = getFormattedTimerData(this.duration);
        // alert(`Ура! Вы решили головоломку за ${data} и ${this.turnsCount} ходов`);
        clearInterval(this.timer);
        this.updateScores(data);
      }

      target.onmouseup = null;
    }

    target.onmouseup = onMouseUp.bind(this);
    return true;
  }
}

const superPuzzle = new GemPuzzle();
superPuzzle.init();
