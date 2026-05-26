import { Copy, Trash2, Plus, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skin } from '../../types/skin';

interface SkinSlotProps {
    position: number;
    skin: Skin | null;
    onClick: () => void;
    duplicateSkin: (skin: Skin) => void;
    fillEmptySlots: (skin: Skin) => void;
    delSkin: (index: number) => void;
    updateFloat: (position: number, value: number) => void;
    conditionToPrice: (skin: Skin) => number;
}

const CONDITION_COLORS: Record<string, string> = {
    'Factory New': 'bg-emerald-500/20 text-emerald-400',
    'Minimal Wear': 'bg-green-500/20 text-green-400',
    'Field-Tested': 'bg-yellow-500/20 text-yellow-400',
    'Well-Worn': 'bg-orange-500/20 text-orange-400',
    'Battle-Scarred': 'bg-red-500/20 text-red-400',
};

function getConditionFromFloat(float: number): string {
    if (float >= 0.45) return 'Battle-Scarred';
    if (float >= 0.38) return 'Well-Worn';
    if (float >= 0.15) return 'Field-Tested';
    if (float >= 0.07) return 'Minimal Wear';
    if (float >= 0) return 'Factory New';
    return 'N/A';
}

export default function SkinSlot({
    position,
    skin,
    onClick,
    duplicateSkin,
    fillEmptySlots,
    delSkin,
    updateFloat,
    conditionToPrice,
}: SkinSlotProps) {
    const [invalidFloat, setInvalidFloat] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [localFloat, setLocalFloat] = useState<string>(
        skin?.float != null ? String(skin.float) : '',
    );

    useEffect(() => {
        setLocalFloat(skin?.float != null ? String(skin.float) : '');
        setInvalidFloat(false);
    }, [skin?.id, skin?.float]);

    // --- Empty slot ---
    if (!skin) {
        return (
            <button
                className="group flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-white/[0.01] transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/[0.02] hover:shadow-lg hover:shadow-orange-500/5"
                onClick={onClick}
            >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/60 text-slate-500 transition-all duration-300 group-hover:border-orange-500/50 group-hover:text-orange-400 group-hover:shadow-md group-hover:shadow-orange-500/25">
                    <Plus className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-500 transition-colors group-hover:text-orange-400">
                    Add Skin
                </span>
            </button>
        );
    }

    // --- Filled slot ---
    const condition =
        skin.float != null
            ? getConditionFromFloat(skin.float)
            : skin.condition ?? null;

    const price = conditionToPrice(skin);
    const rarityColor = skin.rarity?.color_hex || '#6b7280';

    return (
        <div
            className="group relative flex h-56 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/35 transition-all duration-300 hover:bg-slate-900/60"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                borderTopColor: rarityColor,
                borderTopWidth: '3.5px',
                boxShadow: hovered
                    ? `0 12px 30px -5px ${rarityColor}35, inset 0 0 12px ${rarityColor}15`
                    : `0 4px 15px -5px ${rarityColor}12`,
                borderColor: hovered ? `${rarityColor}30` : undefined,
            }}
        >
            {/* Action buttons — visible on hover */}
            <div className="absolute right-1 top-1 z-20 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                    className="rounded-md bg-black/60 p-1.5 text-gray-400 backdrop-blur-sm transition-colors hover:bg-emerald-500/20 hover:text-emerald-400"
                    onClick={(e) => {
                        e.stopPropagation();
                        fillEmptySlots(skin);
                    }}
                    title="Fill empty slots"
                >
                    <Layers className="h-3.5 w-3.5" />
                </button>
                <button
                    className="rounded-md bg-black/60 p-1.5 text-gray-400 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        duplicateSkin(skin);
                    }}
                    title="Duplicate"
                >
                    <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                    className="rounded-md bg-black/60 p-1.5 text-gray-400 backdrop-blur-sm transition-colors hover:bg-red-500/20 hover:text-red-400"
                    onClick={(e) => {
                        e.stopPropagation();
                        delSkin(position);
                    }}
                    title="Remove"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Weapon image */}
            <div className="flex flex-1 items-center justify-center p-2 relative">
                {(skin.statTrak == true || String(skin.statTrak) === '1') && (
                    <div className="absolute left-2 top-2 rounded bg-gradient-to-r from-amber-600 to-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                        StatTrak™
                    </div>
                )}
                
                {condition && (
                    <a
                        href={`https://steamcommunity.com/market/listings/730/${encodeURIComponent(
                            (skin.statTrak === true || String(skin.statTrak) === '1' ? 'StatTrak™ ' : '') + 
                            (skin.weapon?.name ? skin.weapon.name + ' | ' : '') + 
                            skin.name + 
                            ` (${condition})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute left-2 bottom-2 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/60 border border-white/10 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-black/90 hover:border-white/20 transition-all duration-200"
                        title="View on Steam Market"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src="https://store.steampowered.com/favicon.ico"
                            alt="Steam"
                            className="h-3 w-3"
                        />
                    </a>
                )}

                <img
                    src={skin.image_url}
                    alt={skin.name}
                    className="max-h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
            </div>

            {/* Info section */}
            <div className="space-y-1 border-t border-white/5 p-2">
                <p className="truncate text-xs font-semibold text-gray-200" title={`${skin.weapon?.name ? skin.weapon.name + ' | ' : ''}${skin.name}`}>
                    {skin.weapon?.name ? skin.weapon.name + ' | ' : ''}{skin.name}
                </p>

                {/* Float input */}
                <input
                    type="number"
                    placeholder="Float"
                    value={localFloat}
                    min={skin.min_float}
                    max={skin.max_float}
                    step={0.01}
                    className={`w-full rounded border px-1.5 py-0.5 font-mono text-xs outline-none transition-colors ${
                        invalidFloat
                            ? 'border-red-500/50 bg-red-500/10 text-red-400'
                            : 'border-white/10 bg-white/5 text-gray-300 focus:border-orange-500/50 focus:bg-orange-500/5'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        const raw = e.target.value;
                        setLocalFloat(raw);
                        const value = parseFloat(raw);
                        updateFloat(position, value);

                        if (
                            raw === '' ||
                            Number.isNaN(value) ||
                            value < (skin.min_float ?? 0) ||
                            value > (skin.max_float ?? 1)
                        ) {
                            setInvalidFloat(true);
                        } else {
                            setInvalidFloat(false);
                        }
                    }}
                />

                {invalidFloat && (
                    <p className="text-[10px] text-red-400">
                        Range: {skin.min_float} – {skin.max_float}
                    </p>
                )}

                {/* Condition + Price */}
                <div className="flex items-center justify-between">
                    {condition && (
                        <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                CONDITION_COLORS[condition] ??
                                'bg-gray-500/20 text-gray-400'
                            }`}
                        >
                            {condition}
                        </span>
                    )}
                    <span className="text-xs font-bold text-white">
                        ${price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
