import classNames from 'classnames';
import React, { useEffect, useState, useReducer } from 'react';

import Footer from '@/components/Footer/Footer';
import Graph from '@/components/Graph/Graph';
import Header from '@/components/Header/Header';
import Map from '@/components/Map/Map';
import Stats from '@/components/Stats/Stats';
import Table from '@/components/Table/Table';

import {
  getSummary, getPopulation, getDiseaseAll, getDiseaseCountries,
} from './API/API';
import styles from './assets/stylesheets/index.scss';
import MainPreloader from './components/Preloaders/MainPreloader';
import { appInitialState } from './core/config';
import { ContextApp, initialReducerState, appReducer } from './core/reducer';
import { updateSummaryData, formatSummaryData } from './core/utils';

const App = () => {
  const [summary, setSummary] = useState(appInitialState);
  const [isLoading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(appReducer, initialReducerState);
  const {
    statsF, tableF, graphF, mapF,
  } = state.fullscreen;
  useEffect(() => {
    async function fetchData() {
      try {
        const summaryData = await getSummary();
        const populationData = await getPopulation();
        setSummary({
          ...summaryData,
          Countries: updateSummaryData(summaryData.Countries, populationData),
        });
      } catch (e) {
        const diseaseAllData = await getDiseaseAll();
        const diseaseCountriesData = await getDiseaseCountries();
        setSummary(formatSummaryData(diseaseAllData, diseaseCountriesData));
      }
      setLoading(false);
    }

    if (isLoading) {
      fetchData();
    }
  }, [isLoading]);

  return (
    <div className={classNames(styles['app-wrapper'],
      mapF ? styles['map_full-screen'] : '',
      statsF ? styles['stats_full-screen'] : '',
      tableF ? styles['table_full-screen'] : '',
      graphF ? styles['graph_full-screen'] : '',)}
    >
      {
        isLoading ? (
          <div className={styles['preloader-wrapper']}>
            <MainPreloader />
          </div>
        ) : (
          <React.Fragment>
            <ContextApp.Provider value={{ dispatch, state }}>
              <Header />
              <Map summary={summary} />
              <Stats summary={summary} />
              <Graph summary={summary} />
              <Table summary={summary} />
              <Footer />
            </ContextApp.Provider>
          </React.Fragment>
        )
      }
    </div>
  );
};

export default App;
