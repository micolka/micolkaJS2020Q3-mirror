const config = [
  {},

]


class gemPuzzle {
  constructor() {
    this.tileSize = 80;
    this.tileGap = 10;
    this.fieldSize = 4;
  }

  init() {
    this.field = this.createTileFiled();
  }

  createTileFiled() {
    const body = document.querySelector('body');
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

    body.appendChild(field);

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
    }
  }

}

const superPuzzle = new gemPuzzle();
superPuzzle.init();


