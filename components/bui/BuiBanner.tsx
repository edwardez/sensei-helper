import BuiPaper from './BuiPaper';
import React from 'react';
import styles from './BuiBanner.module.scss';
import {PaperProps} from '@mui/material';
import variables from 'scss/variables.module.scss';

interface BuiBannerConfig {label: string, width?: string, allowSelection?:boolean, backgroundColor?:'primary'|'secondary',}

const BuiBanner = ({label, width= '100%', backgroundColor = 'primary', allowSelection = false,
  ...props}: BuiBannerConfig & PaperProps) => {
  const sxColor = {
    backgroundColor: backgroundColor === 'primary' ? variables.baPrimaryBannerBackgroundColor :
        variables.baSecondaryBannerBackgroundColor,
    color: variables.baTextOnCardTextColor,
  };

  return <BuiPaper {...props} variant={'outlined'}
    sx={{width, ...sxColor}}
    className={`${styles.bannerStyle} ${backgroundColor === 'primary' ? styles.primary : styles.secondary} ${props?.className}
                ${allowSelection ? styles.allowSelection : ''}`}>
    <div>
      {label}
    </div>
  </BuiPaper>;
};

export default BuiBanner;
