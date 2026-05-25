import SkinSlot from './skinSlot';
import { RotateCcw } from 'lucide-react';
import { Skin } from '../../types/skin';

interface Props {
    skins: (Skin | null)[];
    onSlotClick: (index: number) => void;
    duplicateSkin: (skin: Skin) => void;
    fillEmptySlots: (skin: Skin) => void;
    delSkin: (index: number) => void;
    updateFloat: (position: number, value: number) => void;
    reset: () => void;
    conditionToPrice: (skin: Skin) => number;
}

export default function InputArea({
    skins,
    onSlotClick,
    duplicateSkin,
    fillEmptySlots,
    delSkin,
    reset,
    updateFloat,
    conditionToPrice,
}: Props) {
    const filledCount = skins.filter((s) => s !== null).length;

    return (
        <div className="flex-1">
            {/* Header row */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Input</h2>
                    <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                            filledCount === 10
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/10 text-gray-400'
                        }`}
                    >
                        {filledCount}/10
                    </span>
                </div>

                <button
                    onClick={reset}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                </button>
            </div>

            {/* 5×2 skin slots grid */}
            <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, index) => (
                    <SkinSlot
                        key={index}
                        position={index}
                        skin={skins[index]}
                        duplicateSkin={duplicateSkin}
                        fillEmptySlots={fillEmptySlots}
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
