import React from 'react';

import RSLogo from '@/assets/img/rs.svg';
import styles from '@/assets/stylesheets/footer.scss';
import GHLogoSrc from '@/static/images/gh.png';

const Footer = () => (
  <div className={styles['footer-wrapper']}>
    <div className={styles['footer-logo-container']}>
      <a className={styles['footer-rs-link']} href="https://rs.school/js/">
        <RSLogo className={styles['footer-RSLogo']} />
      </a>
    </div>
    <div className={styles['footer-link-container']}>
      <a className={styles['footer-link']} href="https://github.com/micolka">
        <img className={styles['footer-GHLogo']} alt="GHLogo" src={GHLogoSrc} />
        <span>Nikolay</span>
      </a>
      <a className={styles['footer-link']} href="https://github.com/Vladimir0087">
        <img className={styles['footer-GHLogo']} alt="GHLogo" src={GHLogoSrc} />
        <span>Vladimir</span>
      </a>
      <a className={styles['footer-link']} href="https://github.com/SashaSadovskaya">
        <img className={styles['footer-GHLogo']} alt="GHLogo" src={GHLogoSrc} />
        <span>Aleksandra</span>
      </a>
    </div>
  </div>
);

export default Footer;
