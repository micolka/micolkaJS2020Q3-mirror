import classNames from 'classnames';
import React from 'react';

import styles from '@/assets/stylesheets/mainPreloader.scss';

const MainPreloader = () => (
  <div className={styles['cssload-loader']}>
    <div className={classNames(styles['cssload-inner'], styles['cssload-one'])} />
    <div className={classNames(styles['cssload-inner'], styles['cssload-two'])} />
    <div className={classNames(styles['cssload-inner'], styles['cssload-three'])} />
  </div>
);

export default MainPreloader;
