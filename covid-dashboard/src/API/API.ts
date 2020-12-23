import {
  TCountry,
  TAllStatus,
  TSummary,
  TTimeline,
  TWorldTotalWIP,
  TPopulation,
  TDiseaseAll,
  TDiseaseCountries,
} from './APITypes';

export const API = {
  URL: 'https://api.covid19api.com',
  URL1: 'https://covid19-api.org/api/timeline',
  URLDisease: 'https://disease.sh/v3/covid-19',
  URLCountries: 'https://restcountries.eu/rest/v2/all?fields=name;population;alpha2Code',
  ENDPOINTS: {
    ALL: 'all',
    DATE: 'date',
    CONFIRMED: 'confirmed',
    COUNTRIES: 'countries',
    COUNTRY: 'country',
    DAYONE: 'dayone',
    LIVE: 'live',
    SUMMARY: 'summary',
    STATUS: 'status',
    TOTAL: 'total',
    WORLD: 'world',
  },
};

export const getCountries = async (): Promise<TCountry[]> => {
  const { URL, ENDPOINTS } = API;
  const response = await fetch(`${URL}/${ENDPOINTS.COUNTRIES}`);
  return (await response.json()) as TCountry[];
};

export const getSummary = async (): Promise<TSummary> => {
  const { URL, ENDPOINTS } = API;
  const response = await fetch(`${URL}/${ENDPOINTS.SUMMARY}`);
  return (await response.json()) as TSummary;
};

export const getPopulation = async (): Promise<TPopulation[]> => {
  const response = await fetch(`${API.URLCountries}`);
  return (await response.json()) as TPopulation[];
};

export const getDayOneTotalAllStatus = async (name: string): Promise<TAllStatus[]> => {
  const { URL, ENDPOINTS } = API;
  const { DAYONE, COUNTRY, TOTAL } = ENDPOINTS;

  const response = await fetch(`${URL}/${TOTAL}/${DAYONE}/${COUNTRY}/${name}`);
  return (await response.json()) as TAllStatus[];
};

export const getByCountryAllStatus = async (
  name: string,
  from: string,
  to: string
): Promise<TAllStatus[]> => {
  const { URL, ENDPOINTS } = API;
  const { COUNTRY } = ENDPOINTS;

  const response = await fetch(`${URL}/${COUNTRY}/${name}?from=${from}&to=${to}`);
  return (await response.json()) as TAllStatus[];
};

export const getWorldTimeline = async (): Promise<TTimeline[]> => {
  const { URL1 } = API;
  const response = await fetch(`${URL1}`);
  return (await response.json()) as TTimeline[];
};

export const getWorldTotalWIP = async (): Promise<TWorldTotalWIP> => {
  const { URL, ENDPOINTS } = API;
  const { WORLD, TOTAL } = ENDPOINTS;

  const response = await fetch(`${URL}/${WORLD}/${TOTAL}`);
  return (await response.json()) as TWorldTotalWIP;
};

export const getDiseaseAll = async (): Promise<TDiseaseAll> => {
  const { URLDisease, ENDPOINTS } = API;
  const response = await fetch(`${URLDisease}/${ENDPOINTS.ALL}`);
  return (await response.json()) as TDiseaseAll;
};

export const getDiseaseCountries = async (): Promise<TDiseaseCountries> => {
  const { URLDisease, ENDPOINTS } = API;
  const response = await fetch(`${URLDisease}/${ENDPOINTS.COUNTRIES}`);
  return (await response.json()) as TDiseaseCountries;
};
