import styles from "components/calculationInput/equipments/UpgradeConfirmationDialog.module.scss";
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
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useCallback, useMemo } from "react";
import { EquipmentInfoToEdit } from "stores/EquipmentsRequirementStore";
import EquipmentCard from "components/bui/card/EquipmentCard";
import { EquipmentsById } from "components/calculationInput/PiecesCalculationCommonTypes";
import BuiLinedText from "components/bui/text/BuiLinedText";
import { useTranslation } from "next-i18next";
import { EquipmentsByTierAndCategory } from "components/calculationInput/equipments/EquipmentsInput";
import { observer } from "mobx-react-lite";
import { useStore } from "stores/WizStore";
import { calculateRequirementAmount } from "components/calculationInput/equipments/inventory/piecesStateCalculator";
import { ArrowForwardRounded } from "@mui/icons-material";
import BuiBanner from "components/bui/BuiBanner";
import { PieceState } from "./inventory/PiecesInventory";

export interface IEquipmentFormInputs {
  neededEquipmentsCount: string;
  nickname: string;
}

type UpgradeConfirmationDialogProps = {
  isOpened: boolean;
  equipmentsById: EquipmentsById;
  equipmentsByTierAndCategory: EquipmentsByTierAndCategory;
  handleUpgrade: (
    equipmentInfoToEdit: EquipmentInfoToEdit,
    requirements: PieceState[]
  ) => void;
  handleCancel: () => void;
  equipmentInfoToEdit: EquipmentInfoToEdit;
};

const UpgradeConfirmationDialog = ({
  isOpened,
  equipmentInfoToEdit,
  equipmentsById,
  equipmentsByTierAndCategory,
  handleUpgrade: onUpgrade,
  handleCancel: onCancel,
}: UpgradeConfirmationDialogProps) => {
  const store = useStore();
  const { t } = useTranslation("home");
  const theme = useTheme();

  const isFullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const currentEquip = useMemo(() => {
    return equipmentsById.get(equipmentInfoToEdit.currentEquipmentId);
  }, [equipmentInfoToEdit.currentEquipmentId]);

  const targetEquip = useMemo(() => {
    return equipmentsById.get(equipmentInfoToEdit.targetEquipmentId);
  }, [equipmentInfoToEdit.targetEquipmentId]);

  const {count, nickname} = equipmentInfoToEdit;

  if (!currentEquip || !targetEquip) return <></>;

  const requirements = useMemo(() => {
    const requirements = Array.from(
      calculateRequirementAmount(
        equipmentsById,
        equipmentsByTierAndCategory,
        currentEquip.id,
        targetEquip.id,
        count
      ).entries(),
      ([pieceId, needCount]): { pieceId: string; state: PieceState } => {
        const inStockCount =
          store.equipmentsRequirementStore.piecesInventory.get(pieceId)
            ?.inStockCount ?? 0;
        return { pieceId, state: { pieceId, needCount, inStockCount } };
      }
    );
    return requirements
      .sort((a, b) => (a.pieceId > b.pieceId ? -1 : 1))
      .map(({ pieceId, state }) => ({
        pieceId,
        piece: equipmentsById.get(pieceId),
        use: state.needCount,
        stock: state.inStockCount,
      }));
  }, [currentEquip.id, targetEquip.id, count]);

  const handleUpgrade = useCallback(() => {
    onUpgrade(
      equipmentInfoToEdit,
      requirements.map(({ pieceId, use, stock }) => ({
        pieceId,
        needCount: use,
        inStockCount: stock,
      }))
    );
  }, [currentEquip.id, targetEquip.id, count, onUpgrade]);

  return (
    <Dialog fullWidth open={isOpened} fullScreen={isFullScreen} keepMounted>
      <DialogTitle>
        <Box>{t("upgradeDialog.title")}</Box>
      </DialogTitle>

      <DialogContent>
        <Box className={styles.desc}>
          {t("upgradeDialog.description_1")}
          <br />
          {t("upgradeDialog.description_2")}
        </Box>
        <BuiLinedText>{t("upgradeDialog.detail")}</BuiLinedText>
        <Box className={styles.equip}>
          <EquipmentCard
            bottomLeftText={`T${currentEquip.tier}`}
            imageName={currentEquip.icon} />
          <ArrowForwardRounded fontSize="large" />
          <EquipmentCard
            bottomLeftText={`T${targetEquip.tier}`}
            imageName={targetEquip.icon} />
            <span><BuiBanner label={`x${count}`} /></span>
            <span>{nickname && <BuiBanner label={`${nickname}`} />}</span>
        </Box>
        <BuiLinedText>{t("upgradeDialog.pieces")}</BuiLinedText>
        <Box className={styles.pieces}>
          {requirements.map(({ piece, use, stock }, i) => (
            <Card key={i} elevation={1}>
              <CardActionArea>
                <div className={styles.card}>
                  {piece && (
                    <EquipmentCard
                      imageName={piece.icon}
                      bottomRightText={`x${stock}`} />
                  )}
                  <BuiBanner label={`${use}`} width={"120%"} />
                </div>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>{t("cancelButton")}</Button>
        <Button onClick={handleUpgrade}>{t("upgradeAndDeleteButton")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(UpgradeConfirmationDialog);
