import styles from './PieceUpdateBox.module.scss';
import {Card, CardActionArea} from '@mui/material';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import BuiBanner from 'components/bui/BuiBanner';
import Box from '@mui/material/Box';
import PositiveIntegerOnlyInput from 'components/calculationInput/common/PositiveIntegerOnlyInput';
import React from 'react';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {Control} from 'react-hook-form/dist/types/form';
import {InventoryForm} from 'components/calculationInput/equipments/inventory/InventoryUpdateDialog';
import {useTranslation} from 'next-i18next';

interface PieceUpdateBoxProps {
  equipmentsById:EquipmentsById,
  piece: PieceState,
  control: Control<InventoryForm>;
  allErrors: any,
}

const PieceUpdateBox = function({
  equipmentsById,
  piece,
  control,
  allErrors,
}:PieceUpdateBoxProps) {
  const {t} = useTranslation('home');

  const pieceInfo = equipmentsById.get(piece.pieceId);
  if (!pieceInfo) return null;
  return <div className={styles.equipmentInputContainer}>

    <Card elevation={1}>
      <CardActionArea disabled>
        <div className={styles.equipmentCard}>
          <EquipmentCard imageName={pieceInfo.icon} bottomRightText={`x${piece.inStockCount}`}/>
          <BuiBanner label={piece.needCount.toString()} width={'120%'} />
        </div>
      </CardActionArea>
    </Card>
    <Box sx={{mr: 2}}/>
    <PositiveIntegerOnlyInput name={piece.pieceId}
      min={0}
      control={control} showError={!!allErrors[piece.pieceId]}
      helperText={allErrors[piece.pieceId]?.message ?? ''}
      inputLabel={t('addPieceDialog.inStockCount')}
    />
  </div>;
};

export default PieceUpdateBox;
