export const appInitialState = {
  Message: '',
  Global: {
    NewConfirmed: 0,
    TotalConfirmed: 0,
    NewDeaths: 0,
    TotalDeaths: 0,
    NewRecovered: 0,
    TotalRecovered: 0,
  },
  Countries: [],
  Date: '',
};

export const displayParams = {
  NewConfirmed: 'NewConfirmed',
  NewDeaths: 'NewDeaths',
  NewRecovered: 'NewRecovered',
  TotalConfirmed: 'TotalConfirmed',
  TotalDeaths: 'TotalDeaths',
  TotalRecovered: 'TotalRecovered',
};
export const per100th = 100000;
export const allPopulation = 7827000000;
