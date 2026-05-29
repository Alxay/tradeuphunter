import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Coins, SlidersHorizontal, ArrowUpDown, Info } from 'lucide-react';
import { getSkinSlug } from '@/lib/utils';

interface Rarity {
    id: number;
    name: string;
    color_hex: string;
}

interface Weapon {
    id: number;
    name: string;
}

interface Skin {
    id: number;
    name: string;
    image_url: string;
    min_float: number;
    max_float: number;
    rarity: Rarity;
    weapon?: Weapon;
    priceBS?: number | string;
    priceWW?: number | string;
    priceFT?: number | string;
    priceMW?: number | string;
    priceFN?: number | string;
    stPriceBS?: number | string;
    stPriceWW?: number | string;
    stPriceFT?: number | string;
    stPriceMW?: number | string;
    stPriceFN?: number | string;
}

interface Collection {
    id: number;
    name: string;
    image_url: string;
}

interface Props {
    collection: Collection;
    skins: Skin[];
}

const CONDITIONS = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred',
] as const;

const CONDITION_SHORT: Record<string, string> = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scarred': 'BS',
};

const SORT_OPTIONS: Record<string, string> = {
    'rarity_desc': 'Rarity: High to Low',
    'rarity_asc': 'Rarity: Low to High',
    'price_asc': 'Price: Low to High',
    'price_desc': 'Price: High to Low',
    'name_asc': 'Alphabetical',
};

function getPriceForSelected(skin: Skin, condition: string, isSt: boolean): number {
    let val: any = 0;
    if (isSt) {
        switch (condition) {
            case 'Factory New': val = skin.stPriceFN; break;
            case 'Minimal Wear': val = skin.stPriceMW; break;
            case 'Field-Tested': val = skin.stPriceFT; break;
            case 'Well-Worn': val = skin.stPriceWW; break;
            case 'Battle-Scarred': val = skin.stPriceBS; break;
        }
    } else {
        switch (condition) {
            case 'Factory New': val = skin.priceFN; break;
            case 'Minimal Wear': val = skin.priceMW; break;
            case 'Field-Tested': val = skin.priceFT; break;
            case 'Well-Worn': val = skin.priceWW; break;
            case 'Battle-Scarred': val = skin.priceBS; break;
        }
    }

    if (val === null || val === undefined) {
        return 0;
    }

    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
}

