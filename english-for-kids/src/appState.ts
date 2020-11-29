type TAppState = {
  currentCollectionIndex: number,
  isTrainModeOn: boolean,
  currentHash: string,
};

const state: TAppState = {
  currentCollectionIndex: null,
  isTrainModeOn: true,
  currentHash: '',
};

export default state;
