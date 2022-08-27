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
import React, {useState} from 'react';
import {Equipment} from 'model/Equipment';


import styles from 'components/calculationInput/piecesSelection/PiecesSelectionDialog.module.scss';
import {Controller, useForm} from 'react-hook-form';
import {IRequirementByPiece} from 'stores/EquipmentsRequirementStore';

interface IFormInputs {
    neededPieceCount: string
}

const neededPieceCountField = 'neededPieceCount';

const PiecesSelectionDialog = ({
  piecesByTier,
  isOpened,
  handleAddPieceRequirement,
  handleCancel,
}: {
    piecesByTier: Map<number, Equipment[]>,
    isOpened: boolean,
    handleAddPieceRequirement: (requirementByPiece: IRequirementByPiece) => void,
  handleCancel: () => void,
}) => {
  const theme = useTheme();
  const {
    control,
    formState: {isValid: isCountValid, errors: countErrors},
    getValues,
    reset,
  } = useForm<IFormInputs>({mode: 'onChange', defaultValues: {neededPieceCount: '1'}});
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const handleSelectPiece = (piece: string) => {
    setSelectedPieceId(piece);
  };

  const handleAddPieceRequirementOnClose = () => {
    if (selectedPieceId) {
      handleAddPieceRequirement({
        pieceId: selectedPieceId,
        count: parseInt(getValues().neededPieceCount) ?? 1,
      });
      resetFormValues();
    }
  };

  const handleDialogCancel = () => {
    resetFormValues();
    handleCancel();
  };


  const resetFormValues = () => {
    setSelectedPieceId(null);
    reset();
  };


  return (<Dialog open={isOpened} fullScreen={isFullScreen}
    keepMounted>
    <DialogTitle>
            Select a piece
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
      <Button onClick={handleAddPieceRequirementOnClose} disabled={!selectedPieceId || !isCountValid}>Add</Button>
    </DialogActions>
  </Dialog>);
};

export default PiecesSelectionDialog;
