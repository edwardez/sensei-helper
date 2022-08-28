import {Campaign} from 'model/Campaign';
import {Equipment} from 'model/Equipment';

export type CampaignsById = Map<string, Campaign>;
export type DropPieceIdWithProbAndCount = {
    id: string;
    dropCount?: number;
    dropProb: number;
};
export type EquipmentsById = Map<string, Equipment>;
export type DropPieceIdsWithCount = {requiredItemDrops: DropPieceIdWithProbAndCount[], additionalItemDrops: DropPieceIdWithProbAndCount[]};
