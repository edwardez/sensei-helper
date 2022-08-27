import BuiPaper from './BuiPaper';
import React from 'react';
import styles from './BuiBanner.module.scss';
import {PaperProps} from '@mui/material';

interface BuiBannerConfig {label: string, width?: string, allowSelection?:boolean, backgroundColor?:'primary'|'secondary',}

const BuiBanner = ({label, width= '100%', backgroundColor = 'primary', allowSelection = false,
  ...props}: BuiBannerConfig & PaperProps) => {
  return <BuiPaper {...props} variant={'outlined'}
    className={`${styles.bannerStyle} ${styles[backgroundColor]} ${props?.className}
                ${allowSelection ? styles.allowSelection : ''}`}
    sx={{width}}>
    <div>
      {label}
    </div>
  </BuiPaper>;
};

export default BuiBanner;
