/* eslint-disable max-len */
import styles from 'components/calculationInput/equipments/EquipmentsSelectionDialog.module.scss';
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
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import React, {useEffect, useMemo, useState} from 'react';
import {EquipmentInfoToEdit, IRequirementByEquipment} from 'stores/EquipmentsRequirementStore';
import BuiButton from 'components/bui/BuiButton';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import ItemsOnCurrentTier from 'components/calculationInput/common/ItemsOnCurrentTier';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import TargetEquipmentSelection from 'components/calculationInput/equipments/TargetEquipmentSelection';
import {useForm} from 'react-hook-form';
import PositiveIntegerOnlyInput from 'components/calculationInput/common/PositiveIntegerOnlyInput';
import {useTranslation} from 'next-i18next';
import {usePrevious} from 'common/hook';
import {
  EquipmentsByTierAndCategory,
  hashTierAndCategoryKey,
} from 'components/calculationInput/equipments/EquipmentsInput';
import NickNameInput from 'components/calculationInput/equipments/EquipmentDialog/NickNameInput';
import {observer} from 'mobx-react-lite';
import {useStore} from 'stores/WizStore';
import {calculateRequirementAmount} from 'components/calculationInput/equipments/inventory/piecesStateCalculator';
import UpgradeConfirmationDialog from './UpgradeConfirmationDialog';
import {PieceState} from './inventory/PiecesInventory';


export interface IEquipmentFormInputs {
  neededEquipmentsCount: string;
  nickname: string;
}

const neededEquipmentsCountField = 'neededEquipmentsCount';
const nicknameField = 'nickname';


