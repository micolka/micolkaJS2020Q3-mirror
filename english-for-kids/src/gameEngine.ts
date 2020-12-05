/* eslint-disable import/extensions */
import state from './appState';
import { addBlackStar, addGoldStar } from './components/stars';
import { saveStatsToLocalStorage, setGameCorrectAnswersCount, setGameWrongAnswersCount } from './statsLogger';
import { genRandomListOfIndexes, getRootElement, playSound } from './utils';

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

export function resetGame() {
  state.currentCollectionIndex = null;
  state.currentCollection = null;
  state.isTrainModeOn = true;
  state.isGameStarted = false;
  state.isRepeatModeOn = false;
  state.currentHash = '/';
  state.gameStatus = {
    wordsIdList: [],
    mistakesCount: 0,
  };
}

export function resetMainPage() {
  resetGame();
  const event = new Event('resetMainPage', { bubbles: true });
  getRootElement().dispatchEvent(event);
}

export function showFinalMessage() {
  const rootDiv: HTMLElement = getRootElement();
  let url:string = '';
  let mistakesMessage:string = '';
  saveStatsToLocalStorage();
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
    resetMainPage();
  }, 5000);
}

export function playSoundWithDelay() {
  const wordIndex:number = getCurrentWordIndex();
  setTimeout(() => {
    playSound(state.currentCollection[wordIndex].audioSrc, state.audioInstance);
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
    addGoldStar();
    state.gameStatus.wordsIdList.pop();
    if (isGameFinished()) {
      showFinalMessage();
    } else {
      playSoundWithDelay();
    }
    if (!state.isRepeatModeOn) setGameCorrectAnswersCount(wordIndex);
  } else {
    state.gameStatus.mistakesCount += 1;
    playSound('audio/_wrong.mp3', state.audioInstance);
    addBlackStar();
    if (!state.isRepeatModeOn) setGameWrongAnswersCount(wordIndex);
  }
}
