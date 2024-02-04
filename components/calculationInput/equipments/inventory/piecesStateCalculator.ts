import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {
  EquipmentsByTierAndCategory,
  hashTierAndCategoryKey,
} from 'components/calculationInput/equipments/EquipmentsInput';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {IWizStore} from 'stores/WizStore';

export const calculateRequirementAmount = (
    equipById: EquipmentsById,
    equipByCategory: EquipmentsByTierAndCategory,
    baseId: string,
    targetId: string,
    count: number,
): Map<string, number> => {
  const result: Map<string, number> = new Map();

  const base = equipById.get(baseId);
  const target = equipById.get(targetId);
  if (!base || !target) return result;
  const category = base.category;

  for (let tier = base.tier + 1; tier <= target.tier; tier++) {
    const equip = equipByCategory.get(hashTierAndCategoryKey({tier, category}));

    if (!equip || !equip.recipe) continue;
    for (const recipe of equip.recipe) {
      result.set(recipe.id, (result.get(recipe.id) ?? 0) + recipe.count * count);
    }
  }

  return result;
};

export const calculatePiecesState = (store: IWizStore, equipmentsById: EquipmentsById,
    equipmentsByTierAndCategory: EquipmentsByTierAndCategory) => {
  const piecesStateMap: Map<string, PieceState> = new Map();
  if (!equipmentsById) return piecesStateMap;

  for (const requirement of store.equipmentsRequirementStore.requirementByEquipments) {
    calculateRequirementAmount(
        equipmentsById,
        equipmentsByTierAndCategory,
        requirement.currentEquipmentId,
        requirement.targetEquipmentId,
        requirement.count,
    ).forEach((amount, pieceId) => {
      const stock =
        store.equipmentsRequirementStore.piecesInventory.get(pieceId)
            ?.inStockCount ?? 0;
      const pieceState = piecesStateMap.get(pieceId) ?? {
        pieceId,
        needCount: 0,
        inStockCount: stock,
      };

      pieceState.needCount += amount;
      piecesStateMap.set(pieceId, pieceState);
    });
  }

  return piecesStateMap;
};
