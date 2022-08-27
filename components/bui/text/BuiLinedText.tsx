import styles from 'components/bui/text/BuiLinedText.module.scss';
import {Divider} from '@mui/material';
import React from 'react';

type BuiLinedTextProps = {
  showVerticalDividerPrefix?:boolean,
  children: React.ReactNode,
}
const BuiLinedText = ({children, showVerticalDividerPrefix = true}: BuiLinedTextProps) => {
  return <div className={`${styles.textRowContainer} ${showVerticalDividerPrefix ? '' : styles.displayInline}`}>
    {showVerticalDividerPrefix ? <span aria-hidden className={styles.divider}></span> : null}
    {children}
    <Divider sx={{borderStyle: 'dashed'}}></Divider>
  </div>;
};

export default BuiLinedText;
