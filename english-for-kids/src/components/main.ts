/* eslint-disable import/extensions */
import state from '../appState';
import cards from '../cardsConfig';
import { getHash, getRootElement } from '../utils';
import { changeMenuActiveLink } from './burgerMenu';
import { addListenersToCards, getTrainCardInnerHTML } from './card';
import { generateStatsPage, insertStatsButtons, removeStatsButtons } from './stats';

export function createMainPageContent(): void {
  const rootDiv: HTMLElement = getRootElement();
  const cardsSections:string[] = cards.categories;
  const cardsWrapperContent:string[] = cardsSections.map((elem, index) => `
    <a class="card_container card_effects" href="#${cards.hashData[index]}">
      <img src="./assets/${cards.data[index][0].image}" alt="">
      <div class="card_bottom">
        <div class="card_info">${elem}</div>
      </div>
    </a>`);
  rootDiv.innerHTML = cardsWrapperContent.join('');
}

export function openSelectedSet(): void {
  const rootDiv: HTMLElement = getRootElement();
  const hash:string = getHash();
  removeStatsButtons();
  if (hash === '') {
    if (hash !== state.currentHash) createMainPageContent();
  } else if (hash === 'stats') {
    if (hash !== state.currentHash) {
      generateStatsPage();
      insertStatsButtons();
    }
  } else {
    state.currentCollectionIndex = cards.hashData.findIndex((el) => el === hash);
    state.currentCollection = cards.data[state.currentCollectionIndex];
    const cardsContent:string[] = state.currentCollection
      .map((elem, index) => getTrainCardInnerHTML(elem, index));
    rootDiv.innerHTML = cardsContent.join('');
    addListenersToCards();
  }
  changeMenuActiveLink(hash);
  state.currentHash = hash;
}
