/* eslint-disable import/extensions */
import state from '../appState';
import { createIconHTML } from '../utils';

type TCardDataType = {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
};

export function getTrainCardInnerHTML(cardProps:TCardDataType, id:number):string {
  return `
  <div id="${id}" class="card_container">
  <div class="card_front">
    <img src="./assets/${cardProps.image}" alt="">
    <div class="card_bottom">
      <div class="card_info">${cardProps.word}</div>
      <div class="btn_rotate">${createIconHTML('cached')}</div>
    </div>
  </div>
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
