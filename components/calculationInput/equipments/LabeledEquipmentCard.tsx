import styles from './LabeledEquipmentCard.module.scss';
import {Card, CardActionArea} from '@mui/material';
import BuiBanner from 'components/bui/BuiBanner';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {Equipment} from 'model/Equipment';
import {ReactNode, memo, MouseEvent, MouseEventHandler} from 'react';
import {EquipmentsById} from '../PiecesCalculationCommonTypes';
import {PieceState} from './inventory/PiecesInventory';
import {IRequirementByEquipment} from 'stores/EquipmentsRequirementStore';

// #region
type Switches = Partial<{
  showTier: boolean,
  showStockCount: boolean,
  showTierChange: boolean,
  showNickname: boolean,
  showNeedCount: boolean,
}>;
type EquipIdSource = {
  equip?: Equipment,
  equipId?: string,
  requirement?: IRequirementByEquipment,
  pieceState?: PieceState,
};
type EquipmentSource = EquipIdSource & {equipById?: EquipmentsById};
type PieceStateSource = EquipIdSource & {piecesState?: Map<string, PieceState>};
type Props<T> = Switches & EquipIdSource & EquipmentSource & PieceStateSource & {
  imageName?: string,
  bottomLeftText?: string,
  bottomRightText?: string,

  isSelected?: boolean,
  badge?: ReactNode,
} & ({
  onClick?: MouseEventHandler,
} | {
  index: T,
  onClick?: (e: MouseEvent, index: T) => void,
});

const resolveEquipmentId = (props: EquipIdSource) => {
  return props.equipId || props.equip?.id ||
    props.requirement?.targetEquipmentId ||
    props.pieceState?.pieceId;
};
const resolveEquipment = (props: EquipmentSource) => {
  return props.equip ||
    props.equipById?.get(resolveEquipmentId(props) ?? '');
};
const resolvePieceState = (props: PieceStateSource) => {
  return props.pieceState ||
    props.piecesState?.get(resolveEquipmentId(props) ?? '');
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

// eslint-disable-next-line valid-jsdoc
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
const LabeledEquipmentCard = <T extends unknown = never>({
  showTier, showStockCount, showNeedCount,
  showTierChange, showNickname,
  ...props
}: Props<T>) => {
  const {equipById, requirement} = props;
  const imageName = resolveEquipment(props)?.icon || props.imageName;
  const bottomLeftText = showTier ?
    `T${resolveEquipment(props)?.tier ?? '?'}` :
    props.bottomLeftText;
  const bottomRightText = showStockCount ?
    `x${resolvePieceState(props)?.inStockCount ?? 0}` :
    props.bottomRightText;
  const tierChangeText = showTierChange &&
    equipById && requirement && buildTierChange(equipById, requirement);
  const nicknameText = showNickname &&
    requirement && buildNickname(requirement);
  const needCountText = showNeedCount &&
    `${resolvePieceState(props)?.needCount ?? 0}`;
  const onClick = 'index' in props ?
    ((e: MouseEvent) => props.onClick?.(e, props.index) as void) :
    props.onClick;

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
};

const Memo = memo(LabeledEquipmentCard) as unknown as typeof LabeledEquipmentCard;
export {Memo as LabeledEquipmentCard};
