import { Copy, Trash2 } from 'lucide-react';
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
}

export default function SkinSlot({
    position,
    skin,
    onClick,
    duplicateSkin,
    delSkin,
}: {
    position: number;
    skin: Skin | null;
    onClick: () => void;
    duplicateSkin: (skin: Skin) => void;
    delSkin: (index: number) => void;
}) {
    return (
        <button
            className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-700"
            onClick={onClick}
        >
            {skin ? (
                <>
                    <Copy
                        onClick={(e) => {
                            e.stopPropagation(); // Zapobiega wywołaniu onClick rodzica
                            duplicateSkin(skin);
                        }}
                    />
                    {skin ? (
                        <Trash2
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
