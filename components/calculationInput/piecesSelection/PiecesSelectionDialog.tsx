import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PiecesOnCurrentTier from 'components/calculationInput/piecesSelection/PiecesOnCurrentTier';
import React, {useEffect, useState} from 'react';
import {Equipment} from 'model/Equipment';


import styles from 'components/calculationInput/piecesSelection/PiecesSelectionDialog.module.scss';
import {Controller, useForm} from 'react-hook-form';
import {IRequirementByPiece, PieceInfoToEdit} from 'stores/EquipmentsRequirementStore';
import Box from '@mui/material/Box';
import {useTranslation} from 'next-i18next';

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
            return <PiecesOnCurrentTier key={tier} tier={tier} pieces={equipmentsOnTier} selectedPieceId={selectedPieceId}
              handleSelectPiece={handleSelectPiece}/>;
          }
      ) : <CircularProgress />}
    </DialogContent>
    <DialogActions>
      <Controller
        name={neededPieceCountField}
        control={control}
        rules={{
          required: {
            value: true,
            message: t('addPieceDialog.required'),
          },
          pattern: {
            value: /^\d+$/,
            message: t('addPieceDialog.mustBeAInteger'),
          },
          min: {
            value: 1,
            message: t('addPieceDialog.minimumIs', {min: 1}),
          },
          max: {
            value: 999,
            message: t('addPieceDialog.maximumIs', {max: 999}),
          },
        }}
        render={({field}) => (
          <TextField
            {...field}
            inputProps={{pattern: '\\d*'}}
            variant="outlined"
            error={!!countErrors.neededPieceCount}
            helperText={countErrors.neededPieceCount?.message}
            label={t('addPieceDialog.quantity')}
          />
        )}
      />
      <div className={styles.filler}></div>
      <Button onClick={handleDialogCancel}>{t('cancelButton')}</Button>
      <Button onClick={handleAddOrUpdatePieceRequirementOnClose} disabled={!selectedPieceId || !isCountValid}>
        {pieceInfoToEdit ? t('updateButton') : t('addButton')}
      </Button>
    </DialogActions>
  </Dialog>);
};

export default PiecesSelectionDialog;
