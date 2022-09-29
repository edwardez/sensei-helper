import styles from './InventoryUpdateDialog.module.scss';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme} from '@mui/material';
import React from 'react';
import {useTranslation} from 'next-i18next';
import {useForm} from 'react-hook-form';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import PieceUpdateBox from 'components/calculationInput/equipments/inventory/PieceUpdateBox';

export type InventoryForm = {
  // key is the piece id and number is inventory count.
  [key: string]: string;
};

const InventoryUpdateDialog = (
    {
      pieces,
      isOpened,
      equipmentsById,
      onCancel,
      onUpdate,
    }: {
      pieces: PieceState[],
      isOpened: boolean,
      equipmentsById: EquipmentsById,
      onCancel: () => void,
      onUpdate: (formValues: InventoryForm) => void,
    }
) => {
  const {t} = useTranslation('home');
  const theme = useTheme();

  const defaultValues= pieces.reduce<InventoryForm>((defaultValuesBuilder, curr) => {
    defaultValuesBuilder[curr.pieceId] = curr.inStockCount.toString();
    return defaultValuesBuilder;
  }, {});
  const {
    control,
    formState: {isValid: isCountValid, errors: allErrors},
    getValues,
    setValue,
    reset,
  } = useForm<InventoryForm>({
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleDialogCancel = () =>{
    onCancel();
  };

  const handleUpdateInventory = () =>{
    onUpdate(getValues());
  };

  const hasManyPieces = () => pieces.length > 3;

  return <Dialog fullWidth open={isOpened} fullScreen={hasManyPieces() ? isFullScreen : false}
    keepMounted
    maxWidth={hasManyPieces() ? 'xl': undefined}>
    <DialogTitle>
      {t('updateInventoryDialogTitle')}
    </DialogTitle>

    <DialogContent>
      <div className={styles.dialogContentContainer}>
        <div className={styles.filler}></div>
        <div className={styles.allInputsContainer}>
          {
            pieces.map((piece, index) => {
              return <PieceUpdateBox key={piece.pieceId} allErrors={allErrors}
                control={control} equipmentsById={equipmentsById} piece={piece}/>;
            })
          }


        </div>
        <div className={styles.filler}></div>

      </div>
    </DialogContent>

    <DialogActions>
      <Button onClick={handleDialogCancel}>{t('cancelButton')}</Button>
      <Button onClick={handleUpdateInventory} disabled={!isCountValid}>
        {t('updateButton')}
      </Button>
    </DialogActions>
  </Dialog>;
};

export default InventoryUpdateDialog;
