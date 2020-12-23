/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import React, { useState, useContext } from 'react';

import styles from '@/assets/stylesheets/stats.scss';
import ToggleSwitch from '@/components/Switch/Switch';
import { ContextApp } from '@/core/reducer';

import { per100th, allPopulation } from '../../core/config';

const Stats = props => {
  const [checked, setChecked] = useState(false);
  const { summary } = props;
  const { state, dispatch } = useContext(ContextApp);
  const {
    graphF, tableF, mapF, statsF,
  } = state.fullscreen;
  const curCountry = state.currentCountry || {};
  const countryPopulation = curCountry.population;
  const global = summary.Global || {};
  const countryCode = curCountry.CountryCode || '';
  const country = curCountry.Country || 'Global';
  const totalConfirmed = curCountry.TotalConfirmed || global.TotalConfirmed;
  const totalDeaths = curCountry.TotalDeaths || global.TotalDeaths;
  const totalRecovered = curCountry.TotalRecovered || global.TotalRecovered;
  const newConfirmed = curCountry.NewConfirmed || global.NewConfirmed;
  const newDeaths = curCountry.NewDeaths || global.NewDeaths;
  const newRecovered = curCountry.NewRecovered || global.NewRecovered;

  function recalculatePer100th(digit) {
    if (curCountry.Country) return Math.round((digit / countryPopulation) * per100th);
    return Math.round((digit / allPopulation) * per100th);
  }

  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
    dispatch({
      type: 'SET-PER100K-STAT',
    });
  };

  function toggleFullScreen() {
    dispatch({
      type: 'TOGGLE-FULLSCREEN-MODE',
      payload: { statsF: !state.fullscreen.statsF },
    });
  }

  let confirmed = checked ? totalConfirmed : newConfirmed;
  let deaths = checked ? totalDeaths : newDeaths;
  let recovered = checked ? totalRecovered : newRecovered;
  const title = checked ? 'For all time' : 'For one day';
  const population = show ? 'Per 100000 population' : 'For all people';

  if (show) {
    confirmed = recalculatePer100th(confirmed);
    deaths = recalculatePer100th(deaths);
    recovered = recalculatePer100th(recovered);
  }
  const flag = countryCode ? (<img className={styles['stats-flag-img']} alt="flag" src={`https://www.countryflags.io/${countryCode.toLowerCase()}/flat/16.png`} />) : '';

  return (
    <div className={classNames(styles['stats-wrapper'], (graphF || tableF || mapF) ? styles['hide-stats'] : '')}>
      <div className={classNames(styles['fullscreen-container_wrapper'], statsF ? styles['stats-full-screen'] : '')}>
        <div onClick={toggleFullScreen} className={styles.fullScreenButton}>
          <i className="material-icons">{statsF ? 'fullscreen_exit' : 'fullscreen'}</i>
        </div>
        <div className={classNames(styles['stats-main-title'], statsF ? styles['stats-full-screen-title'] : '')}>
          {flag}
          <h2 className={styles['stats-country']}>{country}</h2>
        </div>
        <div className={styles['stats-table']}>
          <h3 className={styles['stats-data-title']}>
            Confirmed:
            <span className={classNames(styles['stats-data'], styles['confirmed'])}>{confirmed}</span>
          </h3>
          <h3 className={styles['stats-data-title']}>
            Deaths:
            <span className={classNames(styles['stats-data'], styles['deaths'])}>{deaths}</span>
          </h3>
          <h3 className={styles['stats-data-title']}>
            Recovered:
            <span className={classNames(styles['stats-data'], styles['recovered'])}>{recovered}</span>
          </h3>
        </div>
        <div className={classNames(styles['stats-toggle-container'], statsF ? styles['stats-toggle-container_fullScreen'] : '')}>
          <h4 className={classNames(styles['stats-title'], styles['stats-title_fullScreen'])}>{title}</h4>
          <ToggleSwitch id="toggleSwitch" checked={checked} onChange={setChecked} />
        </div>
        <div className={classNames(styles['stats-toggle-container'],statsF ? styles['stats-toggle-container_fullScreen'] : '')}>
          <h4 className={classNames(styles['stats-title'], styles['stats-title_fullScreen'])}>{population}</h4>
          <ToggleSwitch id="per100k" checked={show} onChange={handleClick} />
        </div>
      </div>
    </div>
  );
};
export default Stats;
