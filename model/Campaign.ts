import {GameServer} from 'model/Equipment';

export interface Campaign {
    id: string
    area: number
    stage: number
    jpName: string
    /** @deprecated Use rewardsByRegion instead. */
    rewards: Reward[]
    // If there is a special per region rewards, it should be used.
    // Otherwise, `GameServer.Japan` should be used.
    rewardsByRegion: { [key in GameServer] : Reward[] }
    recommendationWeight?: number
}

export interface Reward {
    id: string
    probability: number
}
