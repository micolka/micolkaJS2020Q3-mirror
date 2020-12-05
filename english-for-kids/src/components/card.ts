/* eslint-disable import/extensions */
import state from '../appState';
import { nextGameStep } from '../gameEngine';
import { createIconHTML, playSound } from '../utils';
import { setTrainClicksCount } from '../statsLogger';

type TCardDataType = {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
};

export function getTrainCardInnerHTML(cardProps:TCardDataType, id:number):string {
  return `
  <div id="${id}" class="card_container card_effects">
  <div class="card_front">
    <img src="./assets/${cardProps.image}" alt="${cardProps.word}">
    <div class="card_bottom">
      <div class="card_info">${cardProps.word}</div>
      <div class="btn_rotate">${createIconHTML('cached')}</div>
    </div>
  </div>
  <div class="card_curtain"></div>
  <div class="card_back">${cardProps.translation}</div>
</div>
`;
}

export function transformCardsMode() {
  const cardBottom:NodeListOf<HTMLElement> = document.querySelectorAll('.card_bottom');
  const text:string = state.isTrainModeOn ? 'flex' : 'none';
  cardBottom.forEach((_, index) => {
    cardBottom[index].style.display = text;
  });
}

export function addListenersToCards(): void {
  const cardsCollection:NodeListOf<HTMLElement> = document.querySelectorAll('.card_container');
  const buttonsCollection:NodeListOf<HTMLElement> = document.querySelectorAll('.btn_rotate');

  cardsCollection.forEach((elem, index) => {
    let isFlipped:boolean = false;
    const card:HTMLElement = elem;
    card.addEventListener('click', (e) => {
      if (e.target !== buttonsCollection[index]
          && e.target !== buttonsCollection[index].firstChild) {
        if (state.isTrainModeOn) {
          playSound(state.currentCollection[index].audioSrc, state.audioInstance);
          if (!state.isRepeatModeOn) setTrainClicksCount(index);
        }
        if (state.isGameStarted) {
          const clickedCard = e.currentTarget as HTMLElement;
          nextGameStep(clickedCard);
        }
      }
    });
    buttonsCollection[index].addEventListener('click', () => {
      card.classList.toggle('active_card');
      card.classList.toggle('card_effects');
      if (!state.isRepeatModeOn) setTrainClicksCount(index);
      setTimeout(() => { isFlipped = true; }, 500);
    });
    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (isFlipped) {
          card.classList.toggle('active_card');
          card.classList.toggle('card_effects');
          isFlipped = false;
        }
      }, 500);
    });
  });
}
