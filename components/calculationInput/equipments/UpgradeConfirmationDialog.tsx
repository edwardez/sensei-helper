import styles from 'components/calculationInput/equipments/UpgradeConfirmationDialog.module.scss';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import React, {memo, useCallback, useMemo} from 'react';
import {EquipmentInfoToEdit} from 'stores/EquipmentsRequirementStore';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {useTranslation} from 'next-i18next';
import {EquipmentsByTierAndCategory} from './EquipmentsInput';
import {observer} from 'mobx-react-lite';
import {calculateRequiredPieces} from './inventory/piecesStateCalculator';
import {ArrowForwardRounded} from '@mui/icons-material';
import BuiBanner from 'components/bui/BuiBanner';
import {PieceState} from './inventory/PiecesInventory';
import {LabeledEquipmentCard} from './LabeledEquipmentCard';

type UpgradeConfirmationDialogProps = {
  open: boolean;
  equipById: EquipmentsById;
  equipByCategory: EquipmentsByTierAndCategory;
  onUpgrade: (equip: EquipmentInfoToEdit, requirements: PieceState[]) => void;
  onCancel: () => void;
  equip: EquipmentInfoToEdit | null;
  piecesState: Map<string, PieceState>;
};

const UpgradeConfirmationDialog = ({
  open,
  equipById,
  equipByCategory,
  onUpgrade,
  onCancel,
  equip: equipInfo,
  piecesState,
}: UpgradeConfirmationDialogProps) => {
  const {t} = useTranslation('home');
  const theme = useTheme();

  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const currentEquip = equipInfo && equipById.get(equipInfo.currentEquipmentId);
  const targetEquip = equipInfo && equipById.get(equipInfo.targetEquipmentId);

  const requirements = useMemo(() => {
    if (!equipInfo) return null;
    const requirements = Array.from(
        calculateRequiredPieces(
            equipById,
            equipByCategory,
            equipInfo,
        ).entries(),
        ([pieceId, needCount]): PieceState => {
          const inStockCount = piecesState.get(pieceId)?.inStockCount ?? 0;
          return {pieceId, needCount, inStockCount};
        }
    );
    return requirements.sort((a, b) => (a.pieceId > b.pieceId ? -1 : 1));
  }, [equipById, equipByCategory, equipInfo, piecesState]);

  const handleUpgrade = useCallback(() => {
    if (!equipInfo || !requirements) return;
    onUpgrade(equipInfo, requirements);
  }, [equipInfo, requirements, onUpgrade]);

  return (
    <Dialog fullWidth open={open} fullScreen={isFullScreen} keepMounted>
      <DialogTitle>
        <Box>{t('upgradeDialog.title')}</Box>
      </DialogTitle>

      <DialogContent>
        <Box className={styles.desc}>
          {t('upgradeDialog.description_1')}
          <br />
          {t('upgradeDialog.description_2')}
        </Box>
        <BuiLinedText>{t('upgradeDialog.detail')}</BuiLinedText>
        <Box className={styles.equip}>
          {currentEquip && <EquipmentCard
            bottomLeftText={`T${currentEquip.tier}`}
            imageName={currentEquip.icon}
          />}
          <ArrowForwardRounded fontSize="large" />
          {targetEquip && <EquipmentCard
            bottomLeftText={`T${targetEquip.tier}`}
            imageName={targetEquip.icon}
          />}
          <span><BuiBanner label={`x${equipInfo?.count}`} /></span>
          <span>{equipInfo?.nickname && <BuiBanner label={`${equipInfo.nickname}`} />}</span>
        </Box>
        <BuiLinedText>{t('upgradeDialog.pieces')}</BuiLinedText>
        <Box className={styles.pieces}>
          {requirements && requirements.map((state) => (
            <LabeledEquipmentCard key={state.pieceId}
              showStockCount showNeedCount
              equipById={equipById} pieceState={state}/>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>{t('cancelButton')}</Button>
        <Button onClick={handleUpgrade}>{t('upgradeAndDeleteButton')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(observer(UpgradeConfirmationDialog));
