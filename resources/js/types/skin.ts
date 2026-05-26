export interface Rarity {
    id: number;
    name: string;
    color_hex: string;
}

export interface Collection {
    id: number;
    name: string;
    api_id: number;
    image_url: string;
}

export interface Skin {
    id: number;
    name: string;
    image_url: string;
    min_float: number;
    max_float: number;
    rarity: Rarity;
    collection_id: number;
    priceBS?: number;
    priceWW?: number;
    priceFT?: number;
    priceMW?: number;
    priceFN?: number;
    stPriceBS?: number;
    stPriceWW?: number;
    stPriceFT?: number;
    stPriceMW?: number;
    stPriceFN?: number;
    // legacy single price field sometimes used in other pages
    price?: number;
    chance?: number;
    collectionChance?: number;
    condition?: string | null;
    statTrak: boolean;
    float?: number | null;
}

export interface ApiData {
    current_page: number;
    data: Skin[];
    total?: number;
    last_page?: number;
}
