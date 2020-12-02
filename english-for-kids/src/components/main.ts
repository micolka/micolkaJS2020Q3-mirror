/* eslint-disable import/extensions */
import state from '../appState';
import cards from '../cardsConfig';
import { getHash } from '../utils';
import { changeMenuActiveLink } from './burgerMenu';
import { addListenersToCards, getTrainCardInnerHTML } from './card';

export function createMainPageContent(): void {
  const rootDiv: HTMLElement = document.querySelector('.cards_wrapper');
  const cardsSections:string[] = cards.categories;
  const cardsWrapperContent:string[] = cardsSections.map((elem, index) => `
    <a class="card_container" href="#${cards.hashData[index]}">
      <img src="./assets/${cards.data[index][0].image}" alt="">
      <div class="card_bottom">
        <div class="card_info">${elem}</div>
      </div>
    </a>`);
  rootDiv.innerHTML = cardsWrapperContent.join('');
}

export function openSelectedSet(): void {
  const rootDiv: HTMLElement = document.querySelector('.cards_wrapper');
  const hash:string = getHash();
  if (hash === '') {
    if (hash !== state.currentHash) createMainPageContent();
  } else {
    state.currentCollectionIndex = cards.hashData.findIndex((el) => el === hash);
    const cardsData = cards.data[state.currentCollectionIndex];
    const cardsContent:string[] = cardsData.map((elem, index) => getTrainCardInnerHTML(elem,
      index));
    rootDiv.innerHTML = cardsContent.join('');
    addListenersToCards();
  }
  changeMenuActiveLink(hash);
  state.currentHash = hash;
}
