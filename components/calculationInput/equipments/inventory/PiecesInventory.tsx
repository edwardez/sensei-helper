import styles from './PiecesInventory.module.scss';
import {Card, CardActionArea} from '@mui/material';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import BuiBanner from 'components/bui/BuiBanner';
import React, {useMemo, useState} from 'react';
import {IPieceInventory} from 'stores/EquipmentsRequirementStore';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import InventoryUpdateDialog, {
  InventoryForm,
} from 'components/calculationInput/equipments/inventory/InventoryUpdateDialog';
import BuiButton from 'components/bui/BuiButton';
import {useStore} from 'stores/WizStore';
import {observer} from 'mobx-react-lite';

export type PieceState = IPieceInventory & {
  needCount: number;
}

const PiecesInventory = (
    {
      piecesState,
      equipmentsById,
    } : {
      piecesState: Map<string, PieceState>
      equipmentsById: EquipmentsById,
    }
) => {
  const store = useStore();

  const pieces = useMemo(() => Array.from(piecesState.values()), [piecesState]);
  const [piecesToUpdate, setPiecesToUpdate] = useState(pieces);
  const [isUpdateInventoryDialogOpened, setIsUpdateInventoryDialogOpened] = useState(false);

  const openSinglePieceUpdateDialog = (inventory: PieceState) =>{
    setPiecesToUpdate([inventory]);
    setIsUpdateInventoryDialogOpened(true);
  };

  const openAllInventoryUpdateDialog = () =>{
    setPiecesToUpdate(pieces);
    setIsUpdateInventoryDialogOpened(true);
  };

  const handleCancelUpdateInventory = () => {
    setIsUpdateInventoryDialogOpened(false);
  };
  const handleUpdateInventory = (inventoryForm: InventoryForm) => {
    store.equipmentsRequirementStore.updateInventory(inventoryForm);
    setIsUpdateInventoryDialogOpened(false);
  };

  return <>
    {
      isUpdateInventoryDialogOpened ? <InventoryUpdateDialog pieces={piecesToUpdate}
        onCancel={handleCancelUpdateInventory}
        onUpdate={handleUpdateInventory}
        equipmentsById={equipmentsById}
        isOpened={isUpdateInventoryDialogOpened} /> : null
    }
    {
      pieces.map((inventory, index) => {
        const piece = equipmentsById.get(inventory.pieceId);
        if (!piece) return null;

        return <Card key={index} elevation={1}
          onClick={() => openSinglePieceUpdateDialog(inventory)}>
          <CardActionArea>
            <div className={styles.piecesList}>
              <EquipmentCard imageName={piece.icon} bottomRightText={`x${inventory.inStockCount}`}/>
              <BuiBanner label={inventory.needCount.toString()} width={'120%'} />
            </div>
          </CardActionArea>
        </Card>;
      })
    }
    <div className={styles.editButton}>
      <BuiButton color={'baButtonSecondary'} onClick={openAllInventoryUpdateDialog}
        disabled={pieces.length === 0}>
        <div>Edit</div>
      </BuiButton>
    </div>
  </>;
};

export default observer(PiecesInventory);
