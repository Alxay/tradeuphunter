import SkinSlot from './skinSlot';
import { RotateCcw } from 'lucide-react';
import { Skin } from '../../types/skin';

interface Props {
    skins: (Skin | null)[];
    onSlotClick: (index: number) => void;
    duplicateSkin: (skin: Skin) => void;
    delSkin: (index: number) => void;
    updateFloat: (position: number, value: number) => void;
    reset: () => void;
    conditionToPrice: (skin: Skin) => number;
}

export default function InputArea({
    skins,
    onSlotClick,
    duplicateSkin,
    delSkin,
    reset,
    updateFloat,
    conditionToPrice,
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
                        conditionToPrice={conditionToPrice}
                    />
                ))}
            </div>
        </div>
    );
}
