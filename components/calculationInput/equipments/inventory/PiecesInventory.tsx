import styles from './PiecesInventory.module.scss';
import React, {useCallback, useMemo, useState} from 'react';
import {IPieceInventory} from 'stores/EquipmentsRequirementStore';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import InventoryUpdateDialog, {
  InventoryForm,
} from 'components/calculationInput/equipments/inventory/InventoryUpdateDialog';
import BuiButton from 'components/bui/BuiButton';
import {useStore} from 'stores/WizStore';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'next-i18next';
import {LabeledEquipmentCard} from '../LabeledEquipmentCard';
import {Done} from '@mui/icons-material';

export type PieceState = IPieceInventory & {
  needCount: number;
}

// For performance reason, shows the first 20 pieces only by default.
const defaultMaxVisiblePiecesCount = 20;
const PiecesInventory = (
    {
      piecesState,
      equipmentsById,
    } : {
      piecesState: Map<string, PieceState>
      equipmentsById: EquipmentsById,
    }
) => {
  const {t} = useTranslation('home');
  const store = useStore();

  const pieces = useMemo(() => {
    return Array.from(piecesState.values())
        .sort((a, b) => a.pieceId > b.pieceId ? -1 : 1);
  }, [piecesState]);
  // Only pieces that have non 0 stock count are visible.
  const homePageVisiblePieces = useMemo(() => {
    const ordering = (piece: PieceState) => piece.needCount <= piece.inStockCount ? 1 : 0;
    return pieces.filter((piece) => piece.inStockCount > 0)
        .sort((a, b) => ordering(a) - ordering(b));
  }, [pieces]);
  const [piecesToUpdate, setPiecesToUpdate] = useState(pieces);
  const [showAllPieces, setShowAllPieces] = useState(homePageVisiblePieces.length <= defaultMaxVisiblePiecesCount);

  const [isUpdateInventoryDialogOpened, setIsUpdateInventoryDialogOpened] = useState(false);

  const openSinglePieceUpdateDialog = useCallback((_: unknown, inventory: PieceState) =>{
    setPiecesToUpdate([inventory]);
    setIsUpdateInventoryDialogOpened(true);
  }, []);

  const openAllInventoryUpdateDialog = useCallback(() => {
    setPiecesToUpdate(pieces);
    setIsUpdateInventoryDialogOpened(true);
  }, [pieces]);

  const handleCancelUpdateInventory = () => {
    setIsUpdateInventoryDialogOpened(false);
  };
  const handleUpdateInventory = (inventoryForm: InventoryForm) => {
    store.equipmentsRequirementStore.updateInventory(inventoryForm);
    setIsUpdateInventoryDialogOpened(false);
  };
  const toggleShowAllPieces = () => {
    setShowAllPieces(!showAllPieces);
  };

  const computeMaximumPiecesToShow = () => {
    if (showAllPieces) return homePageVisiblePieces;
    return homePageVisiblePieces.slice(0, defaultMaxVisiblePiecesCount);
  };

  const checkBadge = useMemo(() => {
    return <Done />;
  }, []);

  return <>
    {
      isUpdateInventoryDialogOpened ? <InventoryUpdateDialog pieces={piecesToUpdate}
        onCancel={handleCancelUpdateInventory}
        onUpdate={handleUpdateInventory}
        equipmentsById={equipmentsById}
        isOpened={isUpdateInventoryDialogOpened} /> : null
    }
    {computeMaximumPiecesToShow().map((inventory, index) => {
      if (inventory.inStockCount <= 0) return null;

      const enough = inventory.needCount <= inventory.inStockCount;

      return <LabeledEquipmentCard key={index} index={inventory}
        showStockCount showNeedCount
        onClick={openSinglePieceUpdateDialog}
        equipById={equipmentsById} pieceState={inventory}
        badge={enough ? checkBadge : undefined} />;
    })}
    {
      homePageVisiblePieces.length > defaultMaxVisiblePiecesCount ? <div className={styles.editButton}>
        <BuiButton variant={'text'} color={'baTextButtonPrimary'} onClick={toggleShowAllPieces}
          disabled={pieces.length === 0}>
          <div>{showAllPieces ? t('showFewerButton') : t('showAllButton')}</div>
        </BuiButton>
      </div>: null
    }
    <div className={styles.editButton}>
      <BuiButton color={'baButtonSecondary'} onClick={openAllInventoryUpdateDialog}
        disabled={pieces.length === 0}>
        <div>{t('editButton')}</div>
      </BuiButton>
    </div>
  </>;
};

export default observer(PiecesInventory);
