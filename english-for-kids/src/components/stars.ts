function keepQueueShort() {
  const rootDiv:HTMLElement = document.querySelector('.stars_wrapper');
  const starsList:NodeListOf<HTMLElement> = document.querySelectorAll('.stars_wrapper img');
  if (starsList.length > 8) {
    rootDiv.removeChild(starsList[0]);
  }
}

function addStar(fileName:string) {
  const rootDiv:HTMLElement = document.querySelector('.stars_wrapper');
  const img:HTMLImageElement = document.createElement('img');
  img.src = `./assets/img/${fileName}.png`;
  img.alt = 'star';
  rootDiv.appendChild(img);
  keepQueueShort();
}

export function addGoldStar(): void {
  const fileName:string = '_yellowStar';
  addStar(fileName);
}

export function addBlackStar(): void {
  const fileName:string = '_blackStar';
  addStar(fileName);
}

export function resetStarsQueue() {
  const rootDiv:HTMLElement = document.querySelector('.stars_wrapper');
  rootDiv.innerHTML = '';
}
