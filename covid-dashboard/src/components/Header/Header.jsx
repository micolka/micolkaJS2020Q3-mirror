/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import React, { useContext } from 'react';

import styles from '@/assets/stylesheets/header.scss';
import { ContextApp } from '@/core/reducer';
import VirusSrc from '@/static/images/virus.png';

const Header = () => {
  const { state, dispatch } = useContext(ContextApp);

  function resetToGlobal() {
    dispatch({
      type: 'SET-CURRENT-COUNTRY',
      payload: null,
    });
  }

  return (
    <div className={styles['header-wrapper']}>
      <div className={styles['logo-wrapper']}>
        <h1 onClick={resetToGlobal} className={styles['header-title']}>COVID-19 Dashboard</h1>
        <img onClick={resetToGlobal} className={styles['header-logo']} alt="virus" src={VirusSrc} />
      </div>
      <div onClick={resetToGlobal} className={classNames(styles.header_button)}>Show global</div>
    </div>
  );
};

export default Header;
