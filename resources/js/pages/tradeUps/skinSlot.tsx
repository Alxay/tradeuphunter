import { Copy, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
    rarity: Rarity; // Zagnieżdżony obiekt rarity
    price?: number | null;
    condition?: string | null;
    statTrak: boolean;
    float?: number | null;
}

export default function SkinSlot({
    position,
    skin,
    onClick,
    duplicateSkin,
    delSkin,
    updateFloat,
}: {
    position: number;
    skin: Skin | null;
    onClick: () => void;
    duplicateSkin: (skin: Skin) => void;
    delSkin: (index: number) => void;
    updateFloat: (position: number, value: number) => void;
}) {
    function conditionToFloatRanges(condition: string): {
        min: number;
        max: number;
    } {
        switch (condition) {
            case 'Factory New':
                return { min: 0.0, max: 0.07 };
            case 'Minimal Wear':
                return { min: 0.07, max: 0.15 };
            case 'Field-Tested':
                return { min: 0.15, max: 0.38 };
            case 'Well-Worn':
                return { min: 0.38, max: 0.45 };
            case 'Battle-Scarred':
                return { min: 0.45, max: 1.0 };
            default:
                return { min: 0.0, max: 1.0 };
        }
    }

    const floatRange = useMemo(() => {
        if (!skin) {
            return null;
        }

        return conditionToFloatRanges(skin.condition || '');
    }, [skin]);

    const [invalidFloat, setInvalidFloat] = useState(false);
    const [localFloat, setLocalFloat] = useState<string>(
        skin?.float !== undefined && skin?.float !== null
            ? String(skin.float)
            : '',
    );

    useEffect(() => {
        setLocalFloat(
            skin?.float !== undefined && skin?.float !== null
                ? String(skin.float)
                : '',
        );
        setInvalidFloat(false);
    }, [skin?.id]);

    return (
        <button
            className="relative flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-700"
            onClick={onClick}
        >
            {skin ? (
                <>
                    <Copy
                        className="absolute top-2 left-2 z-20 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation(); // Zapobiega wywołaniu onClick rodzica
                            duplicateSkin(skin);
                        }}
                    />
                    {skin ? (
                        <Trash2
                            className="absolute top-2 right-2 z-20 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation(); // Zapobiega wywołaniu onClick rodzica
                                delSkin(position);
                            }}
                        />
                    ) : null}
                    <img
                        src={skin.image_url}
                        alt={skin.name}
                        className="h-full w-full rounded-full object-cover"
                    />

                    <p>
                        {skin.min_float}-{skin.max_float}
                    </p>
                    <input
                        type="number"
                        placeholder="Float"
                        value={localFloat}
                        min={floatRange?.min}
                        max={floatRange?.max}
                        className="mb-2 w-16 rounded border border-gray-500 bg-gray-700 px-1 text-sm text-gray-300"
                        step={0.02}
                        onClick={(e) => e.stopPropagation()} // Zapobiega wywołaniu onClick rodzica
                        onChange={(e) => {
                            const nextValue = e.target.value;
                            setLocalFloat(nextValue);
                            const value = parseFloat(nextValue);
                            updateFloat(position, value);

                            if (
                                nextValue === '' ||
                                Number.isNaN(value) ||
                                value < (floatRange?.min || 0) ||
                                value > (floatRange?.max || 1)
                            ) {
                                setInvalidFloat(true);
                            } else {
                                setInvalidFloat(false);
                            }
                        }}
                    />
                    {invalidFloat && (
                        <p className="text-xs text-red-500">
                            Float must be between {floatRange?.min} and{' '}
                            {floatRange?.max}
                        </p>
                    )}
                    <p className="text-sm text-gray-500">{skin.condition}</p>
                    <p className="text-sm font-semibold text-gray-300">
                        {skin.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {skin.price ? skin.price + ' $' : 'N/A'}
                    </p>
                    {skin.statTrak != false && (
                        <p className="font-bold text-yellow-400">StatTrak</p>
                    )}
                </>
            ) : (
                <>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-500 text-gray-400">
                        <span className="text-xl font-light">+</span>
                    </div>

                    <span className="text-sm font-semibold text-gray-300">
                        Slot
                    </span>
                </>
            )}
        </button>
    );
}
