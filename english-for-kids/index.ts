import './scss/index.scss'
import cards from './src/cards'

const rootDiv: HTMLElement = document.querySelector('.cards_wrapper');

function createMainPageContent() {
  const cardsSections:string[] = cards.categories;
  const cardsWrapperContent:string[] = cardsSections.map( (elem, index) => {
    return `<a class="card_container" href="#${cards.hashData[index]}"><img src="./assets/${cards.data[index][0].image}" alt="">${elem}</a>`
  });
  rootDiv.innerHTML = cardsWrapperContent.join('');
}

function openSelectedSet(hash: string): void {
  if (hash === '') {
    createMainPageContent();
  } else {
    const index:number = cards.hashData.findIndex(el => el === hash);
    const cardsData = cards.data[index];
    const cardsContent:string[]  = cardsData.map ( (elem) => {
      return `<div class="card_container"><img src="./assets/${elem.image}" alt="">${elem.word}</div>`
    });
    rootDiv.innerHTML = cardsContent.join('');
  }
}

window.onpopstate = () => {
  openSelectedSet(window.location.hash.slice(1));
}

createMainPageContent();