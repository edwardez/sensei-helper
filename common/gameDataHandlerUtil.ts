import {Campaign} from 'model/Campaign';
import {GameServer} from 'model/Equipment';

export const getRewardsByRegion = (campaign: Campaign, gameServer: GameServer) => {
  // try to get per region data, if not available, fallback to the legacy rewards.
  // `GameServer.Japan` contains the generic data.
  return campaign?.rewardsByRegion[gameServer] ?? campaign?.rewardsByRegion[GameServer.Japan] ?? campaign.rewards;
};
