import { Skin } from '../../types/skin';

interface OutputAreaProps {
    outputSkins?: Skin[];
    getConditionFromFloat?: (skin: Skin) => string;
    conditionToPrice?: (skin: Skin) => number;
}

export default function OutputArea({
    outputSkins = [],
    getConditionFromFloat,
    conditionToPrice,
}: OutputAreaProps) {
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
                                Price:{' '}
                                {conditionToPrice
                                    ? conditionToPrice(skin)
                                    : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Chance:{' '}
                                {skin.chance != null
                                    ? skin.chance.toFixed(2) + '%'
                                    : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Collection chance:{' '}
                                {skin.collectionChance != null
                                    ? skin.collectionChance.toFixed(2) + '%'
                                    : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Float:{' '}
                                {skin.float != null
                                    ? skin.float.toFixed(10)
                                    : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-400">
                                Condition:{' '}
                                {getConditionFromFloat
                                    ? getConditionFromFloat(skin)
                                    : 'N/A'}
                            </p>
                            {skin.statTrak == true && (
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
