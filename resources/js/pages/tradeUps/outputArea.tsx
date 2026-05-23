interface Rarity {
    id: number;
    name: string;
    color_hex: string;
}
interface Skin {
    id: number;
    name: string;
    image_url: string;
    min_float: number;
    max_float: number;
    rarity?: Rarity; // Zagnieżdżony obiekt rarity
    collection_id: number;
    price?: number | null;
    float?: number | null;
    condition?: string | null;
    statTrak: boolean;
}
interface OutputAreaProps {
    outputSkins?: Skin[];
}

export default function OutputArea({ outputSkins = [] }: OutputAreaProps) {
    return (
        <div className="min-h-400px w-1/3 rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h2 className="mb-4 text-xl font-semibold">Output Skins</h2>
            <div className="space-y-4">
                {outputSkins.map((skin, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-4 rounded-lg border border-gray-700 bg-gray-800 p-2"
                    >
                        <img
                            src={skin.image_url}
                            alt={skin.name}
                            className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div>
                            <p className="font-semibold">{skin.name}</p>
                            <p className="text-sm text-gray-400">
                                Rarity: {skin.rarity?.name ?? 'Unknown'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Price: {skin.price ?? 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Float:{' '}
                                {skin.float != null
                                    ? skin.float.toFixed(10)
                                    : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Condition: {skin.condition ?? 'N/A'}
                            </p>
                            {skin.statTrak && (
                                <p className="text-sm font-bold text-yellow-400">
                                    StatTrak
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
