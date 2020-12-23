import React from 'react';

import { displayParams } from '@/core/config';

export const ContextApp = React.createContext();

const { TotalConfirmed } = displayParams;

export const initialReducerState = {
  currentCountry: null,
  currentStat: TotalConfirmed,
  per100k: false,
  allTime: true,
  fullscreen: {
    tableF: false,
    mapF: false,
    statsF: false,
    graphF: false,
  },
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET-PER100K-STAT':
      return {
        ...state,
        per100k: !state.per100k,
      };
    case 'SET-ALLTIME-STAT':
      return {
        ...state,
        allTime: !state.allTime,
      };
    case 'SET-CURRENT-COUNTRY':
      return {
        ...state,
        currentCountry: action.payload,
      };
    case 'SET-DISPLAY-STAT':
      return {
        ...state,
        currentStat: action.payload,
      };
    case 'TOGGLE-FULLSCREEN-MODE':
      return {
        ...state,
        fullscreen: { ...state.fullscreen, ...action.payload },
      };
    default:
      return state;
  }
};
