import styles from './LabeledEquipmentCard.module.scss';
import {Card, CardActionArea} from '@mui/material';
import BuiBanner from 'components/bui/BuiBanner';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {Equipment} from 'model/Equipment';
import {ReactNode, memo} from 'react';
import {EquipmentsById} from '../PiecesCalculationCommonTypes';
import {PieceState} from './inventory/PiecesInventory';
import {IRequirementByEquipment} from 'stores/EquipmentsRequirementStore';

// #region
type EquipIdSource = {
  equip: Equipment,
} | {
  equipId: string,
} | {
  requirement: IRequirementByEquipment,
} | {
  pieceState: PieceState,
};
type EquipmentOrId = {
  equip: Equipment,
} | (EquipIdSource & {
  equipById: EquipmentsById,
});
type PieceStateOrId = {
  pieceState: PieceState,
} | (EquipIdSource & {
  piecesState: Map<string, PieceState>,
});

type ImageName = {imageName: string} | EquipmentOrId;
type BottomLeftText = ({showTier: true} & EquipmentOrId) | {
  bottomLeftText?: string,
  showTier?: false
};
type BottomRightText = ({showStockCount: true} & PieceStateOrId) | {
  bottomRightText?: string,
  showStockCount?: false
};
type NicknameText = {
  showNickname: true,
  requirement: IRequirementByEquipment,
} | {
  showNickname?: false,
};
type TierChangeText = {
  showTierChange: true,
  requirement: IRequirementByEquipment,
  equipById: EquipmentsById,
} | {
  showTierChange?: false,
};
type NeedCountText = ({showNeedCount: true} & PieceStateOrId) | {
  showNeedCount?: false,
};

type Props = ImageName & BottomLeftText & BottomRightText &
  TierChangeText & NicknameText & NeedCountText & {
    isSelected?: boolean,
    index?: unknown,
    onClick?: (index: unknown) => void,
    badge?: ReactNode,
  };

const resolveEquipmentId = (props: EquipIdSource) => {
  return 'equipId' in props ? props.equipId :
    'equip' in props ? props.equip.id :
    'requirement' in props ? props.requirement.targetEquipmentId :
    props.pieceState.pieceId;
};
const resolveEquipment = (props: EquipmentOrId) => {
  return 'equip' in props ?
    props.equip :
    props.equipById.get(resolveEquipmentId(props));
};
const resolvePieceState = (props: PieceStateOrId) => {
  return 'pieceState' in props ?
    props.pieceState :
    props.piecesState.get(resolveEquipmentId(props));
};
const buildTierChange = (equipById: EquipmentsById, requirement: IRequirementByEquipment) => {
  const baseTier = equipById.get(requirement.currentEquipmentId)?.tier;
  const targetTier = equipById.get(requirement.targetEquipmentId)?.tier;
  return `T${baseTier ?? '?'}→${targetTier ?? '?'}`;
};
// const buildNickname = ({nickname, count}: IRequirementByEquipment) => {
//   return !nickname ? `${count}` :
//     count == 1 ? `${nickname}` :
//     `[${nickname}]${count}`;
// };
const buildNickname = ({nickname, count}: IRequirementByEquipment) => {
  return !nickname ? `${count}` : `[${nickname}]${count}`;
};
// #endregion

/**
 * An example of the god component. It seems to slow down VSCode's type checking.
 * Use with `showTier`, `showNickname`, `showTierChange`, `showNeedCount`
 * and `showStockCount` switches as needed.
 *
 * - `showNickname` and `showTierChange` are for equipment requirements.
 * - `showNeedCount` and `showStockCount` are for pieces in inventory.
 *
 * This is the list of optional arguments
 * - `equipId: string`
 * - `equip: Equipment`
 * - `pieceState: PieceState`
 * - `requirement: IRequirementByEquipment`
 * - `piecesState: Map<string, PieceState>`
 * - `equipById: EquipmentsById`
 *
 * One of `equipId`, `equip`, `pieceState` or `requirement` are required.
 * `piecesState` and `equipById` may be required.
 * You have to specify `callbackArgs` to make the callback can identify items.
 */
export const LabeledEquipmentCard = memo(function LabeledEquipmentCard(props: Props) {
  const imageName = 'imageName' in props ?
    props.imageName :
    resolveEquipment(props)?.icon;
  const bottomLeftText = props.showTier ?
    `T${resolveEquipment(props)?.tier ?? '?'}` :
    props.bottomLeftText;
  const bottomRightText = props.showStockCount ?
    `x${resolvePieceState(props)?.inStockCount ?? 0}` :
    props.bottomRightText;
  const tierChangeText = props.showTierChange &&
    buildTierChange(props.equipById, props.requirement);
  const nicknameText = props.showNickname &&
    buildNickname(props.requirement);
  const needCountText = props.showNeedCount &&
    `${resolvePieceState(props)?.needCount ?? 0}`;
  const onClick = props.onClick && (() => props.onClick?.(props.index));

  return <Card elevation={1} className={styles.card} onClick={onClick}>
    <CardActionArea disabled={!onClick}>
      <div className={styles.container}>
        {imageName && <EquipmentCard imageName={imageName}
          bottomLeftText={bottomLeftText}
          bottomRightText={bottomRightText}
          isSelected={props.isSelected}/>}
        {tierChangeText && <BuiBanner label={tierChangeText} width={'120%'} />}
        {nicknameText && <BuiBanner label={nicknameText} width={'120%'} />}
        {needCountText && <BuiBanner label={needCountText} width={'120%'} />}
      </div>
      <div className={styles.badges}>{props.badge}</div>
    </CardActionArea>
  </Card>;
});
