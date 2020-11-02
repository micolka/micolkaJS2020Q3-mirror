class gemPuzzle {
  constructor() {
    this.turnsCount = 0;
    this.tileSize = 80;
    this.tileGap = 10;
    this.fieldSize = 4;
  }

  init() {
    this.body = document.querySelector('body');
    this.field = this.createTileFiled();
    this.stats = this.createStatsPanel();
  }

  createTileFiled() {
    const field = document.createElement('div');
    field.classList.add('field');
    
    
    const xOffset = 10;
    const yOffset = 10;
    const tileSize = this.tileSize;
    const tileGap = this.tileGap;
    const fieldSize = this.fieldSize;


    let j = -1;
    for (let i = 0; i < fieldSize ** 2; i += 1) {
      const tile = document.createElement('div');
    
      tile.classList.add('tile');

      tile.style.left = `${xOffset + i % fieldSize * (tileSize + tileGap)}px`;
      if (i % fieldSize === 0) j++;
      tile.style.top = `${yOffset + j * (tileSize + tileGap)}px`;

      if (i < fieldSize ** 2 - 1) {
        tile.innerHTML = `<span>${i + 1}</span>`;
      } else {
        tile.innerHTML = `<span></span>`;
        tile.classList.add('empty');
      }
      tile.addEventListener('click', (event) => {
        this.shiftTiles(event.currentTarget);
      });

      field.appendChild(tile);
    }

    this.body.appendChild(field);

    return field;
  }

  shiftTiles(target) {
    let top = target.style.top;
    let left = target.style.left;
    const delta = this.tileSize + this.tileGap;

    const emptyChildIndex = this.fieldSize ** 2 - 1;
    const emptyChild = this.field.childNodes[emptyChildIndex];
    
    if ((top === emptyChild.style.top && Math.abs(parseInt(left) - parseInt(emptyChild.style.left)) === delta) 
        || (left === emptyChild.style.left && Math.abs(parseInt(top) - parseInt(emptyChild.style.top)) === delta)) {
      target.style.top = emptyChild.style.top;
      target.style.left = emptyChild.style.left;
      emptyChild.style.left = left;
      emptyChild.style.top = top;
      this.turnsCount++;
      this.stats.innerText = this.turnsCount;
    }
  }

  createStatsPanel() {
    const panel = document.createElement('div');
    panel.classList.add('stats-panel');
    panel.innerText = this.turnsCount;

    const shuffle = document.createElement('button');
    shuffle.classList.add('shuffle-button');
    shuffle.innerText = 'shuffle';
    shuffle.addEventListener('click', () => {
      this.shuffleTiles();
    })

    this.body.appendChild(panel);
    this.body.appendChild(shuffle);

    return panel;
  }

  shuffleTiles() {
    for (let i = 0; i < 1000; i++) {
      let index = Math.floor(Math.random() * (this.fieldSize ** 2 - 1));
      this.shiftTiles(this.field.childNodes[index]);
    }
  }
}

const superPuzzle = new gemPuzzle();
superPuzzle.init();


