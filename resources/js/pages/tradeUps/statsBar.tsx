import {
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    Percent,
    Target,
    Wallet,
    Activity,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Skin } from '../../types/skin';

interface StatsBarProps {
    EV: number | null;
    inputCost: number | null;
    expectedReturn: number | null;
    ROI: number | null;
    chanceForProfit: number | null;
    expectedProfit: number | null;
    avgNormalizedFloat: number;
    selectedSkins: (Skin | null)[];
    updateFloat: (position: number, value: number) => void;
    onAvgFloatInput: (targetAvg: number) => void;
}

export default function StatsBar({
    EV,
    inputCost,
    expectedReturn,
    ROI,
    chanceForProfit,
    expectedProfit,
    avgNormalizedFloat,
    selectedSkins,
    updateFloat,
    onAvgFloatInput,
}: StatsBarProps) {
    const [floatInputValue, setFloatInputValue] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const barRef = useRef<HTMLDivElement>(null);

    const stats = [
        {
            label: 'Expected Value',
            value: EV != null ? `$${EV.toFixed(2)}` : '—',
            icon: TrendingUp,
            color: 'text-orange-500',
        },
        {
            label: 'Input Cost',
            value: inputCost != null ? `$${inputCost.toFixed(2)}` : '—',
            icon: DollarSign,
            color: 'text-blue-400',
        },
        {
            label: 'Expected Return',
            value: expectedReturn != null ? `$${expectedReturn.toFixed(2)}` : '—',
            icon: ArrowUpRight,
            color: 'text-purple-400',
        },
        {
            label: 'ROI',
            value: ROI != null ? `${ROI.toFixed(1)}%` : '—',
            icon: Percent,
            color:
                ROI != null && ROI >= 0
                    ? 'text-emerald-400'
                    : 'text-red-400',
        },
        {
            label: 'Profit Chance',
            value:
                chanceForProfit != null
                    ? `${chanceForProfit.toFixed(1)}%`
                    : '—',
            icon: Target,
            color: 'text-amber-400',
        },
        {
            label: 'Expected Profit',
            value:
                expectedProfit != null
                    ? `$${expectedProfit.toFixed(2)}`
                    : '—',
            icon: Wallet,
            color:
                expectedProfit != null && expectedProfit >= 0
                    ? 'text-emerald-400'
                    : 'text-red-400',
        },
    ];

    const floatPercent = Math.max(0, Math.min(avgNormalizedFloat * 100, 100));

    // All 10 slots filled?
    const isFull = selectedSkins.every((s) => s !== null);

    /** Compute normalized float 0–1 from a pointer X position on the bar */
    const getFloatFromEvent = useCallback(
        (clientX: number): number => {
            if (!barRef.current) return avgNormalizedFloat;
            const rect = barRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, x / rect.width));
            return Math.round(ratio * 1000) / 1000;
        },
        [avgNormalizedFloat],
    );

    /** Start drag */
    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (!isFull) return;
            e.preventDefault();
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setIsDragging(true);
            const target = getFloatFromEvent(e.clientX);
            onAvgFloatInput(target);
        },
        [isFull, getFloatFromEvent, onAvgFloatInput],
    );

    /** Drag move */
    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging) return;
            const target = getFloatFromEvent(e.clientX);
            onAvgFloatInput(target);
        },
        [isDragging, getFloatFromEvent, onAvgFloatInput],
    );

    /** End drag */
    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    return (
        <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/30 p-5 backdrop-blur-xl">
            {/* Section header */}
            <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Contract Statistics
                </h2>
            </div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-white/5 bg-slate-900/30 p-3 transition-all duration-200 hover:border-orange-500/15 hover:bg-slate-900/50"
                    >
                        <div className="mb-1.5 flex items-center gap-1.5">
                            <stat.icon
                                className={`h-3.5 w-3.5 ${stat.color}`}
                            />
                            <span className="text-[11px] text-slate-400">
                                {stat.label}
                            </span>
                        </div>
                        <p className={`text-lg font-bold ${stat.color}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Float visualizer bar */}
            <div className="mt-6 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                        Average Contract Float
                        {isFull && (
                            <span className="text-[9px] text-slate-500 font-normal ml-1">(drag or type)</span>
                        )}
                    </span>
                    {isFull ? (
                        <input
                            type="text"
                            inputMode="decimal"
                            className="w-28 rounded border border-orange-500/30 bg-orange-500/5 px-2 py-0.5 text-right font-mono text-sm font-extrabold text-orange-500 outline-none transition-colors focus:border-orange-500/60 focus:bg-orange-500/10"
                            value={floatInputValue || avgNormalizedFloat.toFixed(6).replace('.', ',')}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\./g, ',');
                                setFloatInputValue(val);
                            }}
                            onBlur={() => {
                                const cleanVal = floatInputValue.replace(',', '.');
                                const parsed = parseFloat(cleanVal);
                                if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
                                    onAvgFloatInput(parsed);
                                }
                                setFloatInputValue('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const cleanVal = floatInputValue.replace(',', '.');
                                    const parsed = parseFloat(cleanVal);
                                    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
                                        onAvgFloatInput(parsed);
                                    }
                                    setFloatInputValue('');
                                    (e.target as HTMLInputElement).blur();
                                }
                            }}
                        />
                    ) : (
                        <span className="font-mono text-orange-500 font-extrabold text-sm">
                            {avgNormalizedFloat.toFixed(6).replace('.', ',')}
                        </span>
                    )}
                </div>
                
                {/* Visualizer container — the entire bar area is the drag zone */}
                <div
                    ref={barRef}
                    className={`relative select-none ${isFull ? 'cursor-pointer' : ''}`}
                    style={{ padding: '8px 0' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    {/* The bar with segments */}
                    <div className="relative h-3 w-full rounded-full bg-slate-800 flex overflow-hidden border border-white/5">
                        <div className="h-full bg-emerald-500" style={{ width: '7%' }} title="Factory New (0.00 - 0.07)" />
                        <div className="h-full bg-green-500" style={{ width: '8%' }} title="Minimal Wear (0.07 - 0.15)" />
                        <div className="h-full bg-amber-500" style={{ width: '23%' }} title="Field-Tested (0.15 - 0.38)" />
                        <div className="h-full bg-orange-500" style={{ width: '7%' }} title="Well-Worn (0.38 - 0.45)" />
                        <div className="h-full bg-red-600" style={{ width: '55%' }} title="Battle-Scarred (0.45 - 1.00)" />
                    </div>

                    {/* Position marker / drag handle */}
                    <div
                        className={`absolute top-1 h-[22px] w-[22px] rounded-full border-2 border-white bg-slate-900 z-10 ${
                            isFull
                                ? 'cursor-grab active:cursor-grabbing shadow-[0_0_12px_rgba(255,255,255,0.5)]'
                                : 'shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                        } ${isDragging ? 'scale-110' : ''}`}
                        style={{
                            left: `${floatPercent}%`,
                            transform: 'translateX(-50%)',
                            transition: isDragging ? 'none' : 'left 0.2s ease-out, transform 0.15s',
                        }}
                    >
                        {/* Inner dot */}
                        <div className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-orange-500" />
                    </div>
                </div>

                {/* Legend / Range labels underneath */}
                <div className="flex text-[9px] font-bold text-slate-500 mt-0.5 px-0.5">
                    <div style={{ width: '7%' }} className="text-left text-emerald-400">FN (0.07)</div>
                    <div style={{ width: '8%' }} className="text-left text-green-400">MW (0.15)</div>
                    <div style={{ width: '23%' }} className="text-left text-amber-400">FT (0.38)</div>
                    <div style={{ width: '7%' }} className="text-left text-orange-400">WW (0.45)</div>
                    <div style={{ width: '55%' }} className="text-left text-red-500">BS (1.00)</div>
                </div>
            </div>
        </div>
    );
}
