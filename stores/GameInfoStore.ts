import {Instance, types} from 'mobx-state-tree';
import {GameServer} from 'model/Equipment';


export const GameInfoStore = types
    .model('GameInfoStore', {
      // A number that decides whether game is under drop campaign
      // if so, what is the campaign ratio
      normalMissionItemDropRatio: 1,
      gameServer: types.enumeration<GameServer>('GameServer', Object.values(GameServer)),
      isPlayerLeverMax: false,
    })
    .actions((self) => {
      const changeNormalMissionItemDropRatio = (newRatio: number) => {
        self.normalMissionItemDropRatio = newRatio;
      };

      return {changeNormalMissionItemDropRatio};
    });


export type IGameInfoStore = Instance<typeof GameInfoStore>
