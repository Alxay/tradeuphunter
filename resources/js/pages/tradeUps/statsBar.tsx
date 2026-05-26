import {
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    Percent,
    Target,
    Wallet,
    Activity,
} from 'lucide-react';

interface StatsBarProps {
    EV: number | null;
    inputCost: number | null;
    expectedReturn: number | null;
    ROI: number | null;
    chanceForProfit: number | null;
    expectedProfit: number | null;
    avgNormalizedFloat: number;
}

export default function StatsBar({
    EV,
    inputCost,
    expectedReturn,
    ROI,
    chanceForProfit,
    expectedProfit,
    avgNormalizedFloat,
}: StatsBarProps) {
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
                    </span>
                    <span className="font-mono text-orange-500 font-extrabold text-sm">
                        {avgNormalizedFloat.toFixed(6)}
                    </span>
                </div>
                
                {/* Visualizer container */}
                <div className="relative">
                    {/* The bar with segments */}
                    <div className="relative h-3 w-full rounded-full bg-slate-800 flex overflow-hidden border border-white/5">
                        <div className="h-full bg-emerald-500" style={{ width: '7%' }} title="Factory New (0.00 - 0.07)" />
                        <div className="h-full bg-green-500" style={{ width: '8%' }} title="Minimal Wear (0.07 - 0.15)" />
                        <div className="h-full bg-amber-500" style={{ width: '23%' }} title="Field-Tested (0.15 - 0.38)" />
                        <div className="h-full bg-orange-500" style={{ width: '7%' }} title="Well-Worn (0.38 - 0.45)" />
                        <div className="h-full bg-red-600" style={{ width: '55%' }} title="Battle-Scarred (0.45 - 1.00)" />
                    </div>

                    {/* Position marker pointing to the bar */}
                    <div
                        className="absolute -top-1.5 h-6 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-[left] duration-500 ease-out z-10"
                        style={{ left: `${floatPercent}%`, transform: 'translateX(-50%)' }}
                    />
                </div>

                {/* Legend / Range labels underneath */}
                <div className="flex text-[9px] font-bold text-slate-500 mt-1.5 px-0.5">
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
