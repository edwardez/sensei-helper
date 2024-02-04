import styles from 'components/calculationInput/equipments/UpgradeConfirmationDialog.module.scss';
import {
  Button,
  Card,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import React, {useCallback, useMemo} from 'react';
import {EquipmentInfoToEdit} from 'stores/EquipmentsRequirementStore';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {useTranslation} from 'next-i18next';
import {EquipmentsByTierAndCategory} from 'components/calculationInput/equipments/EquipmentsInput';
import {observer} from 'mobx-react-lite';
import {useStore} from 'stores/WizStore';
import {calculateRequirementAmount} from 'components/calculationInput/equipments/inventory/piecesStateCalculator';
import {ArrowForwardRounded} from '@mui/icons-material';
import BuiBanner from 'components/bui/BuiBanner';
import {PieceState} from './inventory/PiecesInventory';

type UpgradeConfirmationDialogProps = {
  open: boolean;
  equipById: EquipmentsById;
  equipByCategory: EquipmentsByTierAndCategory;
  onUpgrade: (equip: EquipmentInfoToEdit, requirements: PieceState[]) => void;
  onCancel: () => void;
  equip: EquipmentInfoToEdit;
};

const UpgradeConfirmationDialog = ({
  open,
  equipById,
  equipByCategory,
  onUpgrade,
  onCancel,
  equip: equipInfo,
}: UpgradeConfirmationDialogProps) => {
  const store = useStore();
  const {t} = useTranslation('home');
  const theme = useTheme();

  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const currentEquip = useMemo(() => {
    return equipById.get(equipInfo.currentEquipmentId);
  }, [equipById, equipInfo.currentEquipmentId]);

  const targetEquip = useMemo(() => {
    return equipById.get(equipInfo.targetEquipmentId);
  }, [equipById, equipInfo.targetEquipmentId]);

  const {count, nickname} = equipInfo;

  const requirements = useMemo(() => {
    if (!currentEquip || !targetEquip) return [];
    const requirements = Array.from(
        calculateRequirementAmount(
            equipById,
            equipByCategory,
            currentEquip.id,
            targetEquip.id,
            count
        ).entries(),
        ([pieceId, needCount]): { pieceId: string; state: PieceState } => {
          const inStockCount =
          store.equipmentsRequirementStore.piecesInventory.get(pieceId)
              ?.inStockCount ?? 0;
          return {pieceId, state: {pieceId, needCount, inStockCount}};
        }
    );
    return requirements
        .sort((a, b) => (a.pieceId > b.pieceId ? -1 : 1))
        .map(({pieceId, state}) => ({
          pieceId,
          piece: equipById.get(pieceId),
          use: state.needCount,
          stock: state.inStockCount,
        }));
  }, [equipById, equipByCategory, currentEquip, targetEquip, count]);

  const handleUpgrade = useCallback(() => {
    onUpgrade(
        equipInfo,
        requirements.map(({pieceId, use, stock}) => ({
          pieceId,
          needCount: use,
          inStockCount: stock,
        }))
    );
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
          <span><BuiBanner label={`x${count}`} /></span>
          <span>{nickname && <BuiBanner label={`${nickname}`} />}</span>
        </Box>
        <BuiLinedText>{t('upgradeDialog.pieces')}</BuiLinedText>
        <Box className={styles.pieces}>
          {requirements.map(({piece, use, stock}, i) => (
            <Card key={i} elevation={1}>
              <CardActionArea>
                <div className={styles.card}>
                  {piece && (
                    <EquipmentCard
                      imageName={piece.icon}
                      bottomRightText={`x${stock}`} />
                  )}
                  <BuiBanner label={`${use}`} width={'120%'} />
                </div>
              </CardActionArea>
            </Card>
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

export default observer(UpgradeConfirmationDialog);
