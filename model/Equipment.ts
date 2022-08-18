export enum GameServer {
    Japan = 0,
    Global = 1,
}


export enum EquipmentCompositionType {
    Piece = 0,
    Composite = 1,
}

export interface Equipment {
    id: number
    category: string
    tier: number
    icon: string
    jpName: string
    equipmentCompositionType: EquipmentCompositionType
    releasedIn: GameServer[]
    recipe?: Recipe[]
}

export interface Recipe {
    id: number
    count: number
}
