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
}

export default function SkinSlot({
    skin,
    onClick,
}: {
    skin: Skin | null;
    onClick: () => void;
}) {
    return (
        <button
            className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-700"
            onClick={onClick}
        >
            {/* Kółko z plusem */}
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-500 text-gray-400">
                {skin ? (
                    <img
                        src={skin.image_url}
                        alt={skin.name}
                        className="h-full w-full rounded-full object-cover"
                    />
                ) : (
                    <span className="text-xl font-light">+</span>
                )}
            </div>
            {/* Tekst pod plusem */}
            <span className="text-sm font-semibold text-gray-300">Slot</span>
        </button>
    );
}
