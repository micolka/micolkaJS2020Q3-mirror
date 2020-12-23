/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import React, { useState, useContext, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import { getDayOneTotalAllStatus, getWorldTimeline } from '@/API/API';
import styles from '@/assets/stylesheets/graph.scss';
import { displayParams } from '@/core/config';
import { ContextApp } from '@/core/reducer';

const Graph = () => {
  const { state, dispatch } = useContext(ContextApp);
  const [graphData, setGraphData] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const { TotalConfirmed, TotalDeaths, TotalRecovered } = displayParams;
  const {
    statsF, tableF, mapF, graphF,
  } = state.fullscreen;

  async function getCountryDataForAllTime() {
    let response = await getDayOneTotalAllStatus(state.currentCountry.Country);
    response = response.map(elem => {
      const newDate = new Date(elem.Date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      return { ...elem, Date: newDate };
    });
    setGraphData(response);
  }

  async function getWorldDataForAllTime() {
    let response = await getWorldTimeline();
    response = response.map(elem => {
      const newDate = new Date(elem.last_update).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      return {
        Recovered: elem.total_recovered,
        Deaths: elem.total_deaths,
        Confirmed: elem.total_cases,
        Date: newDate,
      };
    });
    setGlobalData(response);
    setGraphData(response.reverse());
  }

  function getDataKey() {
    switch (state.currentStat) {
      case TotalConfirmed: return 'Confirmed';
      case TotalDeaths: return 'Deaths';
      case TotalRecovered: return 'Recovered';
      default: return '';
    }
  }

  function toggleFullScreen() {
    dispatch({
      type: 'TOGGLE-FULLSCREEN-MODE',
      payload: { graphF: !state.fullscreen.graphF },
    });
  }

  useEffect(() => {
    if (state.currentCountry) {
      getCountryDataForAllTime();
    } else if (globalData) {
      setGraphData(globalData);
    } else {
      getWorldDataForAllTime();
    }
  }, [state]);

  return (
    <div id="graph" className={classNames(styles['graph-wrapper'], (statsF || tableF || mapF) ? styles['hide-graph'] : '')}>
      <div className={styles['fullscreen-container_wrapper']}>
        <div onClick={toggleFullScreen} className={styles.fullScreenButton}>
          <i className="material-icons">{graphF ? 'fullscreen_exit' : 'fullscreen'}</i>
        </div>
        <ResponsiveContainer width="95%" height="95%">
          <BarChart
            width={480}
            height={400}
            data={graphData}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {state.currentCountry
              ? (<Bar dataKey={getDataKey()} stackId="a" fill=" #e60000" />)
              : (<Bar dataKey={getDataKey()} stackId="a" fill="#ffaa00" />)}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;
