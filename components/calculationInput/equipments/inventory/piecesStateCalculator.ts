import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {
  EquipmentsByTierAndCategory,
  hashTierAndCategoryKey,
} from 'components/calculationInput/equipments/EquipmentsInput';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {IWizStore} from 'stores/WizStore';

export const calculatePiecesState = (store: IWizStore, equipmentsById: EquipmentsById,
    equipmentsByTierAndCategory: EquipmentsByTierAndCategory) => {
  const piecesStateMap: Map<string, PieceState> = new Map();
  if (!equipmentsById) return piecesStateMap;

  for (const requirement of store.equipmentsRequirementStore.requirementByEquipments) {
    const base = equipmentsById.get(requirement.currentEquipmentId);
    const target = equipmentsById.get(requirement.targetEquipmentId);
    if (!base || !target) continue;
    for (let tier = base.tier+1; tier <= target.tier; tier++) {
      const category = base.category;
      const equip = equipmentsByTierAndCategory.get(hashTierAndCategoryKey({tier, category}));

      if (!equip || !equip.recipe) continue;
      for (const recipe of equip.recipe) {
        const pieceState = piecesStateMap.get(recipe.id);
        if (pieceState) {
          pieceState.needCount += recipe.count * requirement.count;
        } else {
          const stock = store.equipmentsRequirementStore.piecesInventory.get(recipe.id)?.inStockCount ?? 0;
          piecesStateMap.set(recipe.id, {
            pieceId: recipe.id,
            needCount: recipe.count * requirement.count,
            inStockCount: stock,
          });
        }
      }
    }
  }

  return piecesStateMap;
};
