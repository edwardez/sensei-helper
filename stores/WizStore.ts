import {createContext, useContext} from 'react';
import {applySnapshot, Instance, SnapshotIn, SnapshotOut, types} from 'mobx-state-tree';
import {
  EquipmentsRequirementStore, RequirementMode, ResultMode,
} from 'stores/EquipmentsRequirementStore';
import {enableStaticRendering} from 'mobx-react-lite';
import {GameInfoStore} from 'stores/GameInfoStore';
import {GameServer} from 'model/Equipment';
import {StageCalculationStateStore} from 'stores/StageCalculationStateStore';

enableStaticRendering(typeof window === 'undefined');

let wizStore: IWizStore | undefined;

const WizStore = types
    .model('WizStore', {
      equipmentsRequirementStore: types.optional(EquipmentsRequirementStore, {
        requirementByPieces: [],
        requirementByEquipments: [],
        requirementMode: RequirementMode.ByEquipment,
        resultMode: ResultMode.LinearProgram,
      }),
      gameInfoStore: types.optional(GameInfoStore, {
        gameServer: GameServer.Japan,
        normalMissionItemDropRatio: 1,
      }),
      stageCalculationStateStore: types.optional(StageCalculationStateStore, {
        requirementInefficacy: {
          isByPiecesInefficient: false,
          isByEquipmentsInefficient: false,
          hideInefficientRequirementDialog: false,
        },
      },
      ),
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
export const wizExceptionStorageLocalStorageKey = 'SenseiHelperStoreException';

// eslint-disable-next-line require-jsdoc
export function initializeWizStore(snapshot = null) {
  const _store = wizStore ?? WizStore.create({
    equipmentsRequirementStore: {
      requirementByPieces: [],
      requirementByEquipments: [],
      requirementMode: RequirementMode.ByEquipment,
      resultMode: ResultMode.LinearProgram,
    },
    stageCalculationStateStore: {
      requirementInefficacy: {
        isByPiecesInefficient: false,
        isByEquipmentsInefficient: false,
        hideInefficientRequirementDialog: false,
      },
    },
  });

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

// eslint-disable-next-line require-jsdoc
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
