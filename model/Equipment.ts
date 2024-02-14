export enum EquipmentCompositionType {
    Piece = 'Piece',
    Composite = 'Composite',
}

export enum GameServer {
    Japan = 'Japan',
    Global = 'Global',
    China = 'China',
}

export const EquipmentCategories = [
  'Hat', 'Gloves', 'Shoes',
  'Bag', 'Badge', 'Hairpin',
  'Charm', 'Watch', 'Necklace',
] as const;
export type EquipmentCategory = typeof EquipmentCategories[number];

export interface Equipment {
    id: string
    category: EquipmentCategory
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
