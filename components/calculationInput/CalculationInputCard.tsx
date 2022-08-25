import styles from './CalculationInputCard.module.scss';
import {Card, CardActionArea, CardContent} from '@mui/material';
import BuiOptionLabelWithDividerPrefix from '../bui/settings/BuiOptionLabelWithDividerPrefix';
import BuiPaper from 'components/bui/BuiPaper';
import Image from 'next/image';
import BuiBanner from 'components/bui/BuiBanner';
import BuiButton from 'components/bui/BuiButton';
import PiecesSelectionDialog from './piecesSelection/PiecesSelectionDialog';
import React, {useMemo, useState} from 'react';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import {IWizStore} from 'stores/WizStore';
import {IRequirementByPiece} from 'stores/EquipmentsRequirementStore';
import {calculateSolution} from 'components/calculationInput/linearProgrammingSolver';
import {CampaignsById, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import Grid from '@mui/material/Unstable_Grid2';
import {useRadioGroup} from '@mui/material/RadioGroup';
import {observer} from 'mobx-react-lite';
import DropCampaignSelection from 'components/calculationInput/DropCampaignSelection';

type CalculationInputCardProps = {
  store: IWizStore,
  equipments: Equipment[],
  campaignsById: CampaignsById,
  equipmentsById: EquipmentsById,
  onSetSolution: Function,
}

const CalculationInputCard = ({store, equipments, campaignsById, equipmentsById, onSetSolution}: CalculationInputCardProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const dropRateRadioGroup = useRadioGroup();

  const handleClickOpen = () => {
    setIsOpened(true);
  };

  const handleAddPieceRequirement = (requirementByPiece: IRequirementByPiece) => {
    store.equipmentsRequirementStore.addPiecesRequirement(requirementByPiece);
    setIsOpened(false);
    onSetSolution(null);
  };

  const handleCancel = () => {
    setIsOpened(false);
  };

  const handleCalculate = () => {
    const requirementByPieces = store.equipmentsRequirementStore.requirementByPieces;
    onSetSolution(calculateSolution(requirementByPieces, store.gameInfoStore.normalMissionItemDropRatio, campaignsById));
  };


  const piecesByTier : Map<number, Equipment[]>= useMemo(() => equipments?.reduce((map, equipment) => {
    if (equipment.equipmentCompositionType !== EquipmentCompositionType.Piece) return map;
    if (!map.has(equipment.tier)) {
      map.set(equipment.tier, []);
    }
    map.get(equipment.tier).push(equipment);
    return map;
  }, new Map()), [equipments]);


  return <div className={styles.container}>
    <Card variant={'outlined'}>
      <CardContent>

        <BuiOptionLabelWithDividerPrefix label={'Add pieces'}/>

        <div className={styles.selectedPiecesWrapper}>
          {store.equipmentsRequirementStore.requirementByPieces.map(({pieceId: id, count}) => {
            const piece = equipmentsById.get(id);

            if (!piece) return null;

            return <Card key={id} elevation={1} className={styles.selectedPiecesCard}>
              <CardActionArea>
                <div className={styles.selectedPiecePaper}>
                  <BuiPaper>
                    <div className={`revert-wiz-transform`}>
                      <Image src={`/images/equipments/${piece.icon}.png`}
                        width={63} height={50}
                      ></Image>
                    </div>
                  </BuiPaper>
                  <BuiBanner label={count.toString()} width={'120%'} className={styles.countOnCard}/>
                </div>
              </CardActionArea>

            </Card>;
          })}
          <BuiButton color="baButtonPrimary" onClick={handleClickOpen} className={styles.addButton}>
            <div>Add</div>
          </BuiButton>
        </div>

        <DropCampaignSelection store={store} onDropRateChanged={() => onSetSolution(null)}/>

        <Grid container display="flex" justifyContent="center" alignItems="center">
          <BuiButton variant="outlined"
            color={'baButtonSecondary'}
            onClick={handleCalculate} disabled={!store.equipmentsRequirementStore.getAllRequiredPieceIds().size}>
            <div>Calculate</div>
          </BuiButton>
        </Grid>

      </CardContent>


    </Card>

    {
            isOpened ? <PiecesSelectionDialog
              isOpened={isOpened}

              piecesByTier={piecesByTier}
              handleAddPieceRequirement={handleAddPieceRequirement}
              handleCancel={handleCancel}
            /> : <></>
    }
  </div>;
};

export default observer(CalculationInputCard);
