import {Equipment} from 'model/Equipment';
import styles from 'components/calculationInput/common/ItemsOnCurrentTier.module.scss';
import React from 'react';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import EquipmentCard from 'components/bui/card/EquipmentCard';


const ItemsOnCurrentTier = ({tier, selectedItemId, items, handleSelectItem}:
                                 {
                                     tier: number,
                                     selectedItemId: string | null,
                                     items: Equipment[],
                                     handleSelectItem: Function,
                                 }) => {
  return (
    <>
      <BuiLinedText>{`T${tier}`}</BuiLinedText>
      <div className={styles.currentTierItemsRow}>
        {items.map(function(item) {
          return (<div key={item.id} className={styles.paperOuterMargin}>
            <EquipmentCard imageName={item.icon} onClick={() => handleSelectItem(item.id)}
              isSelected={selectedItemId === item.id}/></div>);
        })}
      </div>
    </>
  );
};

export default ItemsOnCurrentTier;
