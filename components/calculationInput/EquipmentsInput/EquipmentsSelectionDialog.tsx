import styles from 'components/calculationInput/EquipmentsInput/EquipmentsSelectionDialog.module.scss';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import React, {useEffect, useMemo} from 'react';
import {EquipmentInfoToEdit, IRequirementByEquipment,} from 'stores/EquipmentsRequirementStore';
import BuiButton from 'components/bui/BuiButton';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import ItemsOnCurrentTier from 'components/calculationInput/PiecesSelection/ItemsOnCurrentTier';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import TargetEquipmentSelection from 'components/calculationInput/EquipmentsInput/TargetEquipmentSelection';
import {useForm} from 'react-hook-form';
import PositiveIntegerOnlyInput from 'components/calculationInput/common/PositiveIntegerOnlyInput';
import {useTranslation} from 'next-i18next';


interface IFormInputs {
  neededEquipmentsCount: string
}

const neededEquipmentsCountField = 'neededEquipmentsCount';

type EquipmentsSelectionDialogPros = {
  isOpened: boolean,
  equipmentsById: EquipmentsById,
  equipmentsByTier: Map<number, Equipment[]>,
  handleAddEquipmentRequirement: (requirementByEquipment: IRequirementByEquipment) => void,
  handleUpdateEquipmentRequirement: (equipmentInfoToEdit: EquipmentInfoToEdit) => void,
  handleDeleteEquipmentRequirement: (equipmentInfoToEdit: EquipmentInfoToEdit) => void,
  handleCancel: () => void,
  // An entity denotes a pre-selected equipment.
  // Setting this means dialog will be used for editing existing selection.
  equipmentInfoToEdit: EquipmentInfoToEdit|null,
}

