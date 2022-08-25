import styles from './BuiOptionLabelWithDividerPrefix.module.scss';
import {Divider} from '@mui/material';

const BuiOptionLabelWithDividerPrefix = ({label}:{label:string}) => {
  return <div>
    <div className={styles.textRowContainer}>
      <span aria-hidden className={styles.divider}></span>
      <div className={styles.label}>{label}</div>
    </div>
    <Divider sx={{borderStyle: 'dashed'}}></Divider>
  </div>;
};

export default BuiOptionLabelWithDividerPrefix;
