export interface Campaign {
    id: string
    area: number
    stage: number
    jpName: string
    rewards: Reward[]
    recommendationWeight?: number
}

export interface Reward {
    id: string
    probability: number
}
