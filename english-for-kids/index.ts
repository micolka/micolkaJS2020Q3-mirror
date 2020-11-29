/* eslint-disable import/extensions */
import './src/scss/index.scss';
import cards from './src/cardsConfig';
import { initBurgerMenu, changeMenuActiveLink } from './src/components/burgerMenu';
import getCardInnerHTML from './src/components/card';
import initSwitchButton from './src/components/switchButton';

const rootDiv: HTMLElement = document.querySelector('.cards_wrapper');
const audio: HTMLAudioElement = new Audio();
let currentCollectionIndex: number;

function playSound(filename:string): void {
  if (window.location.hash.slice(1) === '') return;
  audio.preload = 'auto';
  audio.src = `assets/${filename}`;
  audio.play();
}

function createMainPageContent(): void {
  const cardsSections:string[] = cards.categories;
  const cardsWrapperContent:string[] = cardsSections.map((elem, index) => `
    <a class="card_container" href="#${cards.hashData[index]}">
      <img src="./assets/${cards.data[index][0].image}" alt="">${elem}
    </a>`);
  rootDiv.innerHTML = cardsWrapperContent.join('');
}

function addListenersToCards(): void {
  const cardsData = cards.data[currentCollectionIndex];
  const cardsCollection:NodeListOf<HTMLElement> = document.querySelectorAll('.card_container');
  const buttonsCollection:NodeListOf<HTMLElement> = document.querySelectorAll('.btn_rotate');

  cardsCollection.forEach((elem, index) => {
    let isFlipped:boolean = false;
    const card:HTMLElement = elem;
    card.addEventListener('click', (e) => {
      if (e.target !== buttonsCollection[index]
          && e.target !== buttonsCollection[index].firstChild) {
        playSound(cardsData[index].audioSrc);
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

function openSelectedSet(hash: string): void {
  if (hash === '') {
    createMainPageContent();
  } else {
    currentCollectionIndex = cards.hashData.findIndex((el) => el === hash);
    const cardsData = cards.data[currentCollectionIndex];
    const cardsContent:string[] = cardsData.map((elem) => getCardInnerHTML(elem));
    rootDiv.innerHTML = cardsContent.join('');
    addListenersToCards();
  }
}

window.onpopstate = () => {
  const hash: string = window.location.hash.slice(1);
  openSelectedSet(hash);
  changeMenuActiveLink(hash);
};

createMainPageContent();
initSwitchButton();
initBurgerMenu();
