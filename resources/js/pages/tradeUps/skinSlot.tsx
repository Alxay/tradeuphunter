import { Copy, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Skin } from '../../types/skin';

export default function SkinSlot({
    position,
    skin,
    onClick,
    duplicateSkin,
    delSkin,
    updateFloat,
    conditionToPrice,
}: {
    position: number;
    skin: Skin | null;
    onClick: () => void;
    duplicateSkin: (skin: Skin) => void;
    delSkin: (index: number) => void;
    updateFloat: (position: number, value: number) => void;
    conditionToPrice: (skin: Skin) => number;
}) {
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

    function getConditionFromFloat(float: number): string {
        if (float >= 0.45) return 'Battle-Scarred';
        if (float >= 0.38) return 'Well-Worn';
        if (float >= 0.15) return 'Field-Tested';
        if (float >= 0.07) return 'Minimal Wear';
        if (float >= 0) return 'Factory New';
        return 'N/A';
    }

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
                        min={skin?.min_float}
                        max={skin?.max_float}
                        className="mb-2 w-16 rounded border border-gray-500 bg-gray-700 px-1 text-sm text-gray-300"
                        step={0.02}
                        onClick={(e) => e.stopPropagation()} // Zapobiega wywołaniu onClick rodzica
                        onChange={(e) => {
                            const nextValue = e.target.value;
                            setLocalFloat(nextValue);
                            const value = parseFloat(nextValue);
                            updateFloat(position, value);
                            skin.condition = getConditionFromFloat(value);

                            if (
                                nextValue === '' ||
                                Number.isNaN(value) ||
                                value < (skin?.min_float || 0) ||
                                value > (skin?.max_float || 1)
                            ) {
                                setInvalidFloat(true);
                            } else {
                                setInvalidFloat(false);
                            }
                        }}
                    />
                    {invalidFloat && (
                        <p className="text-xs text-red-500">
                            Float must be between {skin?.min_float} and{' '}
                            {skin?.max_float}
                        </p>
                    )}
                    <p className="text-sm text-gray-500">{skin.condition}</p>
                    <p className="text-sm font-semibold text-gray-300">
                        {skin.name}
                    </p>
                    <p className="text-sm text-red-600">
                        {conditionToPrice(skin)} $
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
