class GemPuzzle {
  constructor() {
    this.turnsCount = 0;
    this.tileSize = 80;
    this.tileGap = 10;
    this.fieldSize = 4;
    this.xOffset = 10;
    this.yOffset = 10;
  }

  init() {
    this.body = document.querySelector('body');
    this.field = this.createTileFiled();
    this.stats = this.createStatsPanel();
    this.newGame();
    this.gameTimer = document.querySelector('.game-timer');
  }

  createTileFiled() {
    // Create field
    const field = document.createElement('div');
    field.classList.add('field');

    const {
      tileSize, tileGap, fieldSize, yOffset, xOffset,
    } = this;

    let j = -1;
    for (let i = 0; i < fieldSize ** 2; i += 1) {
      // Create tile and position it on the field
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.style.left = `${xOffset + (i % fieldSize) * (tileSize + tileGap)}px`;
      if (i % fieldSize === 0) j += 1;
      tile.style.top = `${yOffset + j * (tileSize + tileGap)}px`;

      if (i < fieldSize ** 2 - 1) {
        tile.innerText = `${i + 1}`;
      } else {
        tile.classList.add('empty');
      }
      // Add event listeners for each tile
      // tile.addEventListener('click', (event) => {
      //   this.shiftTiles(event.currentTarget);
      // });
      tile.addEventListener('mousedown', (event) => {
        this.grabTile(event);
      });
      tile.ondragstart = () => false;

      field.appendChild(tile);
    }

    this.body.appendChild(field);

    return field;
  }

  // Shift tile with and empty space if it nearby
  shiftTiles(target) {
    const { top, left } = target.style;

    const emptyChildIndex = this.fieldSize ** 2 - 1;
    const emptyChild = this.field.childNodes[emptyChildIndex];

    if (this.isTargetNearEmptySpace(target)) {
      target.style.top = emptyChild.style.top;
      target.style.left = emptyChild.style.left;

      emptyChild.style.left = left;
      emptyChild.style.top = top;
      this.updateCounter();
    }
  }

  updateCounter() {
    this.turnsCount += 1;
    this.stats.innerText = this.turnsCount;
  }

  resetCounter() {
    this.turnsCount = 0;
    this.stats.innerText = this.turnsCount;
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

  runGameTimer(countDate) {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - countDate;

      function addZero(param) {
        const result = param < 10 ? `0${param}` : param;
        return result;
      }

      const hours = addZero(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      const minutes = addZero(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      const seconds = addZero(Math.floor((distance % (1000 * 60)) / 1000));

      this.gameTimer.innerHTML = `Time:${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

  // Create panel for diff info and buttons
  createStatsPanel() {
    const panel = document.createElement('div');
    panel.classList.add('stats-panel');
    panel.innerText = this.turnsCount;

    const timer = document.createElement('span');
    timer.classList.add('game-timer');

    const shuffle = document.createElement('button');
    shuffle.classList.add('shuffle-button');
    shuffle.innerText = 'New Game';
    shuffle.addEventListener('click', () => {
      this.newGame();
    });

    this.body.appendChild(timer);
    this.body.appendChild(panel);
    this.body.appendChild(shuffle);

    return panel;
  }

  // Move tiles in random order
  shuffleTiles() {
    for (let i = 0; i < 1000; i += 1) {
      const index = Math.floor(Math.random() * (this.fieldSize ** 2 - 1));
      this.shiftTiles(this.field.childNodes[index]);
    }
  }

  newGame() {
    this.shuffleTiles();
    this.resetCounter();
    this.runGameTimer(new Date().getTime());
  }

  // Mousedown function for drag and drop tiles
  grabTile(event) {
    const target = event.currentTarget;
    if (!this.isTargetNearEmptySpace(target)) return false;

    let isMoved = false;
    const { top, left } = target.style;
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
        emptyChild.style.left = left;
        emptyChild.style.top = top;
      } else {
        target.style.top = top;
        target.style.left = left;
      }
      target.style.zIndex = 'auto';

      this.updateCounter();
      target.onmouseup = null;
    }

    target.onmouseup = onMouseUp.bind(this);
    return true;
  }
}

const superPuzzle = new GemPuzzle();
superPuzzle.init();
