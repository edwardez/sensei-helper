import {IRequirementByPiece} from 'stores/EquipmentsRequirementStore';
import {Campaign} from 'model/Campaign';
import * as solver from 'javascript-lp-solver';
import {IModelVariableConstraint} from 'javascript-lp-solver';
import {GameServer} from 'model/Equipment';
import {getRewardsByRegion} from 'common/gameDataHandlerUtil';

export type PieceDropProb = {[key:string]: number};

export const calculateSolution = (
    requirements: IRequirementByPiece[],
    normalMissionItemDropRatio: number,
    piecesDropByCampaignId: Map<string, Campaign>,
    excludeInefficientStages = false,
    gameServer: GameServer,
) => {
  const constraints: { [key: string]: IModelVariableConstraint } = requirements.reduce<{[key: string]: IModelVariableConstraint}>(
      (partialConstraints, requirement) => {
        partialConstraints[requirement.pieceId] = {
          //  User can select a same piece multiple times so merges the count here.
          'min': requirement.count + (partialConstraints[requirement.pieceId]?.min ?? 0),
        };
        return partialConstraints;
      }
      , {});

  const requiredPieceIds = new Set(Object.keys(constraints));
  const variables : { [key:string] : PieceDropProb} = {};
  piecesDropByCampaignId.forEach(( campaign, campaignId) =>{
    if (excludeInefficientStages && (campaign?.recommendationWeight ?? 0) < 0) {
      return;
    }
    const filteredProbs = getRewardsByRegion(campaign, gameServer)
        .filter((reward) => requiredPieceIds.has(reward.id))
        .reduce<PieceDropProb>((prev, reward) => {
          prev[reward.id] = reward.probability * normalMissionItemDropRatio;
          return prev;
        }, {});

    if (Object.keys(filteredProbs).length) {
      filteredProbs['ap'] = 10;
      variables[campaignId] = filteredProbs;
    }
  });

  constraints['ap'] = {'min': 0};
  const model = {
    'optimize': 'ap',
    'opType': 'min' as const,
    constraints,
    variables};

  // eslint-disable-next-line new-cap
  return solver.Solve(model);
};
