export enum EquipmentCompositionType {
    Piece = 'Piece',
    Composite = 'Composite',
}

export enum GameServer {
    Japan = 'Japan',
    Global = 'Global',
}

export interface Equipment {
    id: string
    category: string
    tier: number
    icon: string
    jpName: string
    equipmentCompositionType: EquipmentCompositionType
    releasedIn: GameServer[]
    recipe?: Recipe[]
}

export interface Recipe {
    id: string
    count: number
}
