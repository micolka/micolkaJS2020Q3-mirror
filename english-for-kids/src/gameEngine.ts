/* eslint-disable import/extensions */
import state from './appState';
import cards from './cardsConfig';
import { genPseudoRandom, playSound } from './utils';

function getCurrentWordIndex() {
  return state.gameStatus.wordsIdList[state.gameStatus.wordsIdList.length - 1];
}

export function playSoundWithDelay(audio:HTMLAudioElement) {
  const cardsData = cards.data[state.currentCollectionIndex];
  const wordIndex:number = getCurrentWordIndex();
  setTimeout(() => {
    playSound(cardsData[wordIndex].audioSrc, audio);
  }, 1000);
}

export function startNewGame(audio:HTMLAudioElement) {
  state.gameStatus.wordsIdList = genPseudoRandom();
  state.isGameStarted = true;
  playSoundWithDelay(audio);
}

export function nextGameStep(target:HTMLElement, audio:HTMLAudioElement) {
  const wordIndex:number = getCurrentWordIndex();
  if (+target.id === wordIndex) {
    playSound('audio/_correct.mp3', audio);
    // карточка становится неактивной
    state.gameStatus.wordsIdList.pop();
    // проверять или конец игры и выкидывать результат
    playSoundWithDelay(audio);
  } else {
    state.gameStatus.mistakesCount += 1;
    playSound('audio/_wrong.mp3', audio);
  }
}
