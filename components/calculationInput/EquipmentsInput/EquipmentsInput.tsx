import styles from './EquipmentsInput.module.scss';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import BuiButton from 'components/bui/BuiButton';
import React, {useState} from 'react';
import EquipmentsSelectionDialog from 'components/calculationInput/EquipmentsInput/EquipmentsSelectionDialog';
import {Equipment} from 'model/Equipment';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {observer} from 'mobx-react-lite';
import {IWizStore} from 'stores/WizStore';
import {EquipmentInfoToEdit, IRequirementByEquipment} from 'stores/EquipmentsRequirementStore';
import {Card, CardActionArea} from '@mui/material';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import BuiBanner from 'components/bui/BuiBanner';

const EquipmentsInput = (
    {
      store,
      equipmentsByTier,
      equipmentsById,
    }:
        {
          store:IWizStore,
          equipmentsByTier: Map<number, Equipment[]>,
          equipmentsById: EquipmentsById,
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
      equipmentsById={equipmentsById}/>
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
              <div className={styles.equipmentRow}>
                <EquipmentCard imageName={targetEquip.icon} />
              </div>
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
      <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
        <div>Add</div>
      </BuiButton>
    </div>
  </div>;
};

export default observer(EquipmentsInput);
