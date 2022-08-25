import {Instance, types} from 'mobx-state-tree';

export const GameInfoStore = types
    .model({
      // A number that decides whether game is under drop campaign
      // if so, what is the campaign ratio
      normalMissionItemDropRatio: 1,
      gameServer: types.enumeration('GameServer', ['Japan', 'Global']),
      isPlayerLeverMax: false,
    })
    .actions((self) => {
      const changeNormalMissionItemDropRatio = (newRatio: number) => {
        self.normalMissionItemDropRatio = newRatio;
      };
      return {changeNormalMissionItemDropRatio};
    });


export type IGameInfoStore = Instance<typeof GameInfoStore>
export type GameServer = Instance<typeof GameInfoStore.properties.gameServer>
