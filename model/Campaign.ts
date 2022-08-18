export interface Campaign {
    id: number
    area: number
    stage: number
    jpName: string
    rewards: Reward[]
}

export interface Reward {
    id: number
    probability: number
}
