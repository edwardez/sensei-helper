import styles from './CalculationInputCard.module.scss';
import {Card, CardActionArea, CardContent, CircularProgress} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import BuiBanner from 'components/bui/BuiBanner';
import BuiButton from 'components/bui/BuiButton';
import PiecesSelectionDialog from './pieces/PiecesSelectionDialog';
import React, {useMemo, useState} from 'react';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import {IWizStore} from 'stores/WizStore';
import {IRequirementByPiece, PieceInfoToEdit, RequirementMode, ResultMode} from 'stores/EquipmentsRequirementStore';
import {calculateSolution} from 'components/calculationInput/linearProgrammingSolver';
import {CampaignsById, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import Grid from '@mui/material/Unstable_Grid2';
import {observer} from 'mobx-react-lite';
import DropCampaignSelection from 'components/calculationInput/DropCampaignSelection';
import {useTranslation} from 'next-i18next';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import RequirementModeSelection from 'components/calculationInput/RequirementMode/RequirementModeSelection';
import EquipmentsInput, {EquipmentsByTierAndCategory} from 'components/calculationInput/equipments/EquipmentsInput';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import ResultModeSelection from 'components/calculationInput/ResultMode/ResultModeSelection';
import {
  CATEGORY_PREFERENCE,
  IN_STOCK_TYPES,
  INPUT_MODE,
  RESULT_BUTTON_CLICKED,
  RESULT_MODE,
  sendAnalytics,
  TOTAL_EQUIPMENT_TYPES,
  TOTAL_PIECE_TYPES,
} from 'common/gtag';

type CalculationInputCardProps = {
  store: IWizStore,
  equipments: Equipment[],
  campaignsById: CampaignsById,
  equipmentsById: EquipmentsById,
  piecesState: Map<string, PieceState>,
  equipmentsByTierAndCategory: EquipmentsByTierAndCategory,
  onSetSolution: Function,
}


const CalculationInputCard = ({store, equipments, campaignsById, equipmentsById, piecesState,
  equipmentsByTierAndCategory, onSetSolution}
                                  : CalculationInputCardProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const [pieceInfoToEdit, setPieceInfoToEdit] = useState<PieceInfoToEdit|null>(null);

  const {t} = useTranslation('home');

  const handleClickOpen = () => {
    setIsOpened(true);
  };

  const handleAddPieceRequirement = (requirementByPiece: IRequirementByPiece) => {
    store.equipmentsRequirementStore.addPiecesRequirement(requirementByPiece);
    setIsOpened(false);
  };

  const handleCancel = () => {
    setIsOpened(false);
    setPieceInfoToEdit(null);
  };

  const handleUpdatePieceRequirement = (pieceInfoToEdit: PieceInfoToEdit) =>{
    store.equipmentsRequirementStore.updatePiecesRequirement(pieceInfoToEdit);
    setIsOpened(false);
    setPieceInfoToEdit(null);
  };

  const handleDeletePieceRequirement = (pieceInfoToEdit: PieceInfoToEdit) =>{
    store.equipmentsRequirementStore.deletePiecesRequirement(pieceInfoToEdit);
    setIsOpened(false);
    setPieceInfoToEdit(null);
  };

  const handleCalculate = () => {
    const requirementMode = store.equipmentsRequirementStore.requirementMode;
    const resultMode = store.equipmentsRequirementStore.resultMode;
    const totalRequiredEquipTypes = store.equipmentsRequirementStore.requirementByEquipments.length;
    const totalRequiredPiecesTypes = store.equipmentsRequirementStore.requirementByPieces.length;
    sendAnalytics({
      action: RESULT_BUTTON_CLICKED, category: CATEGORY_PREFERENCE, params: {
        [INPUT_MODE]: requirementMode, [RESULT_MODE]: resultMode,
        [TOTAL_EQUIPMENT_TYPES]: totalRequiredEquipTypes,
        [TOTAL_PIECE_TYPES]: totalRequiredPiecesTypes,
        [IN_STOCK_TYPES]: store.equipmentsRequirementStore.piecesInventory.size,
      },
    });
    if (resultMode === ResultMode.ListStages) {
      onSetSolution(ResultMode.ListStages);
      return;
    }
    let requirementByPieces: IRequirementByPiece[] = [];

    if (requirementMode === RequirementMode.ByPiece) {
      requirementByPieces = store.equipmentsRequirementStore.requirementByPieces;
      setPieceInfoToEdit(null);
    } else {
      piecesState.forEach((state, key) => {
        if (state.needCount <= state.inStockCount) return;
        requirementByPieces.push(
            {
              pieceId: state.pieceId,
              count: state.needCount - state.inStockCount,
            }
        );
      });
    }
    onSetSolution(calculateSolution(requirementByPieces,
        store.gameInfoStore.normalMissionItemDropRatio,
        campaignsById,
        store.stageCalculationStateStore.requirementInefficacy.excludeInefficientStages ?? false,
        store.gameInfoStore.gameServer,
    ));
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

  const handleModeChange = (mode: RequirementMode|ResultMode) => onSetSolution(null);

  const filterEquipsBy = (equipments: Equipment[], equipmentCompositionType: EquipmentCompositionType)=>{
    return equipments?.reduce((map, equipment) => {
      if (equipment.equipmentCompositionType !== equipmentCompositionType) return map;
      if (!map.has(equipment.tier)) {
        map.set(equipment.tier, []);
      }
      map.get(equipment.tier).push(equipment);
      return map;
    }, new Map());
  };


  const piecesByTier : Map<number, Equipment[]>= useMemo(() =>
    filterEquipsBy( equipments, EquipmentCompositionType.Piece), [equipments]);

  const equipmentsByTier : Map<number, Equipment[]>= useMemo(() =>
    filterEquipsBy( equipments, EquipmentCompositionType.Composite), [equipments]);


  const shouldDisableCalculateButton = () =>{
    switch (store.equipmentsRequirementStore.requirementMode) {
      case RequirementMode.ByEquipment:
        return !store.equipmentsRequirementStore.requirementByEquipments.length;
      case RequirementMode.ByPiece:
      default:
        return !store.equipmentsRequirementStore.getAllRequiredPieceIds().size;
    }
  };

  const createPiecesSection = () => {
    return <React.Fragment>
      <BuiLinedText>{t('addPiecesTitle')}</BuiLinedText>
      <div className={styles.selectedPiecesWrapper}>
        {store.equipmentsRequirementStore.requirementByPieces.map((requirementByPiece, index) => {
          const piece = equipmentsById.get(requirementByPiece.pieceId);
          if (!piece) return null;

          return <Card key={`${requirementByPiece.pieceId}-${index}`} elevation={1} className={styles.selectedPiecesCard}
            onClick={() => handleOpenDialogForEditing(requirementByPiece, index)}>
            <CardActionArea>
              <div className={styles.selectedPiecePaper}>
                <EquipmentCard imageName={piece.icon} />
                <BuiBanner label={requirementByPiece.count.toString()} width={'120%'} className={styles.countOnCard}/>
              </div>
            </CardActionArea>

          </Card>;
        })}
        <BuiButton color={'baButtonSecondary'} onClick={handleClickOpen} className={styles.addButton}>
          <div>{t('addButton')}</div>
        </BuiButton>
      </div>
    </React.Fragment>;
  };

  const createEquipmentsSection = () => {
    return <EquipmentsInput store={store} equipmentsByTier={equipmentsByTier} equipmentsById={equipmentsById}
      piecesState={piecesState} equipmentsByTierAndCategory={equipmentsByTierAndCategory}/>;
  };

  const createRequirementsInputSection = () => {
    switch (store.equipmentsRequirementStore.requirementMode) {
      case RequirementMode.ByPiece:
        return createPiecesSection();
      case RequirementMode.ByEquipment:
      default:
        return createEquipmentsSection();
    }
  };


  return <div className={styles.container}>
    <Card variant={'outlined'} className={styles.card}>
      <CardContent>
        <RequirementModeSelection store={store} onModeChange={handleModeChange}/>


        {
          equipmentsById ?
              createRequirementsInputSection() :
              <CircularProgress />
        }

        <DropCampaignSelection store={store} onDropRateChanged={() => onSetSolution(null)}/>
        <ResultModeSelection store={store} onModeChange={handleModeChange}/>

        <Grid container display="flex" justifyContent="center" alignItems="center">
          <BuiButton
            color={'baButtonPrimary'}
            onClick={handleCalculate} disabled={shouldDisableCalculateButton()}>
            <div>{
              store.equipmentsRequirementStore.resultMode === ResultMode.LinearProgram?
                  t('calculateButton') : t('listButton')
            }</div>
          </BuiButton>
        </Grid>

      </CardContent>


    </Card>

    <PiecesSelectionDialog
      isOpened={isOpened}
      piecesByTier={piecesByTier}
      piecesById={equipmentsById}
      handleAddPieceRequirement={handleAddPieceRequirement}
      handleUpdatePieceRequirement={handleUpdatePieceRequirement}
      handleDeletePieceRequirement={handleDeletePieceRequirement}
      handleCancel={handleCancel}
      pieceInfoToEdit={pieceInfoToEdit}
    />
  </div>;
};

export default observer(CalculationInputCard);
