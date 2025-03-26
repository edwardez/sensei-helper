import styles from './AddToInventoryDialog.module.scss';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Stack, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme,
} from '@mui/material';
import React, {Reducer, useContext, useEffect, useMemo, useReducer, useState} from 'react';
import {useTranslation} from 'next-i18next';
import {useForm} from 'react-hook-form';
import {
  DropPieceIdWithProbAndCount, EquipmentsById,
} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {InventoryForm} from './InventoryUpdateDialog';
import ObtainedPieceBox from './ObtainedPieceBox';
import {useStore} from 'stores/WizStore';
import {PieceState} from './PiecesInventory';
import {
  Comparators, SortingOrder,
  buildArrayIndexComparator, buildComparator,
} from 'common/sortUtils';
import {EquipmentCategories, EquipmentCompositionType} from 'model/Equipment';
import {randomId} from 'common/randomId';

const AddToInventoryDialogContext = React.createContext({
  open: (drops: DropPieceIdWithProbAndCount[]) => {},
  close: () => {},
});

export const useAddToInventoryDialogContext = () => {
  const {open, close} = useContext(AddToInventoryDialogContext);
  return [open, close] as const;
};

export const AddToInventoryDialogContextProvider = ({
  equipById,
  piecesState,
  children,
}: {
  equipById: EquipmentsById,
  piecesState: Map<string, PieceState>,
  children?: React.ReactNode,
}) => {
  const [{open, drops}, dispatch] = useReducer<Reducer<{
    open: boolean;
    key: string,
    drops: DropPieceIdWithProbAndCount[],
  }, {
    action: 'open',
    drops: DropPieceIdWithProbAndCount[],
  } | {
    action: 'close'
  }>>((state, action) => (
    action.action === 'open' ? {
      open: true,
      drops: action.drops,
      key: randomId(),
    } : {
      ...state,
      open: false,
    }
  ), {
    open: false,
    key: '',
    drops: [],
  });
  const contextValue = useMemo(() => ({
    open: (drops: DropPieceIdWithProbAndCount[]) => dispatch({action: 'open', drops}),
    close: () => dispatch({action: 'close'}),
  }), [dispatch]);

  return <AddToInventoryDialogContext.Provider value={contextValue}>
    <AddToInventoryDialog open={open}
      onUpdate={contextValue.close} onCancel={contextValue.close}
      equipById={equipById} piecesState={piecesState} drops={drops} />
    {children}
  </AddToInventoryDialogContext.Provider>;
};

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

  const [mode, setMode] = useState<'all' | 'lack' | 'required'>('lack');

  const pieces = useMemo(() => {
    // 20-3: Necklace, Watch, Bag
    // 20-4: Watch, Charm, Badge
    // 13-1: Shoes, Gloves, Hat
    // descending tier -> descending category order?
    return drops.filter(({id}) => (
      equipById.get(id)?.equipmentCompositionType === EquipmentCompositionType.Piece
    )).map(({id}) => (piecesState.get(id) ?? {
      pieceId: id,
      needCount: 0,
      inStockCount: store.equipmentsRequirementStore.piecesInventory.get(id)?.inStockCount ?? 0,
    })).filter((state) => ({
      all: true,
      lack: state.needCount > state.inStockCount,
      required: state.needCount > 0,
    }[mode])).sort(buildComparator(
        (piece) => equipById.get(piece.pieceId),
        buildComparator((e) => e.tier, Comparators.numberDescending),
        buildComparator((e) => e.category, buildArrayIndexComparator(
            EquipmentCategories,
            SortingOrder.Descending
        )),
    ));
  }, [drops, equipById, piecesState, store.equipmentsRequirementStore.piecesInventory, mode]);

  const {
    control, formState,
    getValues, reset,
    getFieldState, setFocus,
    handleSubmit,
  } = useForm<InventoryForm>({
    mode: 'onChange',
    defaultValues: Object.fromEntries(drops.map(({id}) => [id, ''])),
  });

  useEffect(() => {
    if (!open) return;
    reset(Object.fromEntries(drops.map(({id}) => [id, ''])));
  }, [drops, open, reset]);

  const handleCancel = () => {
    onCancel();
  };

  const handleUpdate = handleSubmit((values) => {
    onUpdate(values);
    store.equipmentsRequirementStore.addPiecesToInventory(values);
  }, (errors) => {
    const field = Object.entries(errors).find(([, it]) => it && 'ref' in it)?.[0];
    console.log(errors);
    field && setFocus(field);
  });

  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isXsOrSmallerScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const hasManyPieces = () => pieces.length > 3;

  useEffect(() => {
    const id = setTimeout(() => {
      const field = pieces.find(({pieceId}) => (
        getValues(pieceId) === '' || getFieldState(pieceId).invalid
      )) ?? pieces[0];
      field && setFocus(field.pieceId, {shouldSelect: true});
    }, 100);
    return () => clearTimeout(id);
  }, [equipById, getFieldState, getValues, open, pieces, setFocus]);

  return <Dialog open={open} fullWidth
    fullScreen={hasManyPieces() && isFullScreen}
    maxWidth={hasManyPieces() && 'xl'}>
    <Stack component={DialogTitle} direction='row' alignItems='center'>
      {t('addPieceDialog.addToInventory')}
      <Box flexGrow={1} />
      <ToggleButtonGroup exclusive size='small'
        value={mode} onChange={(e, value) => value && setMode(value)}>
        <ToggleButton value='all'>{t('piecesFilter.filter.all')}</ToggleButton>
        <ToggleButton value='lack'>{t('piecesFilter.filter.insufficient')}</ToggleButton>
        <ToggleButton value='required'>{t('piecesFilter.filter.required')}</ToggleButton>
      </ToggleButtonGroup>
    </Stack>

    <DialogContent className={styles.dialogContentContainer}>
      <div className={styles.filler}></div>
      <div className={`${styles.container} ${isXsOrSmallerScreen && styles.xs}`}>
        {pieces.map((piece) => {
          return <ObtainedPieceBox key={piece.pieceId}
            allErrors={formState.errors} control={control}
            equipmentsById={equipById} piece={piece}
            required={false} />;
        })}
      </div>
      {pieces.length === 0 && <div>{t('filterResultEmpty')}</div>}
      <div className={styles.filler}></div>
    </DialogContent>

    <DialogActions>
      <Button onClick={handleCancel}>{t('cancelButton')}</Button>
      <Button onClick={handleUpdate} disabled={!formState.isValid}>{t('addButton')}</Button>
    </DialogActions>
  </Dialog>;
};

export default AddToInventoryDialog;
