import {Campaign} from 'model/Campaign';
import {Equipment} from 'model/Equipment';

export type CampaignsById = Map<string, Campaign>;
export type DropPieceIdWithCount = {id: string, dropCount: number};
export type EquipmentsById = Map<string, Equipment>;
export type DropPieceIdsWithCount = {requiredItemDrops: DropPieceIdWithCount[], additionalItemDrops: DropPieceIdWithCount[]};
