/* eslint-disable import/extensions */
import './scss/index.scss';
import cards from './src/cards';

const rootDiv: HTMLElement = document.querySelector('.cards_wrapper');
const audio: HTMLAudioElement = new Audio();
let currentCollectionIndex: number;

const createIconHTML = (icon:string) => `<i class="material-icons">${icon}</i>`;

function playSound(filename:string) {
  if (window.location.hash.slice(1) === '') return;
  audio.preload = 'auto';
  audio.src = `assets/${filename}`;
  audio.play();
}

function createMainPageContent() {
  const cardsSections:string[] = cards.categories;
  const cardsWrapperContent:string[] = cardsSections.map((elem, index) => `
    <a class="card_container" href="#${cards.hashData[index]}">
      <img src="./assets/${cards.data[index][0].image}" alt="">${elem}
    </a>`);
  rootDiv.innerHTML = cardsWrapperContent.join('');
}

function addListenersToCards() {
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
      card.classList.toggle('active');
      setTimeout(() => { isFlipped = true; }, 500);
    });
    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (isFlipped) {
          card.classList.toggle('active');
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
    const cardsContent:string[] = cardsData.map((elem) => `
        <div class="card_container">
          <div class="card_front">
            <img src="./assets/${elem.image}" alt="">
            <div class="card_bottom">
              <div>${elem.word}</div>
              <div class="btn_rotate">${createIconHTML('cached')}</div>
            </div>
          </div>
          <div class="card_back">${elem.translation}</div>
        </div>
      `);
    rootDiv.innerHTML = cardsContent.join('');
  }
  addListenersToCards();
}

window.onpopstate = () => {
  openSelectedSet(window.location.hash.slice(1));
};

createMainPageContent();
