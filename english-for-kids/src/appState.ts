type TGameStatus = {
  wordsIdList: number[],
  mistakesCount: number,
};

type TAppState = {
  currentCollectionIndex: number,
  isTrainModeOn: boolean,
  isGameStarted: boolean,
  currentHash: string,
  gameStatus: TGameStatus,
};

const state: TAppState = {
  currentCollectionIndex: null,
  isTrainModeOn: true,
  isGameStarted: false,
  currentHash: '',
  gameStatus: {
    wordsIdList: [],
    mistakesCount: 0,
  },
};

export default state;
