import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PiecesOnCurrentTier from 'components/calculationInput/piecesSelection/PiecesOnCurrentTier';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Equipment} from 'model/Equipment';


import styles from 'components/calculationInput/piecesSelection/PiecesSelectionDialog.module.scss';
import {Controller, useForm} from 'react-hook-form';
import {IRequirementByPiece, PieceInfoToEdit} from 'stores/EquipmentsRequirementStore';
import Box from '@mui/material/Box';

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
  useLayoutEffect(() => {
    if (!pieceInfoToEdit) return;
    setSelectedPieceId(pieceInfoToEdit.pieceId);
    setValue(neededPieceCountField, pieceInfoToEdit.count.toString());
  }, [pieceInfoToEdit] );

  useEffect(() => {
    if (!isOpened) {
      resetFormValues();
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
    keepMounted>
    <DialogTitle>
      <Box display={'flex'}>
        <Box>Select a piece</Box>
        <Box flexGrow={'1'}></Box>
        {pieceInfoToEdit ? <Box><Button color={'error'} onClick={handleDeletePieceRequirementOnClose}>
              Delete</Button></Box> :
        null}

      </Box>
    </DialogTitle>
    <DialogContent>

      {Array.from(piecesByTier.keys()).reverse().map(
          (tier) => {
            const equipmentsOnTier = piecesByTier.get(tier);
            if (!equipmentsOnTier) return null;
            return <PiecesOnCurrentTier key={tier} tier={tier} pieces={equipmentsOnTier} selectedPieceId={selectedPieceId}
              handleSelectPiece={handleSelectPiece}/>;
          }
      )}
    </DialogContent>
    <DialogActions>
      <Controller
        name={neededPieceCountField}
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Required',
          },
          pattern: {
            value: /^\d+$/,
            message: 'must be a number',
          },
          min: {
            value: 1,
            message: 'minimum is 1',
          },
          max: {
            value: 999,
            message: 'maximum is 999',
          },
        }}
        render={({field}) => (
          <TextField
            {...field}

            variant="outlined"
            error={!!countErrors.neededPieceCount}
            helperText={countErrors.neededPieceCount?.message}
            label="Quantity"
          />
        )}
      />
      <div className={styles.filler}></div>
      <Button onClick={handleDialogCancel}>Cancel</Button>
      <Button onClick={handleAddOrUpdatePieceRequirementOnClose} disabled={!selectedPieceId || !isCountValid}>
        {pieceInfoToEdit ? 'Update' : 'Add'}
      </Button>
    </DialogActions>
  </Dialog>);
};

export default PiecesSelectionDialog;
