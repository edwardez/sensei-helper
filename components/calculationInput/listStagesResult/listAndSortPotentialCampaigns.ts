import {Campaign, Reward} from 'model/Campaign';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {RequirementMode} from 'stores/EquipmentsRequirementStore';
import {GameServer} from 'model/Equipment';
import {getRewardsByRegion} from 'common/gameDataHandlerUtil';

export interface PotentialTargetReward extends Reward{
  isTargetReward: boolean;
}

export interface ListedCampaign extends Campaign{
  targetRewardIds: Set<string>;
  potentialTargetRewards: PotentialTargetReward[];
}

export const listAndSortPotentialCampaigns = (
    requirementMode: RequirementMode,
    campaigns: Campaign[],
    piecesState:Map<string, PieceState>,
    byPieceModePieceIds: Set<string>,
    gameServer: GameServer,
)=>{
  if (!campaigns|| !piecesState) return [];
  const listedCampaign: ListedCampaign[] = [];
  const checkIsTargetReward = (id: string) => {
    if (requirementMode === RequirementMode.ByEquipment) {
      return piecesState.has(id);
    } else {
      return byPieceModePieceIds.has(id);
    }
  };

  for (const campaign of campaigns) {
    const targetRewardIds: Set<string> = new Set();
    const potentialTargetRewards: PotentialTargetReward[] = [];
    getRewardsByRegion(campaign, gameServer).forEach((reward)=>{
      const isTargetReward = checkIsTargetReward(reward.id);
      const result = {
        id: reward.id,
        probability: reward.probability,
        isTargetReward: checkIsTargetReward(reward.id),
      };
      if (isTargetReward) {
        targetRewardIds.add(reward.id);
      }
      potentialTargetRewards.push(result);
    });


    if (targetRewardIds.size) {
      listedCampaign.push({
        ...campaign,
        targetRewardIds,
        potentialTargetRewards: [...potentialTargetRewards],
      });
    }
  }


  return listedCampaign.sort((a, b) => {
    if (a.targetRewardIds.size > b.targetRewardIds.size) return -1;
    if (a.targetRewardIds.size < b.targetRewardIds.size) return 1;

    const aAreaStageNumber = a.area*100 + a.stage;
    const bAreaStageNumber = b.area*100 + b.stage;

    return bAreaStageNumber-aAreaStageNumber;
  });
};
