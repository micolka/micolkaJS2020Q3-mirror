type TGameStatus = {
  wordsIdList: number[],
  mistakesCount: number,
};

export type TLogData = {
  clicksCount: number;
  wrongCount: number;
  rightCount: number;
}[][];

type TAppState = {
  currentCollectionIndex: number,
  isTrainModeOn: boolean,
  isGameStarted: boolean,
  currentHash: string,
  audioInstance: HTMLAudioElement,
  gameStatus: TGameStatus,
  logData: TLogData;
};

const state: TAppState = {
  currentCollectionIndex: null,
  isTrainModeOn: true,
  isGameStarted: false,
  currentHash: '',
  audioInstance: undefined,
  gameStatus: {
    wordsIdList: [],
    mistakesCount: 0,
  },
  logData: null,
};

export default state;
