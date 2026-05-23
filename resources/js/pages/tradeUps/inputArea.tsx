import SkinSlot from './skinSlot';
import { RotateCcw } from 'lucide-react';

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
    // optional properties to match other Skin definitions across the project
    statTrak: boolean;
}

interface Props {
    skins: (Skin | null)[];
    onSlotClick: (index: number) => void;
    duplicateSkin: (skin: Skin) => void;
    delSkin: (index: number) => void;
    updateFloat: (position: number, value: number) => void;
    reset: () => void;
}

export default function InputArea({
    skins,
    onSlotClick,
    duplicateSkin,
    delSkin,
    reset,
    updateFloat,
}: Props) {
    return (
        <div className="flex-1">
            {' '}
            {/* flex-1 sprawi, że zajmie odpowiednią szerokość */}
            <h2 className="mb-4 text-xl font-semibold">Input Skins</h2>
            {/* Tutaj później wrzucimy siatkę CSS Grid z 10 slotami */}
            <RotateCcw onClick={reset} />
            <div className="grid grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                    <SkinSlot
                        position={index}
                        skin={skins[index]}
                        duplicateSkin={duplicateSkin}
                        delSkin={delSkin}
                        onClick={() => onSlotClick(index)}
                        updateFloat={updateFloat}
                    />
                ))}
            </div>
        </div>
    );
}
