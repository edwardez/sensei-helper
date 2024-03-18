import styles from 'components/bui/card/EquipmentCard.module.scss';
import React, {MouseEventHandler} from 'react';
import EquipmentImage from 'components/bui/card/EquipmentImage';
import BuiCard from 'components/bui/BuiCard';
import {Box, CardActionArea} from '@mui/material';

const EquipmentCard = ({
  imageName, bottomLeftText, bottomRightText,
  onClick, isSelected = false, hasOuterMargin = false,
}: {
  imageName: string, bottomLeftText?:string, bottomRightText?:string,
  onClick?: MouseEventHandler, isSelected?: boolean, hasOuterMargin?: boolean,
}) => {
  return <BuiCard onClick={onClick}
    className={`${hasOuterMargin ? styles.outerMargin : ''} ${isSelected ? 'wiz-selected' : ''}`}>

    <Box component={onClick ? CardActionArea : 'div'} className='exclude-revert-transform'>
      <div className='revert-wiz-transform'><EquipmentImage imageName={imageName}/></div>
      {bottomLeftText && <div className={styles.bottomLeftText}>{bottomLeftText}</div>}
      {bottomRightText && <div className={styles.bottomRightText}>{bottomRightText}</div>}
    </Box>
  </BuiCard>;
};

export default EquipmentCard;
