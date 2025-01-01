import {types} from 'mobx-state-tree';
import {RequirementMode} from 'stores/EquipmentsRequirementStore';


export const StageCalculationStateStore = types
    .model('StageCalculationStateStore', {
      requirementInefficacy: types.model({
        isByPiecesInefficient: false,
        isByEquipmentsInefficient: false,
        hideInefficientRequirementDialog: false,
        // whether to exclude stages like 17-4 in calculation
        excludeInefficientStages: false,
      }
      ),
    })
    .actions((self) => {
      const setHideInefficientRequirementDialog = (hideDialog?: boolean) => {
        if (hideDialog === undefined) return;

        self.requirementInefficacy.hideInefficientRequirementDialog = hideDialog;
      };
      const setExcludeInefficientStages = (excludeInefficientStages?: boolean) => {
        if (excludeInefficientStages === undefined) return;

        self.requirementInefficacy.excludeInefficientStages = excludeInefficientStages;
      };

      const setIsInefficientRequirement = (requirementMode: RequirementMode, isInefficient: boolean) => {
        if (requirementMode === RequirementMode.ByEquipment) {
          self.requirementInefficacy.isByEquipmentsInefficient = isInefficient;
        } else if (requirementMode === RequirementMode.ByPiece) {
          self.requirementInefficacy.isByPiecesInefficient = isInefficient;
        } else {
          console.error('setIsInefficientRequirement is unimplemented for ' + requirementMode);
        }
      };

      return {
        setHideInefficientRequirementDialog, setIsInefficientRequirement, setExcludeInefficientStages,
      };
    })
    .views((self) => {
      const getRequirementInEfficacy = (requirementMode: RequirementMode) => {
        switch (requirementMode) {
          case RequirementMode.ByEquipment:
            return self.requirementInefficacy.isByEquipmentsInefficient;
          default:
            return self.requirementInefficacy.isByPiecesInefficient;
        }
      };

      return {getRequirementInEfficacy};
    })
;