export default function Show({ collection, skins }: Props) {
    const [conditionFilter, setConditionFilter] = useState<string>('Field-Tested');
    const [statTrakFilter, setStatTrakFilter] = useState<boolean>(false);
    
    // Price range filters
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    
    // Sorting & Dropdown state
    const [sortBy, setSortBy] = useState<string>('rarity_desc'); // default: rarity desc
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState<boolean>(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Close sorting dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
                setIsSortDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtering and sorting logic
    const filteredAndSortedSkins = useMemo(() => {
        let result = [...skins];

        // Apply price range filters based on active pricing state
        result = result.filter((skin) => {
            const price = getPriceForSelected(skin, conditionFilter, statTrakFilter);
            
            // If the skin doesn't have a price for this condition, it is technically not sold or N/A
            if (price === 0) return false;

            if (minPrice && parseFloat(minPrice) > price) return false;
            if (maxPrice && parseFloat(maxPrice) < price) return false;

            return true;
        });

        // Apply sorting
        result.sort((a, b) => {
            const priceA = getPriceForSelected(a, conditionFilter, statTrakFilter);
            const priceB = getPriceForSelected(b, conditionFilter, statTrakFilter);

            if (sortBy === 'price_asc') {
                return priceA - priceB;
            } else if (sortBy === 'price_desc') {
                return priceB - priceA;
            } else if (sortBy === 'rarity_desc') {
                // Lower rarity id means higher tier (Covert = 1)
                return a.rarity.id - b.rarity.id;
            } else if (sortBy === 'rarity_asc') {
                return b.rarity.id - a.rarity.id;
            } else if (sortBy === 'name_asc') {
                const nameA = `${a.weapon?.name || ''} ${a.name}`;
                const nameB = `${b.weapon?.name || ''} ${b.name}`;
                return nameA.localeCompare(nameB);
            }
            return 0;
        });

        return result;
    }, [skins, conditionFilter, statTrakFilter, minPrice, maxPrice, sortBy]);

    return (
        <>
            <Head title={`${collection.name} Skins & Prices - TradeUpHunter`}>
                <meta name="description" content={`Explore all CS2 skins from the ${collection.name}. Compare prices, toggle StatTrak™, filter by min/max values, and inspect individual skin detail pages.`} />
                <meta name="keywords" content={`cs2 ${collection.name}, ${collection.name} weapon list, cs2 skin prices database, filter weapon collections`} />
            </Head>

            <div className="pageContent min-h-[90vh] bg-[#0b0f19] p-6 text-white selection:bg-orange-500 selection:text-black">
                {/* Back Link */}
                <div className="mb-6">
                    <Link
                        href="/skins"
                        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Collections Database</span>
                    </Link>
                </div>

                {/* Collection Header section */}
                <div className="relative mb-8 rounded-3xl border border-white/5 bg-gradient-to-r from-slate-950/60 to-slate-900/40 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[30%] h-[150%] bg-orange-500/5 blur-[80px] pointer-events-none transform rotate-12" />
                    
                    <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-2xl bg-black/40 border border-white/5 p-3 shadow-md">
                        <img
                            src={collection.image_url}
                            alt={collection.name}
                            className="h-full w-auto object-contain drop-shadow-[0_4px_10px_rgba(251,146,60,0.15)]"
                        />
                    </div>
                    
                    <div className="text-center md:text-left space-y-1">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                            Weapon Collection
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white pt-1">
                            {collection.name}
                        </h1>
                        <p className="text-xs text-slate-400 max-w-xl">
                            Browse all weapon finishes, filter average prices dynamically, and click on any skin to inspect its float wear thresholds, adjacent rarities, and trade-up potential.
                        </p>
                    </div>
                </div>

                {/* Filters control bar */}
                <div className="space-y-4 border border-white/5 bg-slate-900/10 rounded-3xl p-5 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <SlidersHorizontal className="h-4 w-4 text-orange-500" />
                            <span>Filters & Price Multipliers</span>
                        </div>
                        
                        <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-slate-950/20 px-3.5 py-1.5 text-xs text-slate-400">
                            <Info className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                            <span>Prices display 30d averages from the Steam Market.</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* StatTrak Custom Toggle */}
                        <button
                            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
                                statTrakFilter
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold'
                                    : 'border-white/10 bg-[#161b22] text-slate-400 hover:border-white/20 hover:bg-white/5'
                            }`}
                            onClick={() => setStatTrakFilter((p) => !p)}
                        >
                            <div className={`h-4.5 w-8 rounded-full transition-colors p-0.5 ${statTrakFilter ? 'bg-amber-500' : 'bg-slate-600'}`}>
                                <div className={`h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${statTrakFilter ? 'translate-x-3.5' : 'translate-x-0'}`} />
                            </div>
                            StatTrak™
                        </button>

                        {/* Price Range Filters */}
                        <div className="flex items-center gap-2 border border-white/10 bg-[#161b22] rounded-xl px-3 py-1.5">
                            <Coins className="h-4 w-4 text-slate-500" />
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                className="w-20 bg-transparent text-xs text-white outline-none border-none placeholder-slate-600 focus:placeholder-slate-400"
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="text-slate-600 text-xs">-</span>
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                className="w-20 bg-transparent text-xs text-white outline-none border-none placeholder-slate-600 focus:placeholder-slate-400"
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>

                        {/* Custom Select Sort Dropdown */}
                        <div className="relative" ref={sortDropdownRef}>
                            <button
                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                className="flex items-center gap-2 border border-white/10 bg-[#161b22] hover:bg-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-semibold cursor-pointer outline-none focus:border-orange-500/50"
                            >
                                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                                <span>{SORT_OPTIONS[sortBy]}</span>
                                <span className="text-[8px] text-slate-500">▼</span>
                            </button>
                            {isSortDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1.5 z-40 w-48 rounded-xl border border-white/10 bg-[#161b22] shadow-2xl p-1">
                                    {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSortBy(key);
                                                setIsSortDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center px-3 py-2 text-xs rounded-lg transition-colors hover:bg-white/10 text-left ${sortBy === key ? 'bg-white/5 text-white font-bold' : 'text-slate-400'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Condition Tabs (aligned right) */}
                        <div className="flex rounded-xl border border-white/10 bg-[#161b22] p-1 sm:ml-auto">
                            {CONDITIONS.map((cond) => (
                                <button
                                    key={cond}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                        conditionFilter === cond
                                            ? 'bg-orange-500/20 text-orange-500 shadow-sm'
                                            : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                                    }`}
                                    onClick={() => setConditionFilter(cond)}
                                >
                                    {CONDITION_SHORT[cond]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Skins Grid list */}
                {filteredAndSortedSkins.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filteredAndSortedSkins.map((skin) => {
                            const price = getPriceForSelected(skin, conditionFilter, statTrakFilter);
                            const rarityColor = skin.rarity?.color_hex || '#6b7280';
                            const weaponName = skin.weapon?.name || '';

                            return (
                                <Link
                                    key={skin.id}
                                    href={`/skin/${skin.id}-${getSkinSlug(weaponName, skin.name)}`}
                                    className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/[0.02]"
                                    style={{
                                        borderTopColor: rarityColor,
                                        borderTopWidth: '3.5px',
                                    }}
                                >
                                    {/* Image and ST Badge */}
                                    <div className="relative flex items-center justify-center bg-white/[0.01] p-5 aspect-square">
                                        {statTrakFilter && (
                                            <div className="absolute top-3 left-3 rounded bg-gradient-to-r from-amber-600 to-amber-500 px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md uppercase tracking-wider">
                                                ST™
                                            </div>
                                        )}

                                        <img
                                            src={skin.image_url}
                                            alt={skin.name}
                                            className="h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-1.5 p-4 border-t border-white/5 bg-[#0e1321]">
                                        <h4 className="truncate text-sm font-bold text-slate-100 group-hover:text-white transition-colors" title={`${weaponName} | ${skin.name}`}>
                                            {weaponName ? `${weaponName} | ` : ''}{skin.name}
                                        </h4>
                                        
                                        <p
                                            className="text-xs font-semibold tracking-wide uppercase text-[9px]"
                                            style={{ color: rarityColor }}
                                        >
                                            {skin.rarity?.name}
                                        </p>

                                        <div className="flex items-baseline justify-between pt-1">
                                            <span className="text-base font-extrabold text-white">
                                                ${price.toFixed(2)}
                                            </span>
                                            <span className="font-mono text-[9px] text-slate-500 font-bold uppercase bg-slate-900/60 rounded px-1.5 py-0.5 border border-white/5">
                                                {CONDITION_SHORT[conditionFilter]}
                                            </span>
                                        </div>

                                        <p className="font-mono text-[9px] text-slate-500 pt-1">
                                            Float: {skin.min_float.toFixed(2)} – {skin.max_float.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/60 text-slate-600">
                            <Info className="h-6 w-6" />
                        </div>
                        <p className="text-base text-slate-400 font-semibold">No skins match your filters</p>
                        <p className="text-xs text-slate-500 mt-1">Try resetting the price limits or condition settings.</p>
                    </div>
                )}
            </div>
        </>
    );
}
