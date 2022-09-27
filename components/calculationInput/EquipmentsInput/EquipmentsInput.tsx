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
  };

  const handleAddEquipmentRequirement = (requirementByEquipment: IRequirementByEquipment) =>{
    store.equipmentsRequirementStore.addEquipmentsRequirement(requirementByEquipment);
    handleCloseEquipmentRequirementDialog();
  };

  const handleDeleteEquipmentRequirement = (equipmentInfoToEdit: EquipmentInfoToEdit) =>{
    store.equipmentsRequirementStore.deleteEquipmentsRequirement(equipmentInfoToEdit);
  };

  const handleUpdateEquipmentRequirement = (equipmentInfoToEdit: EquipmentInfoToEdit) =>{
    store.equipmentsRequirementStore.updateEquipmentsRequirement(equipmentInfoToEdit);
  };

  const handleCancelChangeEquipmentRequirement = () =>{
    handleCloseEquipmentRequirementDialog();
  };
  return <div >
    <EquipmentsSelectionDialog isOpened={isAddEquipDialogOpened} equipmentsByTier={equipmentsByTier}
      handleAddEquipmentRequirement={handleAddEquipmentRequirement}
      handleDeleteEquipmentRequirement={handleDeleteEquipmentRequirement}
      handleUpdateEquipmentRequirement={handleUpdateEquipmentRequirement}
      handleCancel={handleCancelChangeEquipmentRequirement}
      equipmentsById={equipmentsById} equipmentInfoToEdit={equipInfoToEdit}/>
    <BuiLinedText>Add equipments</BuiLinedText>
    <div className={styles.selectionWrapper}>
      <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
        <div>Add</div>
      </BuiButton>
    </div>
    <BuiLinedText>Add your inventory(optional)</BuiLinedText>
    <div className={styles.selectionWrapper}>
      <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
        <div>Add</div>
      </BuiButton>
    </div>
  </div>;
};

export default observer(EquipmentsInput);