type EquipmentsSelectionDialogPros = {
  isOpened: boolean,
  equipmentsById: EquipmentsById,
  equipmentsByTier: Map<number, Equipment[]>,
  equipmentsByTierAndCategory: EquipmentsByTierAndCategory,
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
      equipmentsByTierAndCategory,
      handleAddEquipmentRequirement,
      handleUpdateEquipmentRequirement,
      handleDeleteEquipmentRequirement,
      handleCancel,
    } : EquipmentsSelectionDialogPros
) => {
  const store = useStore();
  const {t} = useTranslation('home');
  const theme = useTheme();
  const {
    control,
    formState: {isValid: isInputValid, errors: allErrors},
    getValues,
    setValue,
    reset,
    watch,
  } = useForm<IEquipmentFormInputs>({
    mode: 'onChange',
    defaultValues: {
      neededEquipmentsCount: equipmentInfoToEdit?.count?.toString() ?? '1',
      nickname: equipmentInfoToEdit?.nickname,
    },
  });

  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStepNum, setActiveStepNum] =useState(equipmentInfoToEdit ? 1 : 0);
  const [baseEquipId, setBaseEquipId] = useState<string|null>(null);
  const previousBaseEquipId = usePrevious(baseEquipId);
  const [targetEquipId, setTargetEquipId] = useState<string|null>(null);
  const [isUpgradeDialogOpened, setUpgradeDialogOpened] = useState(false);

  useEffect(() => {
    if (!isOpened) {
      return resetFormValues();
    }
  }, [isOpened]);

  useEffect(() => {
    if (!equipmentInfoToEdit) return;
    // setActiveStepNum(1);
    setBaseEquipId(equipmentInfoToEdit.currentEquipmentId);
    setTargetEquipId(equipmentInfoToEdit.targetEquipmentId);
    setValue(neededEquipmentsCountField, equipmentInfoToEdit.count.toString());
    setValue(nicknameField, equipmentInfoToEdit.nickname);
  }, [equipmentInfoToEdit, setValue] );

  const allTiers = useMemo(() => Array.from(equipmentsByTier.keys()).reverse(), [equipmentsByTier]);
  const overallMaxTier = useMemo(() => Math.max(...allTiers), [allTiers]);
  const availableTargetEquipments = useMemo(() => {
    const baseEquipment = equipmentsById.get(baseEquipId ?? '');
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

    // If equipment is upgradable and we are adding a new euqipment.
    // Assigns first available as target equipment by default.
    if (equipmentsBuilder[0]?.id && !equipmentInfoToEdit) {
      setTargetEquipId(equipmentsBuilder[0].id);
    }

    return equipmentsBuilder;
  }
  , [overallMaxTier, baseEquipId, equipmentsById, equipmentsByTier, equipmentInfoToEdit]);

  useEffect(() => {
    const previousBaseEquip = equipmentsById.get(previousBaseEquipId ?? '');
    const nextBaseEquip = equipmentsById.get(baseEquipId ?? '');
    const targetEquip = equipmentsById.get(targetEquipId ?? '');

    if (!previousBaseEquip || !nextBaseEquip || !targetEquip) return;
    if (previousBaseEquipId === baseEquipId) return;

    // The "tier+1" target equipment from the current base equipment
    // It's in the minial target equipment tier.
    // i.e. current base is T1, then nextMinimalTargetEquip will be T2
    const nextMinimalTargetEquip = equipmentsByTierAndCategory.get(hashTierAndCategoryKey({
      tier: nextBaseEquip.tier+1,
      category: nextBaseEquip.category,
    }));
    if (previousBaseEquip.category === nextBaseEquip.category) {
      // if target tier is lower than next base tier, reset
      if (targetEquip.tier <= nextBaseEquip.tier) {
        setTargetEquipId(nextMinimalTargetEquip?.id ?? null);
      }
      // Otherwise, new base equip is in same category as previous base,
      // and new base tier still < target equip tier, there is no need to reset
    } else {
      // If new base equip is in a different category, reset.
      setTargetEquipId(nextMinimalTargetEquip?.id ?? null);
    }
  }, [baseEquipId, previousBaseEquipId, targetEquipId, equipmentsById]);

  const upgradeInfo: EquipmentInfoToEdit | null = useMemo(() => {
    if (!isInputValid || !baseEquipId || !targetEquipId || !equipmentInfoToEdit) return null;
    const count = parseInt(watch('neededEquipmentsCount'));
    if (!count) return null;
    return {
      currentEquipmentId: baseEquipId,
      targetEquipmentId: targetEquipId,
      count,
      nickname: watch('nickname'),
      indexInStoreArray: equipmentInfoToEdit?.indexInStoreArray,
    };
  }, [isInputValid, baseEquipId, targetEquipId, watch('neededEquipmentsCount'), watch('nickname')]);

  const isUpgradable = useMemo(() => {
    if (!upgradeInfo) return false;
    const amounts = calculateRequirementAmount(
        equipmentsById,
        equipmentsByTierAndCategory,
        upgradeInfo.currentEquipmentId,
        upgradeInfo.targetEquipmentId,
        upgradeInfo.count,
    );

    let enough = true;
    amounts.forEach((amount, pieceId) => {
      const stock = store.equipmentsRequirementStore.piecesInventory
          .get(pieceId)?.inStockCount ?? 0;

      enough &&= amount <= stock;
    });

    return enough;
  }, [isInputValid, baseEquipId, targetEquipId, watch('neededEquipmentsCount')]);

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

  const isFormValid = () =>isInputValid && !!baseEquipId && !!targetEquipId;

  const steps = [
    {
      label: t('addEquipmentDialog.setBase'),
    },
    {
      label: t('addEquipmentDialog.setTarget'),
    },
  ];

  const handleBack = () => {
    setActiveStepNum((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDialogCancel = () => {
    handleCancel();
  };

  const onCurrentEquipmentChanged = (equipmentId: string) =>{
    setBaseEquipId(equipmentId);
    setActiveStepNum(1);
  };

  const onTargetEquipmentChanged = (equipment: Equipment) => {
    setTargetEquipId(equipment.id);
  };

  const handleAddOrUpdateEquipmentOnClose = () =>{
    if (!baseEquipId || !targetEquipId) return;
    const formValues =getValues();
    if (equipmentInfoToEdit) {
      handleUpdateEquipmentRequirement({
        currentEquipmentId: baseEquipId,
        targetEquipmentId: targetEquipId,
        count: parseInt(formValues.neededEquipmentsCount) ?? 1,
        nickname: formValues.nickname,
        indexInStoreArray: equipmentInfoToEdit.indexInStoreArray,
      });
    } else {
      handleAddEquipmentRequirement({
        currentEquipmentId: baseEquipId,
        targetEquipmentId: targetEquipId,
        nickname: formValues.nickname,
        count: parseInt(getValues().neededEquipmentsCount) ?? 1,
      });
    }
  };

  const handleDeletePieceRequirementOnClose = () => {
    if (!baseEquipId || !targetEquipId || !equipmentInfoToEdit) return;
    const formValues =getValues();

    handleDeleteEquipmentRequirement({
      currentEquipmentId: baseEquipId,
      targetEquipmentId: targetEquipId,
      count: parseInt(formValues.neededEquipmentsCount) ?? 1,
      nickname: formValues.nickname,
      indexInStoreArray: equipmentInfoToEdit.indexInStoreArray,
    });
  };

  const handleUpgrade = (equip: EquipmentInfoToEdit, requirements: PieceState[]) => {
    setUpgradeDialogOpened(false);

    if (!baseEquipId || !targetEquipId || !equipmentInfoToEdit) return;
    const formValues = getValues();

    store.equipmentsRequirementStore.updateInventory(
        requirements.reduce((acc, piece) => {
          return Object.assign(acc, {[piece.pieceId]: piece.inStockCount - piece.needCount});
        }, {})
    );

    handleDeleteEquipmentRequirement({
      currentEquipmentId: baseEquipId,
      targetEquipmentId: targetEquipId,
      count: parseInt(formValues.neededEquipmentsCount) ?? 1,
      nickname: formValues.nickname,
      indexInStoreArray: equipmentInfoToEdit.indexInStoreArray,
    });
  };

  const resetFormValues = () => {
    setBaseEquipId(null);
    setTargetEquipId(null);
    setActiveStepNum(0);
    reset();
  };

  const onStepClick = (stepIndex: number) => {
    if (stepIndex !== 0 || !baseEquipId) return;

    if (activeStepNum == 0) {
      setActiveStepNum(1);
    } else {
      setActiveStepNum(0);
    }
  };


  const generateStepContent = (stepNumber: number) => {
    const baseEquipment = equipmentsById.get(baseEquipId ?? '');
    const targetEquipment = equipmentsById.get(targetEquipId ?? '') ?? availableTargetEquipments[0];

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
                        <Typography sx={{color: 'text.disabled'}} variant={'subtitle1'}>
                          {t('addEquipmentDialog.cannotUpgradeFurther')}
                        </Typography>
                      </div> :
                      <ItemsOnCurrentTier key={tier} tier={tier} items={filterEquipmentsOnTier} selectedItemId={baseEquipId}
                        handleSelectItem={onCurrentEquipmentChanged}/>;
                }
            ) : <CircularProgress />;
      case 1:
      default:
        if (!baseEquipment) return <div></div>;


        return <>
          <TargetEquipmentSelection baseEquipment={baseEquipment}
            availableTargetEquipments={availableTargetEquipments}
            targetEquipment={targetEquipment}
            onEquipmentChanged={onTargetEquipmentChanged}/>

          <BuiButton
            color={'baButtonSecondary'}
            disabled={stepNumber === 0}
            onClick={handleBack}>
            {t('addEquipmentDialog.reselect')}
          </BuiButton>
          <NickNameInput control={control}
            helperText={allErrors[nicknameField]?.message ?? t('addEquipmentDialog.enterNickNameNormalHelperText')}
            name={nicknameField} showError={!!allErrors[nicknameField]}/>
        </>;
    }
  };

  const buildStepLabel = (stepNumber: number, stepLabel: string) =>{
    if (baseEquipId === null || stepNumber !== 0) {
      return <>{stepLabel}</>;
    }

    const equipment = equipmentsById.get(baseEquipId);
    return <Box display='flex' alignContent='center' alignItems='center'>
      <Box sx={{mr: 1}}>{stepLabel}</Box>
      {
        equipment ? <EquipmentCard bottomLeftText={`T${equipment.tier}`} imageName={equipment.icon}/> :
            null
      }
    </Box>;
  };

  return <Dialog fullWidth open={isOpened} fullScreen={isFullScreen}
    keepMounted onClose={handleDialogCancel}>
    <DialogTitle>
      <Box display={'flex'}>
        <Box>{t('addEquipmentDialog.selectAEquipment')}</Box>
        <Box flexGrow={'1'}></Box>
        {equipmentInfoToEdit && <Box>
          <Button color={'error'} onClick={handleDeletePieceRequirementOnClose}>
            {t('deleteButton')}
          </Button>
          <Tooltip title={t('upgradeAndDeleteTooltip')}><span>
            <Button color={'success'} disabled={!isUpgradable} onClick={() => setUpgradeDialogOpened(true)}>
              {t('upgradeAndDeleteButton')}
            </Button>
          </span></Tooltip>
        </Box>}
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
      <PositiveIntegerOnlyInput<IEquipmentFormInputs> name={neededEquipmentsCountField}
        control={control} showError={!!allErrors.neededEquipmentsCount}
        helperText={allErrors.neededEquipmentsCount?.message ?? ''} />
      <div className={styles.filler}></div>
      <Button onClick={handleDialogCancel}>{t('cancelButton')}</Button>
      <Button onClick={handleAddOrUpdateEquipmentOnClose} disabled={!isFormValid()}>
        {equipmentInfoToEdit ? t('updateButton') : t('addButton')}
      </Button>
    </DialogActions>

    {upgradeInfo && <UpgradeConfirmationDialog
      open={isUpgradeDialogOpened}
      equipById={equipmentsById}
      equipByCategory={equipmentsByTierAndCategory}
      onCancel={() => setUpgradeDialogOpened(false)}
      onUpgrade={handleUpgrade}
      equip={upgradeInfo} />}
  </Dialog>;
};

export default observer(EquipmentsSelectionDialog);
