/* eslint-disable import/extensions */
import createIconHTML from '../utils';

type TCardDataType = {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
};

function getCardInnerHTML(cardProps:TCardDataType) {
  return `
  <div class="card_container">
  <div class="card_front">
    <img src="./assets/${cardProps.image}" alt="">
    <div class="card_bottom">
      <div>${cardProps.word}</div>
      <div class="btn_rotate">${createIconHTML('cached')}</div>
    </div>
  </div>
  <div class="card_back">${cardProps.translation}</div>
</div>
`;
}

export default getCardInnerHTML;
