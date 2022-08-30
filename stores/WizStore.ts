import {createContext, useContext} from 'react';
import {applySnapshot, Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {EquipmentsRequirementStore} from 'stores/EquipmentsRequirementStore';
import {enableStaticRendering} from 'mobx-react-lite';
import {GameInfoStore} from 'stores/GameInfoStore';
import {GameServer} from 'model/Equipment';

enableStaticRendering(typeof window === 'undefined');

let wizStore: IWizStore | undefined;

const WizStore = types
    .model({
      equipmentsRequirementStore: types.optional(EquipmentsRequirementStore, {
        requirementByPieces: [],
      }),
      gameInfoStore: types.optional(GameInfoStore, {
        gameServer: GameServer.Japan,
        normalMissionItemDropRatio: 1,
      }),
    }).actions((self) => {
      const changeGameServer = (server: GameServer) => {
        self.gameInfoStore.gameServer = server;
        self.equipmentsRequirementStore.requirementByPieces.clear();
      };
      return {changeGameServer};
    });


export type IWizStore = Instance<typeof WizStore>
export type IWizStoreSnapshotIn = SnapshotIn<typeof WizStore>
export type IWizStoreSnapshotOut = SnapshotOut<typeof WizStore>
export const isWizStore = (input: any) => WizStore.is(input);
export const wizStorageLocalStorageKey = 'SenseiHelperStore';

export function initializeWizStore(snapshot = null) {
  const _store = wizStore ?? WizStore.create({equipmentsRequirementStore: {
    requirementByPieces: [

    ],
  }});

  // const _store = wizStore ?? WizStore.create();

  // If your page has Next.js data fetching methods that use a Mobx wizStore, it will
  // get hydrated here, check `pages/ssg.tsx` and `pages/ssr.tsx` for more details
  if (snapshot) {
    applySnapshot(_store, snapshot);
  }
  // For SSG and SSR always create a new wizStore
  if (typeof window === 'undefined') return _store;
  // Create the wizStore once in the client
  if (!wizStore) wizStore = _store;

  return wizStore;
}

export const StoreContext = createContext(initializeWizStore());

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
  // const store = useMemo(() => initializeWizStore(initialState), [initialState]);
  //
  // return store;
}
