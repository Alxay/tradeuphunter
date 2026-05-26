import { Skin } from '../../types/skin';
import { Package } from 'lucide-react';

interface OutputAreaProps {
    outputSkins: Skin[];
    inputCost: number;
    getConditionFromFloat: (skin: Skin) => string;
    conditionToPrice: (skin: Skin) => number;
}

const CONDITION_COLORS: Record<string, string> = {
    'Factory New': 'bg-emerald-500/20 text-emerald-400',
    'Minimal Wear': 'bg-green-500/20 text-green-400',
    'Field-Tested': 'bg-yellow-500/20 text-yellow-400',
    'Well-Worn': 'bg-orange-500/20 text-orange-400',
    'Battle-Scarred': 'bg-red-500/20 text-red-400',
};

export default function OutputArea({
    outputSkins,
    inputCost,
    getConditionFromFloat,
    conditionToPrice,
}: OutputAreaProps) {
    return (
        <div className="w-full shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] p-4 lg:w-[380px]">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">Output</h2>
                {outputSkins.length > 0 && (
                    <span className="rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-400">
                        {outputSkins.length}{' '}
                        {outputSkins.length === 1 ? 'outcome' : 'outcomes'}
                    </span>
                )}
            </div>

            {/* Empty state */}
            {outputSkins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="mb-3 h-12 w-12 text-gray-700" />
                    <p className="text-sm text-gray-500">
                        Fill all 10 slots to see possible outcomes
                    </p>
                </div>
            ) : (
                <div
                    className="max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto pr-1"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#334155 transparent',
                    }}
                >
                    {outputSkins.map((skin, index) => {
                        const price = conditionToPrice(skin);
                        const isProfit = price > inputCost;
                        const condition = getConditionFromFloat(skin);
                        const rarityColor =
                            skin.rarity?.color_hex || '#6b7280';

                        const profitMargin = price - inputCost;
                        const profitText = profitMargin >= 0 
                            ? `+$${profitMargin.toFixed(2)}` 
                            : `-$${Math.abs(profitMargin).toFixed(2)}`;

                        return (
                            <div
                                key={skin.id ?? index}
                                className={`flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ${
                                    isProfit
                                        ? 'border-emerald-500/20 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.02)]'
                                        : 'border-red-500/20 bg-red-950/10 shadow-[0_0_15px_rgba(239,68,68,0.02)]'
                                }`}
                            >
                                {/* Skin image */}
                                <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-950/40 p-1 flex items-center justify-center border border-white/5">
                                    <img
                                        src={skin.image_url}
                                        alt={skin.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                {/* Skin info */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-slate-100" title={skin.name}>
                                        {skin.name}
                                    </p>
                                    <p
                                        className="text-[10px] font-semibold uppercase tracking-wider"
                                        style={{ color: rarityColor }}
                                    >
                                        {skin.rarity?.name ?? 'Unknown'}
                                    </p>

                                    {/* Chance bar */}
                                    {skin.chance != null && (
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-950">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                                                    style={{
                                                        width: `${Math.min(skin.chance, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="shrink-0 font-mono text-[11px] text-orange-400 font-extrabold">
                                                {skin.chance.toFixed(1)}%
                                            </span>
                                        </div>
                                    )}

                                    {/* Condition + Float row */}
                                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                                        {condition && condition !== 'N/A' && (
                                            <span
                                                className={`rounded px-1.5 py-0.5 font-bold ${
                                                    CONDITION_COLORS[
                                                        condition
                                                    ] ?? ''
                                                }`}
                                            >
                                                {condition}
                                            </span>
                                        )}
                                        {skin.float != null && (
                                            <span className="font-mono text-slate-400">
                                                {skin.float.toFixed(8)}
                                            </span>
                                        )}
                                    </div>
                                    {/* Float range */}
                                    <div className="mt-0.5 text-[9px] font-mono text-slate-600">
                                        Range: {skin.min_float.toFixed(2)} – {skin.max_float.toFixed(2)}
                                    </div>
                                </div>

                                {/* Price + extras */}
                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-extrabold text-white">
                                        ${price.toFixed(2)}
                                    </p>
                                    <span
                                        className={`text-[11px] font-bold block ${
                                            isProfit
                                                ? 'text-emerald-400'
                                                : 'text-red-400'
                                        }`}
                                    >
                                        {profitText}
                                    </span>
                                    {(skin.statTrak == true || String(skin.statTrak) === '1') && (
                                        <div className="mt-1.5 inline-block rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                                            ST™
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
