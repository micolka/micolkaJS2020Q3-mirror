type TGameStatus = {
  wordsIdList: number[],
  mistakesCount: number,
};

type TAppState = {
  currentCollectionIndex: number,
  isTrainModeOn: boolean,
  isGameStarted: boolean,
  currentHash: string,
  audioInstance: HTMLAudioElement,
  gameStatus: TGameStatus,
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
};

export default state;
