import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';

let equipmentsRequirementStore: IEquipmentsRequirementStore | undefined;

const byPiece = types
    .model(
        {
          pieceId: types.string,
          count: types.number,
        }
    );

const byEquipment = types
    .model(
        {
          currentEquipmentId: types.string,
          targetEquipmentId: types.string,
          count: types.number,
        }
    );

export enum RequirementMode {
  ByPiece = 'ByPiece',
  ByEquipment = 'ByEquipment',
}

export const EquipmentsRequirementStore = types
    .model({
      requirementByPieces: types.array(byPiece),
      requirementByEquipments: types.array(byEquipment),
      requirementMode: types.enumeration<RequirementMode>('RequirementMode', Object.values(RequirementMode)),
    })
    .actions((self) => {
      // let timer: any;
      // const start = () => {
      //   timer = setInterval(() => {
      //     // mobx-state-tree doesn't allow anonymous callbacks changing data.
      //     // Pass off to another action instead (need to cast self as any
      //     // because TypeScript doesn't yet know about the actions we're
      //     // adding to self here)
      //     (self as any).update();
      //   }, 1000);
      // };
      // const update = () => {
      //   self.lastUpdate = new Date(Date.now());
      //   self.light = true;
      // };
      // const stop = () => {
      //   clearInterval(timer);
      // };
      const addPiecesRequirement = (requirement : IRequirementByPiece) => {
        self.requirementByPieces.push(requirement);
      };

      const updatePiecesRequirement = (pieceInfoToEdit : PieceInfoToEdit) => {
        const requirement = self.requirementByPieces[pieceInfoToEdit.indexInStoreArray];
        if (!requirement) return;
        self.requirementByPieces[pieceInfoToEdit.indexInStoreArray] = {
          pieceId: pieceInfoToEdit.pieceId,
          count: pieceInfoToEdit.count,
        };
      };

      const deletePiecesRequirement = (pieceInfoToEdit : PieceInfoToEdit) => {
        const requirement = self.requirementByPieces[pieceInfoToEdit.indexInStoreArray];
        if (!requirement) return;

        self.requirementByPieces.splice(pieceInfoToEdit.indexInStoreArray, 1);
      };

      const getAllRequiredPieceIds = () => {
        return self.requirementByPieces.reduce<Set<string>>(
            (set, curr) => {
              return set.add(curr.pieceId);
            }, new Set()
        );
      };

      const updateRequirementMode = (requirementMode: RequirementMode) => {
        if (!requirementMode) return;
        self.requirementMode = requirementMode;
      };
      return {addPiecesRequirement, updatePiecesRequirement, deletePiecesRequirement,
        getAllRequiredPieceIds, updateRequirementMode};
    });

export type IEquipmentsRequirementStore = Instance<typeof EquipmentsRequirementStore>
export type IRequirementByPiece = Instance<typeof byPiece>
export type IRequirementByEquipment = Instance<typeof byEquipment>
export type PieceInfoToEdit = IRequirementByPiece & {
    indexInStoreArray : number
};
export type EquipmentInfoToEdit = IRequirementByEquipment & {
  indexInStoreArray : number
};

export type IStoreSnapshotIn = SnapshotIn<typeof EquipmentsRequirementStore>
export type IStoreSnapshotOut = SnapshotOut<typeof EquipmentsRequirementStore>
