import styles from './EquipmentsInput.module.scss';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import BuiButton from 'components/bui/BuiButton';
import React, {useState} from 'react';
import EquipmentsSelectionDialog from 'components/calculationInput/equipments/EquipmentsSelectionDialog';
import {Equipment} from 'model/Equipment';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {observer} from 'mobx-react-lite';
import {IWizStore} from 'stores/WizStore';
import {EquipmentInfoToEdit, IRequirementByEquipment} from 'stores/EquipmentsRequirementStore';
import {Card, CardActionArea} from '@mui/material';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import BuiBanner from 'components/bui/BuiBanner';
import PiecesInventory, {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';

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

  const handleOpenDialogForEditing = (requirementByEquipment: IRequirementByEquipment, index: number) => {
    setEquipInfoToEdit(
        {
          ...requirementByEquipment,
          indexInStoreArray: index,
        }
    );
    setIsAddEquipDialogOpened(true);
  };
  return <div>
    <EquipmentsSelectionDialog
      key={equipInfoToEdit?.targetEquipmentId ?? '1'}
      isOpened={isAddEquipDialogOpened} equipmentsByTier={equipmentsByTier}
      handleAddEquipmentRequirement={handleAddEquipmentRequirement}
      handleDeleteEquipmentRequirement={handleDeleteEquipmentRequirement}
      handleUpdateEquipmentRequirement={handleUpdateEquipmentRequirement}
      handleCancel={handleCancelChangeEquipmentRequirement}
      equipmentInfoToEdit={equipInfoToEdit}
      equipmentsById={equipmentsById} equipmentsByTierAndCategory={equipmentsByTierAndCategory}/>
    <BuiLinedText>Add equipments</BuiLinedText>
    <div className={styles.selectionWrapper}>
      {store.equipmentsRequirementStore.requirementByEquipments.map((requirementByEquip, index) => {
        const currentEquip = equipmentsById.get(requirementByEquip.currentEquipmentId);
        const targetEquip = equipmentsById.get(requirementByEquip.targetEquipmentId);

        if (!currentEquip || !targetEquip) return null;
        const tierUpgradeText = `T${currentEquip.tier}→T${targetEquip.tier}`;

        return <Card key={index} elevation={1}
          onClick={() => handleOpenDialogForEditing(requirementByEquip, index)}>
          <CardActionArea>
            <div className={styles.selectedPiecePaper}>
              <EquipmentCard imageName={targetEquip.icon} />
              <BuiBanner label={tierUpgradeText} width={'120%'} />
              <BuiBanner label={requirementByEquip.count.toString()} width={'120%'}/>
            </div>
          </CardActionArea>
        </Card>;
      })}
      <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
        <div>Add</div>
      </BuiButton>
    </div>
    <BuiLinedText>Update your inventory(optional)</BuiLinedText>
    <div className={styles.selectionWrapper}>
      <PiecesInventory piecesState={piecesState} equipmentsById={equipmentsById} />
    </div>
  </div>;
};

export default observer(EquipmentsInput);
