export interface Campaign {
    id: string
    area: number
    stage: number
    jpName: string
    rewards: Reward[]
}

export interface Reward {
    id: string
    probability: number
}
