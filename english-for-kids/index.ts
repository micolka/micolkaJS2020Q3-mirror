/* eslint-disable import/extensions */
import './src/scss/index.scss';
import cards from './src/cardsConfig';
import { initBurgerMenu, changeMenuActiveLink } from './src/components/burgerMenu';
import { getTrainCardInnerHTML, transformCardsMode } from './src/components/card';
import initSwitchButton from './src/components/switchButton';
import state from './src/appState';
import { playSound } from './src/utils';
import { initStartGameButton, showGameButton } from './src/components/gameButton';
import { nextGameStep } from './src/gameEngine';

const rootDiv: HTMLElement = document.querySelector('.cards_wrapper');
const audio: HTMLAudioElement = new Audio();

function createMainPageContent(): void {
  const cardsSections:string[] = cards.categories;
  const cardsWrapperContent:string[] = cardsSections.map((elem, index) => `
    <a class="card_container" href="#${cards.hashData[index]}">
      <img src="./assets/${cards.data[index][0].image}" alt="">${elem}
    </a>`);
  rootDiv.innerHTML = cardsWrapperContent.join('');
}

function addListenersToCards(): void {
  const cardsData = cards.data[state.currentCollectionIndex];
  const cardsCollection:NodeListOf<HTMLElement> = document.querySelectorAll('.card_container');
  const buttonsCollection:NodeListOf<HTMLElement> = document.querySelectorAll('.btn_rotate');

  cardsCollection.forEach((elem, index) => {
    let isFlipped:boolean = false;
    const card:HTMLElement = elem;
    card.addEventListener('click', (e) => {
      if (e.target !== buttonsCollection[index]
          && e.target !== buttonsCollection[index].firstChild) {
        if (state.isTrainModeOn) playSound(cardsData[index].audioSrc, audio);
        if (state.isGameStarted) {
          const clickedCard = e.currentTarget as HTMLElement;
          nextGameStep(clickedCard, audio);
        }
      }
    });
    buttonsCollection[index].addEventListener('click', () => {
      card.classList.toggle('active_card');
      setTimeout(() => { isFlipped = true; }, 500);
    });
    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (isFlipped) {
          card.classList.toggle('active_card');
          isFlipped = false;
        }
      }, 500);
    });
  });
}

function openSelectedSet(): void {
  const hash: string = window.location.hash.slice(1);
  if (hash === '') {
    if (hash !== state.currentHash) createMainPageContent();
  } else {
    state.currentCollectionIndex = cards.hashData.findIndex((el) => el === hash);
    const cardsData = cards.data[state.currentCollectionIndex];
    const cardsContent:string[] = cardsData.map((elem, index) => getTrainCardInnerHTML(elem, index));
    rootDiv.innerHTML = cardsContent.join('');
    addListenersToCards();
  }
  changeMenuActiveLink(hash);
  state.currentHash = hash;
}

window.onpopstate = () => {
  openSelectedSet();
  // если на главной странице переключатель неактивен.
};

document.addEventListener('modeChanged', () => {
  transformCardsMode();
  showGameButton();
});

createMainPageContent();
initSwitchButton(audio);
initStartGameButton(audio);
initBurgerMenu();
