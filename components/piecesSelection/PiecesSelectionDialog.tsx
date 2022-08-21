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
import PiecesOnCurrentTier from 'components/piecesSelection/PiecesOnCurrentTier';
import React, {useState} from 'react';
import {Equipment} from 'model/Equipment';


import styles from './PiecesSelectionDialog.module.scss';
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
  } = useForm<IFormInputs>({mode: 'onChange', defaultValues: {neededPieceCount: ''}});
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);

  const handleSelectPiece = (piece: number) => {
    setSelectedPieceId(piece);
  };

  const handleAddPieceRequirementOnClose = () => {
    if (selectedPieceId) {
      handleAddPieceRequirement({
        pieceId: selectedPieceId,
        count: parseInt(getValues().neededPieceCount) ?? 1,
      });
    }
  };

  return (<Dialog open={isOpened} fullScreen={isFullScreen}>
    <DialogTitle>
            Select a piece
    </DialogTitle>
    <DialogContent>

      {Array.from(piecesByTier.keys()).reverse().map(
          (tier) => {
            const equipmentsOnTier = piecesByTier.get(tier);
            if (!equipmentsOnTier) return null;
            return <PiecesOnCurrentTier key={tier} tier={tier} pieces={equipmentsOnTier}
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
            message: 'min is 1',
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
      <Button onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleAddPieceRequirementOnClose} disabled={!selectedPieceId || !isCountValid}>Add</Button>
    </DialogActions>
  </Dialog>);
};

export default PiecesSelectionDialog;
