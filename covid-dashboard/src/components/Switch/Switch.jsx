import React from 'react';

import styles from '@/assets/stylesheets/switch.scss';

const ToggleSwitch = ({ id, checked, onChange }) => (
  <div className={styles['toggle-switch']}>
    <input
      type="checkbox"
      className={styles['toggle-switch-checkbox']}
      name={id}
      id={id}
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      content={id}
    />
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label className={styles['toggle-switch-label']} htmlFor={id}>
      <span className={styles['toggle-switch-inner']} />
      <span className={styles['toggle-switch-switch']} />
    </label>
  </div>
);

export default ToggleSwitch;
