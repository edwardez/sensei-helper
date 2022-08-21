import {createContext, useContext} from 'react';
import {applySnapshot, Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {EquipmentsRequirementStore} from 'stores/EquipmentsRequirementStore';
import {enableStaticRendering} from 'mobx-react-lite';

enableStaticRendering(typeof window === 'undefined');

let basStore: IBasStore | undefined;

const BasStore = types
    .model({
      equipmentsRequirementStore: types.optional(EquipmentsRequirementStore, {
        requirementByPieces: [],
      }),
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
      // const stop = () => {
      //   clearInterval(timer);
      // };
      return {};
    });

export type IBasStore = Instance<typeof BasStore>
export type IBasStoreSnapshotIn = SnapshotIn<typeof BasStore>
export type IBasStoreSnapshotOut = SnapshotOut<typeof BasStore>

export function initializeBasStore(snapshot = null) {
  const _store = basStore ?? BasStore.create({equipmentsRequirementStore: {
    requirementByPieces: [

    ],
  }});

  // const _store = basStore ?? BasStore.create();

  // If your page has Next.js data fetching methods that use a Mobx basStore, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new basStore
  if (typeof window === 'undefined') return _store;
  // Create the basStore once in the client
  if (!basStore) basStore = _store;

  return basStore;
}

export const StoreContext = createContext(initializeBasStore());

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
  // const store = useMemo(() => initializeBasStore(initialState), [initialState]);
  //
  // return store;
}
