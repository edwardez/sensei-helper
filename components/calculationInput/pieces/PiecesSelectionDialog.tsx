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
import ItemsOnCurrentTier from 'components/calculationInput/common/ItemsOnCurrentTier';
import React, {useEffect, useState} from 'react';
import {Equipment} from 'model/Equipment';


import styles from 'components/calculationInput/pieces/PiecesSelectionDialog.module.scss';
import {useForm} from 'react-hook-form';
import {IRequirementByPiece, PieceInfoToEdit} from 'stores/EquipmentsRequirementStore';
import Box from '@mui/material/Box';
import {useTranslation} from 'next-i18next';
import PositiveIntegerOnlyInput from 'components/calculationInput/common/PositiveIntegerOnlyInput';

interface IFormInputs {
    neededPieceCount: string
}

const neededPieceCountField = 'neededPieceCount';


type PiecesSelectionDialogPros = {
  piecesByTier: Map<number, Equipment[]>,
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

  return (<Dialog open={isOpened} fullScreen={isFullScreen}
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
      {piecesByTier ?
      Array.from(piecesByTier.keys()).reverse().map(
          (tier) => {
            const equipmentsOnTier = piecesByTier.get(tier);
            if (!equipmentsOnTier) return null;
            return <ItemsOnCurrentTier key={tier} tier={tier} items={equipmentsOnTier} selectedItemId={selectedPieceId}
              handleSelectItem={handleSelectPiece}/>;
          }
      ) : <CircularProgress />}
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
