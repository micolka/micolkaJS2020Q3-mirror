/* eslint-disable import/extensions */
import state, { TLogData } from './appState';
import cards from './cardsConfig';

type TLogObj = {
  clicksCount: number;
  wrongCount: number;
  rightCount: number;
};

class StatsProps {
  clicksCount: number;

  wrongCount: number;

  rightCount: number;

  constructor() {
    this.clicksCount = 0;
    this.wrongCount = 0;
    this.rightCount = 0;
  }
}

export function createStatsData() {
  const logData:TLogData = [];

  cards.data.forEach((collection) => {
    const setArray:Array<TLogObj> = [];
    collection.forEach(() => {
      setArray.push(new StatsProps());
    });
    logData.push(setArray);
  });
  state.logData = logData;
}

export function setTrainClicksCount(index:number) {
  state.logData[state.currentCollectionIndex][index].clicksCount += 1;
}

export function setGameWrongAnswersCount(index:number) {
  state.logData[state.currentCollectionIndex][index].wrongCount += 1;
}

export function setGameCorrectAnswersCount(index:number) {
  state.logData[state.currentCollectionIndex][index].rightCount += 1;
}

export function saveStatsToLocalStorage() {
  localStorage.setItem('appLog', JSON.stringify(state.logData));
}

export function initStatsData() {
  if (localStorage.getItem('appLog')) {
    state.logData = JSON.parse(localStorage.getItem('appLog'));
  } else {
    createStatsData();
  }
}
