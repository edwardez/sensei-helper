import {CampaignsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {Solution} from 'javascript-lp-solver';
import {isString} from 'common/checkVariableTypeUtil';


// Checks if user requested a lot of "unpopular" items(badge, charm, etc).
export const checkIfRequirementInefficient = (solution: Solution<string>, campaignsById: CampaignsById) => {
  let totalPositiveWeightStages = 0;
  let totalNegativeWeightStages = 0;

  for (const [key, value] of Object.entries(solution)) {
    if (!isString(key)|| !value) continue;

    const campaignInfo = campaignsById.get(key?.toString() ?? '');
    const stageWeight = campaignInfo?.recommendationWeight ?? 0;
    if (stageWeight > 0) {
      totalPositiveWeightStages += value;
    } else if (stageWeight < 0) {
      totalNegativeWeightStages += value;
    }
    // Ignoring 0 weight stages
  }

  return totalNegativeWeightStages > totalPositiveWeightStages;
};
