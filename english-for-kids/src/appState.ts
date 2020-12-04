type TGameStatus = {
  wordsIdList: number[],
  mistakesCount: number,
};

export type TLogData = {
  clicksCount: number;
  wrongCount: number;
  rightCount: number;
}[][];

export type TCardsData = {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
}[];

type TAppState = {
  currentCollectionIndex: number,
  currentCollection: TCardsData,
  isTrainModeOn: boolean,
  isGameStarted: boolean,
  isRepeatModeOn: boolean,
  currentHash: string,
  audioInstance: HTMLAudioElement,
  gameStatus: TGameStatus,
  logData: TLogData;
};

const state: TAppState = {
  currentCollectionIndex: null,
  currentCollection: null,
  isTrainModeOn: true,
  isGameStarted: false,
  isRepeatModeOn: false,
  currentHash: '',
  audioInstance: undefined,
  gameStatus: {
    wordsIdList: [],
    mistakesCount: 0,
  },
  logData: null,
};

export default state;
