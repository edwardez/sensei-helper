import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {
  EquipmentsByTierAndCategory,
  hashTierAndCategoryKey,
} from 'components/calculationInput/equipments/EquipmentsInput';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {IWizStore} from 'stores/WizStore';
import {IRequirementByEquipment} from 'stores/EquipmentsRequirementStore';

export const calculateRequiredPieces = (
    equipById: EquipmentsById,
    equipByCategory: EquipmentsByTierAndCategory,
    requirement: IRequirementByEquipment,
): Map<string, number> => {
  const result: Map<string, number> = new Map();

  const base = equipById.get(requirement.currentEquipmentId);
  const target = equipById.get(requirement.targetEquipmentId);
  if (!base || !target) return result;
  const category = base.category;
  const count = requirement.count;

  for (let tier = base.tier + 1; tier <= target.tier; tier++) {
    const equip = equipByCategory.get(hashTierAndCategoryKey({tier, category}));

    if (!equip || !equip.recipe) continue;
    for (const recipe of equip.recipe) {
      result.set(recipe.id, (result.get(recipe.id) ?? 0) + recipe.count * count);
    }
  }

  return result;
};

export const calculatePiecesState = (
    store: IWizStore,
    equipmentsById: EquipmentsById,
    equipmentsByTierAndCategory: EquipmentsByTierAndCategory
): Map<string, PieceState> => {
  const piecesStateMap: Map<string, PieceState> = new Map();
  if (!equipmentsById) return piecesStateMap;

  for (const requirement of store.equipmentsRequirementStore.requirementByEquipments) {
    calculateRequiredPieces(
        equipmentsById,
        equipmentsByTierAndCategory,
        requirement,
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

export const checkRequirementsSatisfied = (
    piecesState: Map<string, PieceState>,
    requirements: Map<string, number>,
): boolean => {
  return Array.from(requirements.entries())
      .every(([pieceId, need]) => {
        const stock = piecesState.get(pieceId)?.inStockCount ?? 0;
        return need <= stock;
      });
};
