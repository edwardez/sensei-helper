import {Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';

let equipmentsRequirementStore: IEquipmentsRequirementStore | undefined;

const byPiece = types
    .model(
        {
          pieceId: types.string,
          count: types.number,
        }
    );

export const EquipmentsRequirementStore = types
    .model({
      requirementByPieces: types.array(byPiece),
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
      return {addPiecesRequirement};
    });

export type IEquipmentsRequirementStore = Instance<typeof EquipmentsRequirementStore>
export type IRequirementByPiece = Instance<typeof byPiece>

export type IStoreSnapshotIn = SnapshotIn<typeof EquipmentsRequirementStore>
export type IStoreSnapshotOut = SnapshotOut<typeof EquipmentsRequirementStore>

// export function initializeStore(snapshot = null) {
//   const _store = equipmentsRequirementStore ?? EquipmentsRequirementStore.create({requirementByPieces: []});
//
//   // If your page has Next.js data fetching methods that use a Mobx equipmentsRequirementStore, it will
//   // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
//   if (snapshot) {
//     applySnapshot(_store, snapshot);
//   }
//   // For SSG and SSR always create a new equipmentsRequirementStore
//   if (typeof window === 'undefined') return _store;
//   // Create the equipmentsRequirementStore once in the client
//   if (!equipmentsRequirementStore) equipmentsRequirementStore = _store;
//
//   return equipmentsRequirementStore;
// }
//
// export function useStore(initialState: any) {
//   return useMemo(() => initializeStore(initialState), [initialState]);
// }
