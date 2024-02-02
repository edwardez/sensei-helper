/* eslint-disable max-len */
import styles from "components/calculationInput/equipments/UpgradeConfirmationDialog.module.scss";
import {
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  EquipmentInfoToEdit,
  IRequirementByEquipment,
} from "stores/EquipmentsRequirementStore";
import BuiButton from "components/bui/BuiButton";
import { Equipment, EquipmentCompositionType } from "model/Equipment";
import ItemsOnCurrentTier from "components/calculationInput/common/ItemsOnCurrentTier";
import EquipmentCard from "components/bui/card/EquipmentCard";
import { EquipmentsById } from "components/calculationInput/PiecesCalculationCommonTypes";
import BuiLinedText from "components/bui/text/BuiLinedText";
import TargetEquipmentSelection from "components/calculationInput/equipments/TargetEquipmentSelection";
import { useForm } from "react-hook-form";
import PositiveIntegerOnlyInput from "components/calculationInput/common/PositiveIntegerOnlyInput";
import { useTranslation } from "next-i18next";
import { usePrevious } from "common/hook";
import {
  EquipmentsByTierAndCategory,
  hashTierAndCategoryKey,
} from "components/calculationInput/equipments/EquipmentsInput";
import NickNameInput from "components/calculationInput/equipments/EquipmentDialog/NickNameInput";
import { observer } from "mobx-react-lite";
import { useStore } from "stores/WizStore";
import { calculateRequirementAmount } from "components/calculationInput/equipments/inventory/piecesStateCalculator";
import { boolean } from "mobx-state-tree/dist/internal";
import { ArrowForwardIosRounded, ArrowForwardRounded } from "@mui/icons-material";
import BuiBanner from "components/bui/BuiBanner";
import { PieceState } from "./inventory/PiecesInventory";

export interface IEquipmentFormInputs {
  neededEquipmentsCount: string;
  nickname: string;
}

const neededEquipmentsCountField = "neededEquipmentsCount";
const nicknameField = "nickname";

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

  const count = equipmentInfoToEdit.count;

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
      requirements.map(({pieceId, use, stock}) => ({pieceId, needCount: use, inStockCount: stock})),
    );
  }, [currentEquip.id, targetEquip.id, count, onUpgrade]);

  return (
    <Dialog fullWidth open={isOpened} fullScreen={isFullScreen} keepMounted>
      <DialogTitle>
        <Box>強化内容確認</Box>
      </DialogTitle>

      <DialogContent>
        <Box className={styles.desc}>
          装備設計図を消費し、以下の強化を行います。<br/>
          ※登録されている所持設計図を必要数だけ減らして、この装備をリストから削除します。
        </Box>
        <BuiLinedText>強化内容</BuiLinedText>
        <Box className={styles.equip}>
          {/* <div style={{display: "inline-block"}}>
            <BuiBanner label={`${equipmentInfoToEdit.nickname}`} />
          </div> */}
          <EquipmentCard
            bottomLeftText={`T${currentEquip.tier}`}
            imageName={currentEquip.icon} />
          <ArrowForwardRounded />
          <EquipmentCard
            bottomLeftText={`T${targetEquip.tier}`}
            imageName={targetEquip.icon} />
          <div style={{display: "inline-block"}}>
            <BuiBanner label={`x${equipmentInfoToEdit.count}`} />
          </div>
        </Box>
        <BuiLinedText>消費される設計図</BuiLinedText>
        <Box className={styles.pieces}>
          {requirements.map(({ piece, use, stock }, i) => (
            <Card key={i} elevation={1}>
              <CardActionArea><div className={styles.card}>
                {piece && <EquipmentCard imageName={piece.icon} bottomRightText={`x${stock}`} />}
                <BuiBanner label={`${use}`} width={"120%"} />
              </div></CardActionArea>
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
