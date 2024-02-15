import styles from './EquipmentsInput.module.scss';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import BuiButton from 'components/bui/BuiButton';
import React, {useCallback, useMemo, useState} from 'react';
import EquipmentsSelectionDialog from 'components/calculationInput/equipments/EquipmentsSelectionDialog';
import {Equipment} from 'model/Equipment';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {observer} from 'mobx-react-lite';
import {IWizStore} from 'stores/WizStore';
import {EquipmentInfoToEdit, IRequirementByEquipment} from 'stores/EquipmentsRequirementStore';
import {Tooltip} from '@mui/material';
import PiecesInventory, {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import variables from 'scss/variables.module.scss';
import {useTranslation} from 'next-i18next';
import {
  checkRequirementsSatisfied, calculateRequiredPieces,
} from './inventory/piecesStateCalculator';
import {LabeledEquipmentCard} from './LabeledEquipmentCard';
import {KeyboardDoubleArrowUp} from '@mui/icons-material';

export interface TierCategoryKey{
  tier: number;
  category: string;
}

export const hashTierAndCategoryKey = (key: TierCategoryKey) => `${key.tier}-${key.category}`;

export type EquipmentsByTierAndCategory = Map<string, Equipment>;

const EquipmentsInput = (
    {
      store,
      piecesState,
      equipmentsByTier,
      equipmentsById,
      equipmentsByTierAndCategory,
    }:
        {
          store:IWizStore,
          piecesState: Map<string, PieceState>,
          equipmentsByTier: Map<number, Equipment[]>,
          equipmentsById: EquipmentsById,
          equipmentsByTierAndCategory: EquipmentsByTierAndCategory,
        }
) => {
  const {t} = useTranslation('home');
  const [isAddEquipDialogOpened, setIsAddEquipDialogOpened] = useState(false);

  const [equipInfoToEdit, setEquipInfoToEdit] = useState<EquipmentInfoToEdit|null>(null);

  const handleClickOpen = () => {
    setIsAddEquipDialogOpened(true);
  };

  const handleCloseEquipmentRequirementDialog = () => {
    setIsAddEquipDialogOpened(false);
    setEquipInfoToEdit(null);
  };

  const handleAddEquipmentRequirement = (requirementByEquipment: IRequirementByEquipment) =>{
    store.equipmentsRequirementStore.addEquipmentsRequirement(requirementByEquipment);
    handleCloseEquipmentRequirementDialog();
    setEquipInfoToEdit(null);
  };

  const handleDeleteEquipmentRequirement = (equipmentInfoToEdit: EquipmentInfoToEdit) =>{
    setIsAddEquipDialogOpened(false);
    store.equipmentsRequirementStore.deleteEquipmentsRequirement(equipmentInfoToEdit);
    setEquipInfoToEdit(null);
  };

  const handleUpdateEquipmentRequirement = (equipmentInfoToEdit: EquipmentInfoToEdit) =>{
    setIsAddEquipDialogOpened(false);
    store.equipmentsRequirementStore.updateEquipmentsRequirement(equipmentInfoToEdit);
    setEquipInfoToEdit(null);
  };

  const handleCancelChangeEquipmentRequirement = () =>{
    handleCloseEquipmentRequirementDialog();
  };

  const handleOpenDialogForEditing = useCallback((index: unknown) => {
    if (typeof index !== 'number') return;
    const requirementByEquipment = store.equipmentsRequirementStore.requirementByEquipments[index];
    setEquipInfoToEdit({
      ...requirementByEquipment,
      indexInStoreArray: index,
    });
    setIsAddEquipDialogOpened(true);
  }, [store.equipmentsRequirementStore.requirementByEquipments]);

  const upgradableBadge = useMemo(() => {
    return <>
      <Tooltip title='Upgradable'><KeyboardDoubleArrowUp /></Tooltip>
      {/* <Tooltip title='Starred'><StarBorder /></Tooltip> */}
    </>;
  }, []);

  return <div>
    <EquipmentsSelectionDialog
      key={equipInfoToEdit?.targetEquipmentId ?? '1'}
      isOpened={isAddEquipDialogOpened} equipmentsByTier={equipmentsByTier}
      piecesState={piecesState}
      handleAddEquipmentRequirement={handleAddEquipmentRequirement}
      handleDeleteEquipmentRequirement={handleDeleteEquipmentRequirement}
      handleUpdateEquipmentRequirement={handleUpdateEquipmentRequirement}
      handleCancel={handleCancelChangeEquipmentRequirement}
      equipmentInfoToEdit={equipInfoToEdit}
      equipmentsById={equipmentsById} equipmentsByTierAndCategory={equipmentsByTierAndCategory}/>
    <BuiLinedText>{t('addEquipments')}</BuiLinedText>
    <div className={styles.selectionWrapper}>
      {store.equipmentsRequirementStore.requirementByEquipments.map((requirementByEquip, index) => {
        const isUpgradable = checkRequirementsSatisfied(
            piecesState,
            calculateRequiredPieces(
                equipmentsById,
                equipmentsByTierAndCategory,
                requirementByEquip
            )
        );

        return <LabeledEquipmentCard key={index} index={index}
          showNickname showTier showTierChange
          onClick={handleOpenDialogForEditing}
          equipById={equipmentsById}
          requirement={requirementByEquip}
          badge={isUpgradable ? upgradableBadge : undefined} />;
      })}
      <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
        <div>{t('addButton')}</div>
      </BuiButton>
    </div>
    <BuiLinedText>
      <div>{t('updateInventory')}</div>
      <Tooltip title={t('updateInventoryTip')} enterTouchDelay={0} leaveTouchDelay={5000}>
        <IconButton sx={{color: variables.baPrimaryTextColor}} size={'small'}><InfoOutlinedIcon /></IconButton>
      </Tooltip>
    </BuiLinedText>
    <div className={styles.selectionWrapper}>
      <PiecesInventory piecesState={piecesState} equipmentsById={equipmentsById} />
    </div>
  </div>;
};

export default observer(EquipmentsInput);
