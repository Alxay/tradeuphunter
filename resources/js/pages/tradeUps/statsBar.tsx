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
            color: 'text-cyan-400',
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
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            {/* Section header */}
            <div className="mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Contract Statistics
                </h2>
            </div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-white/5 bg-white/[0.04] p-3 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.07]"
                    >
                        <div className="mb-1.5 flex items-center gap-1.5">
                            <stat.icon
                                className={`h-3.5 w-3.5 ${stat.color}`}
                            />
                            <span className="text-[11px] text-gray-500">
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
            <div className="mt-4 flex items-center gap-4">
                <span className="min-w-fit text-xs text-gray-500">
                    Avg Float
                </span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                    <div
                        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
                        style={{
                            width: `${floatPercent}%`,
                            background:
                                'linear-gradient(90deg, #22c55e, #eab308, #ef4444)',
                        }}
                    />
                    {/* Position marker */}
                    <div
                        className="absolute top-1/2 h-3.5 w-1 -translate-y-1/2 rounded-full bg-white shadow-md shadow-white/30 transition-[left] duration-500 ease-out"
                        style={{ left: `${floatPercent}%` }}
                    />
                </div>
                <span className="min-w-fit font-mono text-xs text-gray-400">
                    {avgNormalizedFloat.toFixed(6)}
                </span>
            </div>
        </div>
    );
}
