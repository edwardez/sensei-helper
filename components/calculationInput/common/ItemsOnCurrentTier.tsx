import {Equipment} from 'model/Equipment';
import React from 'react';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {EquipmentsList} from './EquipmentsList';


const ItemsOnCurrentTier = ({
  tier,
  selectedItemId,
  items,
  handleSelectItem,
}: {
    tier: number,
    selectedItemId: string | null,
    items: Equipment[],
    handleSelectItem: (equip: string) => void,
}) => {
  return <>
    <BuiLinedText>{`T${tier}`}</BuiLinedText>
    <EquipmentsList
      selectedEquipId={selectedItemId}
      equipments={items}
      onClick={handleSelectItem} />
  </>;
};

export default ItemsOnCurrentTier;
