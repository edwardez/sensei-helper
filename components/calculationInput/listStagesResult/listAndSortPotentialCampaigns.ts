import {Campaign, Reward} from 'model/Campaign';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';

export interface ListedCampaign extends Campaign{
  targetRewards: Reward[]
}

export const listAndSortPotentialCampaigns = (
    campaigns: Campaign[],
    piecesState:Map<string, PieceState>,
)=>{
  if (!campaigns|| !piecesState) return [];
  const listedCampaign: ListedCampaign[] = [];
  for (const campaign of campaigns) {
    const potentialRewards = campaign.rewards.filter((reward) => piecesState.has(reward.id));
    if (potentialRewards.length) {
      listedCampaign.push({
        ...campaign,
        targetRewards: [...potentialRewards],
      });
    }
  }

  return listedCampaign.sort((a, b) => {
    if (a.targetRewards.length > b.targetRewards.length) return -1;
    if (a.targetRewards.length < b.targetRewards.length) return 1;

    const aAreaStageNumber = a.area*100 + a.stage;
    const bAreaStageNumber = b.area*100 + b.stage;

    return bAreaStageNumber-aAreaStageNumber;
  });
};
