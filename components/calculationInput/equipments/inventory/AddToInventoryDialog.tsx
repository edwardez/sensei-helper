import styles from './AddToInventoryDialog.module.scss';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme} from '@mui/material';
import React, {useEffect, useMemo} from 'react';
import {useTranslation} from 'next-i18next';
import {useForm} from 'react-hook-form';
import {DropPieceIdWithProbAndCount, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {InventoryForm} from './InventoryUpdateDialog';
import ObtainedPieceBox from './ObtainedPieceBox';
import {EquipmentsByTierAndCategory} from '../EquipmentsInput';
import {useStore} from 'stores/WizStore';
import {PieceState} from './PiecesInventory';

const AddToInventoryDialog = ({
  open,
  drops,
  equipById,
  piecesState,
  onCancel,
  onUpdate,
}: {
  open: boolean,
  drops: DropPieceIdWithProbAndCount[],
  equipById: EquipmentsById,
  piecesState: Map<string, PieceState>,
  onCancel: () => void,
  onUpdate: (formValues: InventoryForm) => void,
}) => {
  const store = useStore();
  const {t} = useTranslation('home');
  const theme = useTheme();

  const pieceIds = useMemo(() => drops.map((drop) => drop.id), [drops]);
  const pieces = useMemo(() => {
    return Array.from(piecesState.values())
        .filter((state) => pieceIds.includes(state.pieceId) && state.needCount > 0);
  }, [piecesState, pieceIds]);
  const defaultValues = useMemo(() => {
    return pieces.reduce<InventoryForm>((acc, piece) => {
      acc[piece.pieceId] = '';
      return acc;
    }, {});
  }, [pieces]);

  const {
    control,
    formState: {isValid: isCountValid, errors: allErrors},
    getValues,
    reset,
  } = useForm<InventoryForm>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    open && reset();
  }, [open, reset]);

  const handleCancelDialog = () => {
    onCancel();
  };

  const handleUpdateInventory = () => {
    onUpdate(getValues());
    const inventory = Object.entries(getValues()).reduce<InventoryForm>((acc, [id, value]) => {
      const count = parseInt(value);
      const stock = piecesState.get(id)?.inStockCount;
      count && stock && (acc[id] = `${count + stock}`);
      return acc;
    }, {});
    store.equipmentsRequirementStore.updateInventory(inventory);
  };

  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isXsOrSmallerScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const hasManyPieces = () => pieces.length > 3;

  return <Dialog open={open} keepMounted fullWidth
    fullScreen={hasManyPieces() && isFullScreen}
    maxWidth={hasManyPieces() && 'xl'}>
    <DialogTitle>獲得した設計図</DialogTitle>

    <DialogContent className={styles.dialogContentContainer}>
      <div className={styles.filler}></div>
      <div className={`${styles.container} ${isXsOrSmallerScreen && styles.xs}`}>
        {pieces.map((piece) => {
          return <ObtainedPieceBox key={piece.pieceId} allErrors={allErrors}
            control={control}
            equipmentsById={equipById}
            piece={piece}/>;
        })}
      </div>
      <div className={styles.filler}></div>
    </DialogContent>

    <DialogActions>
      <Button onClick={handleCancelDialog}>{t('cancelButton')}</Button>
      <Button onClick={handleUpdateInventory} disabled={!isCountValid}>
        追加
      </Button>
    </DialogActions>
  </Dialog>;
};

export default AddToInventoryDialog;
