class GemPuzzle {
  constructor() {
    this.tileSize = 80;
    this.tileGap = 10;
    this.fieldSize = 4;
    this.xOffset = 10;
    this.yOffset = 10;
    this.turnsCount = 0;
    this.initTimeValue = 0;
    this.duration = 0;
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

  runGameTimer(countDate) {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      this.duration = now - countDate + this.initTimeValue;

      function addZero(param) {
        const result = param < 10 ? `0${param}` : param;
        return result;
      }

      const hours = addZero(Math.floor((this.duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = addZero(Math.floor((this.duration % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = addZero(Math.floor((this.duration % (1000 * 60)) / 1000));

      this.gameTimer.innerHTML = `Time: ${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

  // Create panel for diff info and buttons
  createStatsPanel() {
    const panel = document.createElement('div');
    panel.classList.add('stats-panel');
    // Turns counter
    panel.innerText = this.turnsCount;
    // Game timer
    const timer = document.createElement('span');
    timer.classList.add('game_timer');
    // New game button
    const newGame = document.createElement('button');
    newGame.classList.add('new_game-button');
    newGame.innerText = 'New Game';
    newGame.addEventListener('click', () => {
      this.newGame();
    });
    // Save game button
    const saveGame = document.createElement('button');
    saveGame.classList.add('save_game-button');
    saveGame.innerText = 'Save Game';
    saveGame.addEventListener('click', () => {
      this.saveGame();
    });
    // Save game button
    const loadGame = document.createElement('button');
    loadGame.classList.add('load_game-button');
    loadGame.innerText = 'Load Game';
    loadGame.addEventListener('click', () => {
      this.loadGame();
    });

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

    this.body.appendChild(timer);
    this.body.appendChild(panel);
    this.body.appendChild(newGame);
    this.body.appendChild(saveGame);
    this.body.appendChild(loadGame);
    this.body.appendChild(select);

    return panel;
  }

  // Move tiles in random order
  shuffleTiles() {
    for (let i = 0; i < 5000 * this.fieldSize; i += 1) {
      const index = Math.floor(Math.random() * (this.fieldSize ** 2 - 1));
      this.shiftTiles(this.field.childNodes[index]);
    }
  }

  // Resets counter, timer and generates new field
  newGame() {
    this.shuffleTiles();
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
      } else {
        target.style.top = top;
        target.style.left = left;
      }
      target.style.zIndex = 'auto';
      this.updateCounter();

      if (this.isGameSolved()) {
        alert(`Ура! Вы решили головоломку за ${this.gameTimer.innerHTML} и ${this.turnsCount} ходов`);
        clearInterval(this.timer);
      }

      target.onmouseup = null;
    }

    target.onmouseup = onMouseUp.bind(this);
    return true;
  }
}

const superPuzzle = new GemPuzzle();
superPuzzle.init();
