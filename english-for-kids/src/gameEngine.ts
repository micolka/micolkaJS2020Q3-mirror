/* eslint-disable import/extensions */
import state from './appState';
import cards from './cardsConfig';
import { genRandomListOfIndexes, playSound } from './utils';

function getCurrentWordIndex() {
  return state.gameStatus.wordsIdList[state.gameStatus.wordsIdList.length - 1];
}

function makeCardInactive(target:HTMLElement) {
  const cardCurtain:HTMLElement = target.querySelector('.card_curtain');
  cardCurtain.style.opacity = '0.7';
  target.classList.add('off');
}

function isGameFinished() {
  return state.gameStatus.wordsIdList.length === 0;
}

function resetGame(rootDiv:HTMLElement) {
  state.currentCollectionIndex = null;
  state.isTrainModeOn = true;
  state.isGameStarted = false;
  state.currentHash = '';
  state.gameStatus = {
    wordsIdList: [],
    mistakesCount: 0,
  };

  const event = new Event('resetMainPage', { bubbles: true });
  rootDiv.dispatchEvent(event);
}

export function showFinalMessage() {
  const rootDiv: HTMLElement = document.querySelector('.cards_wrapper');
  let url:string = '';
  let mistakesMessage:string = '';
  if (state.gameStatus.mistakesCount > 0) {
    playSound('audio/_failure.mp3', state.audioInstance);
    url = '_lose';
    mistakesMessage = `${state.gameStatus.mistakesCount} mistakes`;
  } else {
    playSound('audio/_success.mp3', state.audioInstance);
    url = '_win';
  }
  rootDiv.style.flexDirection = 'column';
  rootDiv.innerHTML = `
    <img src="./assets/img/${url}.png" alt="win">
    <div>${mistakesMessage}</div>
  `;

  setTimeout(() => {
    rootDiv.style.flexDirection = 'row';
    resetGame(rootDiv);
  }, 5000);
}

export function playSoundWithDelay() {
  const cardsData = cards.data[state.currentCollectionIndex];
  const wordIndex:number = getCurrentWordIndex();
  setTimeout(() => {
    playSound(cardsData[wordIndex].audioSrc, state.audioInstance);
  }, 1000);
}

export function startNewGame() {
  state.gameStatus.wordsIdList = genRandomListOfIndexes();
  state.isGameStarted = true;
  playSoundWithDelay();
}

export function nextGameStep(target:HTMLElement) {
  const wordIndex:number = getCurrentWordIndex();
  if (+target.id === wordIndex) {
    playSound('audio/_correct.mp3', state.audioInstance);
    makeCardInactive(target);
    state.gameStatus.wordsIdList.pop();
    if (isGameFinished()) {
      showFinalMessage();
    } else {
      playSoundWithDelay();
    }
  } else {
    state.gameStatus.mistakesCount += 1;
    playSound('audio/_wrong.mp3', state.audioInstance);
  }
}
