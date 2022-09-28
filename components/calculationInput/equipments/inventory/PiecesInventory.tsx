import styles from './PiecesInventory.module.scss';
import {Card, CardActionArea} from '@mui/material';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import BuiBanner from 'components/bui/BuiBanner';
import React, {useMemo} from 'react';
import {IPieceInventory} from 'stores/EquipmentsRequirementStore';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';

export type PieceState = IPieceInventory & {
  needCount: number;
}

const PiecesInventory = (
    {
      piecesState,
      equipmentsById,
    } : {
      piecesState: Map<string, PieceState>
      equipmentsById: EquipmentsById,
    }
) => {
  const pieces = useMemo(() => Array.from(piecesState.values()), [piecesState]);

  return <>
    {
      pieces.map((inventory, index) => {
        const piece = equipmentsById.get(inventory.pieceId);
        if (!piece) return null;

        return <Card key={index} elevation={1}
          onClick={()=>{}}>
          <CardActionArea>
            <div className={styles.piecesList}>
              <EquipmentCard imageName={piece.icon} bottomRightText={`x${inventory.inStockCount}`}/>
              <BuiBanner label={inventory.needCount.toString()} width={'120%'} />
            </div>
          </CardActionArea>
        </Card>;
      })
    }
  </>;
};

export default PiecesInventory;
