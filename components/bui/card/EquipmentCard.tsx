import styles from 'components/bui/card/EquipmentCard.module.scss';
import React, {MouseEventHandler} from 'react';
import EquipmentImage from 'components/bui/card/EquipmentImage';
import BuiCard from 'components/bui/BuiCard';
import {CardActionArea} from '@mui/material';


const EquipmentCard = ({imageName, bottomLeftText, bottomRightText, onClick,
  isSelected = false,
  hasOuterMargin = false}:
                           {imageName: string,
                             onClick?: MouseEventHandler,
                             bottomLeftText?:string,
                             bottomRightText?:string,
                             isSelected?: boolean,
                             hasOuterMargin?: boolean}) => {
  const equipmentContent = <React.Fragment>
    <EquipmentImage imageName={imageName} />
    {bottomLeftText ? <div className={styles.bottomLeftText}>{bottomLeftText}</div> :
        null}
    {bottomRightText ? <div className={styles.bottomRightText}>{bottomRightText}</div> :
          null}</React.Fragment>;

  return <BuiCard className={`${hasOuterMargin ? styles.outerMargin : ''} ${isSelected ? 'wiz-selected' : ''}`}>
    {
      onClick ?
          <CardActionArea onClick={onClick} className={'exclude-revert-transform'}>
            <div className={'revert-wiz-transform'}>
              {equipmentContent}
            </div>
          </CardActionArea>:equipmentContent
    }
  </BuiCard>;
};

export default EquipmentCard;
