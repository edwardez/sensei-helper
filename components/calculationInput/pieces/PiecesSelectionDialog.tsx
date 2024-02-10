import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import styles from 'components/calculationInput/pieces/PiecesSelectionDialog.module.scss';
import {useForm} from 'react-hook-form';
import {IRequirementByPiece, PieceInfoToEdit} from 'stores/EquipmentsRequirementStore';
import Box from '@mui/material/Box';
import {useTranslation} from 'next-i18next';
import PositiveIntegerOnlyInput from 'components/calculationInput/common/PositiveIntegerOnlyInput';
import {EquipmentsList} from '../common/EquipmentsList';
import {EquipmentFilterChips, useEquipmentFilterChips} from '../equipments/EquipmentFilterChips';

interface IFormInputs {
    neededPieceCount: string
}

const neededPieceCountField = 'neededPieceCount';


type PiecesSelectionDialogPros = {
  piecesByTier: Map<number, Equipment[]>,
  piecesById: Map<string, Equipment>,
  isOpened: boolean,
  handleAddPieceRequirement: (requirementByPiece: IRequirementByPiece) => void,
  handleUpdatePieceRequirement: (pieceInfoToEdit: PieceInfoToEdit) => void,
  handleDeletePieceRequirement: (pieceInfoToEdit: PieceInfoToEdit) => void,
  handleCancel: () => void,
  // An entity denotes a pre-selected piece.
  // Setting this means dialog will be used for editing existing selection.
  pieceInfoToEdit: PieceInfoToEdit|null,
}

const PiecesSelectionDialog = ({
  piecesByTier,
  piecesById,
  isOpened,
  handleAddPieceRequirement,
  handleUpdatePieceRequirement,
  handleDeletePieceRequirement,
  handleCancel,
  pieceInfoToEdit,
}:PiecesSelectionDialogPros) => {
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
    defaultValues: {neededPieceCount: pieceInfoToEdit?.count?.toString() ?? '1'},
  });
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>( null);
  useEffect(() => {
    if (!pieceInfoToEdit) return;
    setSelectedPieceId(pieceInfoToEdit.pieceId);
    setValue(neededPieceCountField, pieceInfoToEdit.count.toString());
  }, [pieceInfoToEdit, setValue] );

  useEffect(() => {
    if (!isOpened) {
      return resetFormValues();
    }
  }, [isOpened]);

  const handleSelectPiece = (piece: string) => {
    setSelectedPieceId(piece);
  };

  const handleAddOrUpdatePieceRequirementOnClose = () => {
    if (selectedPieceId) {
      if (pieceInfoToEdit) {
        handleUpdatePieceRequirement({
          pieceId: selectedPieceId,
          count: parseInt(getValues().neededPieceCount) ?? 1,
          indexInStoreArray: pieceInfoToEdit.indexInStoreArray,
        });
      } else {
        handleAddPieceRequirement({
          pieceId: selectedPieceId,
          count: parseInt(getValues().neededPieceCount) ?? 1,
        });
      }
    }
  };

  const handleDeletePieceRequirementOnClose = () => {
    if (selectedPieceId && pieceInfoToEdit) {
      handleDeletePieceRequirement({
        pieceId: selectedPieceId,
        count: parseInt(getValues().neededPieceCount) ?? 1,
        indexInStoreArray: pieceInfoToEdit.indexInStoreArray,
      });
    }
  };

  const handleDialogCancel = () => {
    handleCancel();
  };

  const resetFormValues = () => {
    setSelectedPieceId(null);
    reset();
  };

  const [selected, setSelected, filter] = useEquipmentFilterChips();
  const piecesList = useMemo(() => {
    if (!piecesById) return null;
    const equipments = Array.from(piecesById.values())
        .filter((equip) => equip.equipmentCompositionType == EquipmentCompositionType.Piece);

    if (filter) {
      const filtered = equipments.filter((equip) => !filter || filter(equip));
      return <EquipmentsList
        equipments={filtered}
        selectedEquipId={selectedPieceId}
        onClick={handleSelectPiece}/>;
    } else {
      const grouped = equipments.reduce((acc, equip) => {
        acc[equip.tier] ??= {label: `T${equip.tier}`, equipments: []};
        acc[equip.tier].equipments.push(equip);
        return acc;
      }, [] as any[]);
      grouped.reverse();
      return <EquipmentsList
        equipments={grouped}
        selectedEquipId={selectedPieceId}
        onClick={handleSelectPiece}/>;
    }
  }, [filter, piecesById, selectedPieceId]);
  const maxTier = useMemo(() => {
    return piecesByTier && Math.max(...Array.from(piecesByTier.keys()));
  }, [piecesByTier]);

  return (<Dialog open={isOpened} fullScreen={isFullScreen}
    PaperProps={{sx: {height: '100%'}}}
    keepMounted onClose={handleDialogCancel}>
    <DialogTitle>
      <Box display={'flex'}>
        <Box>{t('addPieceDialog.selectAPiece')}</Box>
        <Box flexGrow={'1'}></Box>
        {pieceInfoToEdit ? <Box><Button color={'error'} onClick={handleDeletePieceRequirementOnClose}>
          {t('deleteButton')}</Button></Box> :
        null}

      </Box>
    </DialogTitle>
    <DialogContent>
      <EquipmentFilterChips
        minTier={2} maxTier={maxTier}
        selected={selected} setSelected={setSelected} />
      {piecesById ? piecesList : <CircularProgress />}
    </DialogContent>
    <DialogActions>
      <PositiveIntegerOnlyInput<IFormInputs> name={neededPieceCountField}
        control={control} showError={!!countErrors.neededPieceCount}
        helperText={countErrors.neededPieceCount?.message ?? ''} />

      <div className={styles.filler}></div>
      <Button onClick={handleDialogCancel}>{t('cancelButton')}</Button>
      <Button onClick={handleAddOrUpdatePieceRequirementOnClose} disabled={!selectedPieceId || !isCountValid}>
        {pieceInfoToEdit ? t('updateButton') : t('addButton')}
      </Button>
    </DialogActions>
  </Dialog>);
};

export default PiecesSelectionDialog;