const EquipmentsSelectionDialog = (
    {isOpened, equipmentInfoToEdit, equipmentsByTier, equipmentsById,
      handleAddEquipmentRequirement,
      handleUpdateEquipmentRequirement,
      handleDeleteEquipmentRequirement,
      handleCancel,
    } : EquipmentsSelectionDialogPros
) => {
  const {t} = useTranslation('home');
  const theme = useTheme();
  const {
    control,
    formState: {isValid: isCountValid, errors: countErrors},
    getValues,
    setValue,
    reset,
  } = useForm<IFormInputs>({
    mode: 'onChange',
    defaultValues: {neededEquipmentsCount: equipmentInfoToEdit?.count?.toString() ?? '1'},
  });
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStepNum, setActiveStepNum] = React.useState(0);
  const [currentEquipId, setCurrentEquipId] = React.useState<string|null>(null);
  const [targetEquipId, setTargetEquipId] = React.useState<string|null>(null);

  useEffect(() => {
    if (!isOpened) {
      return resetFormValues();
    }
  }, [isOpened]);

  const allTiers = useMemo(() => Array.from(equipmentsByTier.keys()).reverse(), [equipmentsByTier]);
  const overallMaxTier = useMemo(() => Math.max(...allTiers), [allTiers]);
  const availableTargetEquipments = useMemo(() => {
    const baseEquipment = equipmentsById.get(currentEquipId ?? '');
    if (!baseEquipment) return [];
    const category = baseEquipment.category;
    const equipmentsBuilder = [];
    for (let i = baseEquipment.tier+1; i<=overallMaxTier; i++) {
      const equipsOnCurrentTier = equipmentsByTier.get(i);
      if (!equipsOnCurrentTier) continue;
      const targetEquip = equipsOnCurrentTier
          .find((equip) =>
            equip.category === category &&
                  equip.equipmentCompositionType === EquipmentCompositionType.Composite);
      if (!targetEquip) continue;
      equipmentsBuilder.push(targetEquip);
    }

    return equipmentsBuilder;
  }
  , [overallMaxTier, currentEquipId, equipmentsById, equipmentsByTier]);

  const maxTierPerCategory = useMemo(() => {
    const maxTierPerCategoryBuilder: {[key : string]: number} = {};
    for (const tier of allTiers) {
      const equipments = equipmentsByTier.get(tier);
      if (!equipments) continue;
      for (const equipment of equipments) {
        if (maxTierPerCategoryBuilder[equipment.category]) {
          continue;
        }
        maxTierPerCategoryBuilder[equipment.category] = equipment.tier;
      }
    }
    equipmentsByTier.forEach(([tier, equipments]) => {
    });

    return maxTierPerCategoryBuilder;
  }, [allTiers, equipmentsByTier]);

  const isFormValid = () =>isCountValid && !!currentEquipId && !!targetEquipId;

  const steps = [
    {
      label: 'Set the current equipment to upgrade',
    },
    {
      label: 'Set target equipment',
    },
  ];

  const handleBack = () => {
    setActiveStepNum((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDialogCancel = () => {
    handleCancel();
  };

  const handleSelectEquipment = (equipmentId: string) =>{
    setCurrentEquipId(equipmentId);
    setActiveStepNum(1);
  };

  const onTargetEquipmentChanged = (equipment: Equipment) => {
    setTargetEquipId(equipment.id);
  };

  const handleAddOrUpdateEquipmentOnClose = () =>{
    if (!currentEquipId || !targetEquipId) return;

    if (equipmentInfoToEdit) {
      handleUpdateEquipmentRequirement({
        currentEquipmentId: currentEquipId,
        targetEquipmentId: targetEquipId,
        count: parseInt(getValues().neededEquipmentsCount) ?? 1,
        indexInStoreArray: equipmentInfoToEdit.indexInStoreArray,
      });
    } else {
      handleAddEquipmentRequirement({
        currentEquipmentId: currentEquipId,
        targetEquipmentId: targetEquipId,
        count: parseInt(getValues().neededEquipmentsCount) ?? 1,
      });
    }
  };

  const handleDeletePieceRequirementOnClose = () => {
    if (!currentEquipId || !targetEquipId || !equipmentInfoToEdit) return;

    handleDeleteEquipmentRequirement({
      currentEquipmentId: currentEquipId,
      targetEquipmentId: targetEquipId,
      count: parseInt(getValues().neededEquipmentsCount) ?? 1,
      indexInStoreArray: equipmentInfoToEdit.indexInStoreArray,
    });
  };

  const resetFormValues = () => {
    setCurrentEquipId(null);
    setTargetEquipId(null);
    setActiveStepNum(0);
    reset();
  };

  const onStepClick = (stepIndex: number) => {
    if (stepIndex !== 0 || !currentEquipId) return;

    if (activeStepNum == 0) {
      setActiveStepNum(1);
    } else {
      setActiveStepNum(0);
    }
  };


  const generateStepContent = (stepNumber: number) => {
    const baseEquipment = equipmentsById.get(currentEquipId ?? '');

    switch (stepNumber) {
      case 0:
        return equipmentsByTier ?
            Array.from(equipmentsByTier.keys()).map(
                (tier) => {
                  const equipmentsOnTier = equipmentsByTier.get(tier);
                  if (!equipmentsOnTier) return null;

                  // Filters out equipments that cannot be upgraded further
                  const filterEquipmentsOnTier = equipmentsOnTier.filter(
                      (equipment) => equipment.tier < maxTierPerCategory[equipment.category]
                  );
                  return tier === overallMaxTier ?
                      <div key={tier}>
                        <BuiLinedText>T{tier}</BuiLinedText>
                        <Typography sx={{color: 'text.disabled'}} variant={'subtitle1'}>Cannot upgrade further</Typography>
                      </div> :
                      <ItemsOnCurrentTier key={tier} tier={tier} items={filterEquipmentsOnTier} selectedItemId={currentEquipId}
                        handleSelectItem={handleSelectEquipment}/>;
                }
            ) : <CircularProgress />;
      case 1:
      default:
        if (!baseEquipment) return <div></div>;
        return <>
          <TargetEquipmentSelection baseEquipment={baseEquipment}
            availableTargetEquipments={availableTargetEquipments}

            onEquipmentChanged={onTargetEquipmentChanged}/>

          <BuiButton
            color={'baButtonSecondary'}
            disabled={stepNumber === 0}
            onClick={handleBack}>
            Reselect
          </BuiButton>
        </>;
    }
  };

  const buildStepLabel = (stepNumber: number, stepLabel: string) =>{
    if (currentEquipId === null || stepNumber !== 0) {
      return <>{stepLabel}</>;
    }

    const imageName = equipmentsById.get(currentEquipId)?.icon ?? '';
    return <Box display='flex' alignContent='center' alignItems='center'>
      <Box sx={{mr: 1}}>{stepLabel}</Box>
      <EquipmentCard imageName={imageName}/>
    </Box>;
  };

  return <Dialog open={isOpened} fullScreen={isFullScreen}
    keepMounted onClose={handleDialogCancel}>
    <DialogTitle>
      <Box display={'flex'}>
        <Box>Select Equipment</Box>
        <Box flexGrow={'1'}></Box>
        {equipmentInfoToEdit ? <Box><Button color={'error'} onClick={()=>{}}>
              delete</Button></Box> :
            null}

      </Box>
    </DialogTitle>


    <DialogContent>
      <Stepper activeStep={activeStepNum} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label} >
            <StepButton onClick={() => onStepClick(index)}>
              {buildStepLabel(index, step.label)}
            </StepButton>
            <StepContent>
              <Box sx={{mb: 1.5}}/>
              {generateStepContent(index)}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </DialogContent>

    <DialogActions>
      <PositiveIntegerOnlyInput<IFormInputs> name={neededEquipmentsCountField}
        control={control} showError={!!countErrors.neededEquipmentsCount}
        helperText={countErrors.neededEquipmentsCount?.message ?? ''} />

      <div className={styles.filler}></div>
      <Button onClick={handleDialogCancel}>{t('cancelButton')}</Button>
      <Button onClick={handleAddOrUpdateEquipmentOnClose} disabled={!isFormValid()}>
        {equipmentInfoToEdit ? t('updateButton') : t('addButton')}
      </Button>
    </DialogActions>
  </Dialog>;
};

export default EquipmentsSelectionDialog;
