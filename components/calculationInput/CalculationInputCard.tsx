import styles from './CalculationInputCard.module.scss';
import {Card, CardActionArea, CardContent, CircularProgress} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import BuiPaper from 'components/bui/BuiPaper';
import Image from 'next/image';
import BuiBanner from 'components/bui/BuiBanner';
import BuiButton from 'components/bui/BuiButton';
import PiecesSelectionDialog from './piecesSelection/PiecesSelectionDialog';
import React, {useMemo, useState} from 'react';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import {IWizStore} from 'stores/WizStore';
import {IRequirementByPiece, PieceInfoToEdit} from 'stores/EquipmentsRequirementStore';
import {calculateSolution} from 'components/calculationInput/linearProgrammingSolver';
import {CampaignsById, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import Grid from '@mui/material/Unstable_Grid2';
import {observer} from 'mobx-react-lite';
import DropCampaignSelection from 'components/calculationInput/DropCampaignSelection';
import {useTranslation} from 'next-i18next';

type CalculationInputCardProps = {
  store: IWizStore,
  equipments: Equipment[],
  campaignsById: CampaignsById,
  equipmentsById: EquipmentsById,
  onSetSolution: Function,
}

const CalculationInputCard = ({store, equipments, campaignsById, equipmentsById, onSetSolution}: CalculationInputCardProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [pieceInfoToEdit, setPieceInfoToEdit] = useState<PieceInfoToEdit|null>(null);
  const {t} = useTranslation('home');

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
    setPieceInfoToEdit(null);
  };

  const handleUpdatePieceRequirement = (pieceInfoToEdit: PieceInfoToEdit) =>{
    store.equipmentsRequirementStore.updatePiecesRequirement(pieceInfoToEdit);
    setIsOpened(false);
    setPieceInfoToEdit(null);
    onSetSolution(null);
  };


  const handleDeletePieceRequirement = (pieceInfoToEdit: PieceInfoToEdit) =>{
    store.equipmentsRequirementStore.deletePiecesRequirement(pieceInfoToEdit);
    setIsOpened(false);
    setPieceInfoToEdit(null);
    onSetSolution(null);
  };

  const handleCalculate = () => {
    const requirementByPieces = store.equipmentsRequirementStore.requirementByPieces;
    onSetSolution(calculateSolution(requirementByPieces, store.gameInfoStore.normalMissionItemDropRatio, campaignsById));
    setPieceInfoToEdit(null);
  };

  const handleOpenDialogForEditing = (requirementByPiece: IRequirementByPiece, index : number)=>{
    setPieceInfoToEdit(
        {
          ...requirementByPiece,
          indexInStoreArray: index,
        }
    );
    setIsOpened(true);
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
    <Card variant={'outlined'} className={styles.card}>
      <CardContent>

        <BuiLinedText>{t('addPiecesTitle')}</BuiLinedText>

        {
          equipmentsById ? <div className={styles.selectedPiecesWrapper}>
            {store.equipmentsRequirementStore.requirementByPieces.map((requirementByPiece, index) => {
              const piece = equipmentsById.get(requirementByPiece.pieceId);

              if (!piece) return null;

              return <Card key={`${requirementByPiece.pieceId}-${index}`} elevation={1} className={styles.selectedPiecesCard}
                onClick={() => handleOpenDialogForEditing(requirementByPiece, index)}>
                <CardActionArea>
                  <div className={styles.selectedPiecePaper}>
                    <BuiPaper>
                      <div className={`revert-wiz-transform`}>
                        <Image src={`/images/equipments/@0.5/${piece.icon}.png`}
                          width={63} height={50}
                        ></Image>
                      </div>
                    </BuiPaper>
                    <BuiBanner label={requirementByPiece.count.toString()} width={'120%'} className={styles.countOnCard}/>
                  </div>
                </CardActionArea>

              </Card>;
            })}
            <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
              <div>{t('addButton')}</div>
            </BuiButton>
          </div> : <CircularProgress />
        }

        <DropCampaignSelection store={store} onDropRateChanged={() => onSetSolution(null)}/>

        <Grid container display="flex" justifyContent="center" alignItems="center">
          <BuiButton variant="outlined"
            color={'baButtonPrimary'}
            onClick={handleCalculate} disabled={!store.equipmentsRequirementStore.getAllRequiredPieceIds().size}>
            <div>{t('calculateButton')}</div>
          </BuiButton>
        </Grid>

      </CardContent>


    </Card>

    <PiecesSelectionDialog
      isOpened={isOpened}
      piecesByTier={piecesByTier}
      handleAddPieceRequirement={handleAddPieceRequirement}
      handleUpdatePieceRequirement={handleUpdatePieceRequirement}
      handleDeletePieceRequirement={handleDeletePieceRequirement}
      handleCancel={handleCancel}
      pieceInfoToEdit={pieceInfoToEdit}
    />
  </div>;
};

export default observer(CalculationInputCard);
