import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Loader2, Coins, Clock, AlertCircle } from 'lucide-react';
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
    priceBS?: number;
    priceWW?: number;
    priceFT?: number;
    priceMW?: number;
    priceFN?: number;
    stPriceBS?: number;
    stPriceWW?: number;
    stPriceFT?: number;
    stPriceMW?: number;
    stPriceFN?: number;
    statTrak: boolean;
}

interface ApiData {
    current_page: number;
    data: Skin[];
    last_page?: number;
}

interface Collection {
    id: number;
    name: string;
    image_url: string;
}

interface Props {
    apiData: ApiData;
    collections: Collection[];
    rarities: Rarity[];
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

function getPriceByCondition(skin: Skin, condition: string): number {
    const isSt = skin.statTrak === true || String(skin.statTrak) === '1';
    switch (condition) {
        case 'Battle-Scarred':
            return (isSt ? (skin.stPriceBS ?? skin.priceBS) : skin.priceBS) ?? 0;
        case 'Well-Worn':
            return (isSt ? (skin.stPriceWW ?? skin.priceWW) : skin.priceWW) ?? 0;
        case 'Field-Tested':
            return (isSt ? (skin.stPriceFT ?? skin.priceFT) : skin.priceFT) ?? 0;
        case 'Minimal Wear':
            return (isSt ? (skin.stPriceMW ?? skin.priceMW) : skin.priceMW) ?? 0;
        case 'Factory New':
            return (isSt ? (skin.stPriceFN ?? skin.priceFN) : skin.priceFN) ?? 0;
        default:
            return 0;
    }
}

export default function Index({ apiData, collections, rarities }: Props) {
    const [skins, setSkins] = useState<Skin[]>(apiData.data);
    const [currentPage, setCurrentPage] = useState<number>(apiData.current_page);
    const [lastPage, setLastPage] = useState<number>(apiData.last_page || 1);

    const [collectionFilter, setCollectionFilter] = useState<string>('');
    const [rarityFilter, setRarityFilter] = useState<string>('');
    const [conditionFilter, setConditionFilter] = useState<string>('Field-Tested');
    const [statTrakFilter, setStatTrakFilter] = useState<string>('0');

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Custom dropdown states
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);
    const [isRarityOpen, setIsRarityOpen] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const isLoadingMoreRef = useRef(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const collectionRef = useRef<HTMLDivElement>(null);
    const rarityRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                collectionRef.current &&
                !collectionRef.current.contains(e.target as Node)
            ) {
                setIsCollectionOpen(false);
            }
            if (
                rarityRef.current &&
                !rarityRef.current.contains(e.target as Node)
            ) {
                setIsRarityOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Build API parameters
    const getApiParams = useCallback(
        (page: number) => ({
            page,
            collection: collectionFilter || undefined,
            rarity: rarityFilter || undefined,
            statTrak: statTrakFilter,
            search: searchQuery.trim() || undefined,
        }),
        [collectionFilter, rarityFilter, statTrakFilter, searchQuery],
    );

    const prevFiltersRef = useRef({
        collection: collectionFilter,
        rarity: rarityFilter,
        search: searchQuery,
        statTrak: statTrakFilter,
    });

    // ---- Fetch skins when filters change ----
    useEffect(() => {
        const onlyStatTrakChanged =
            collectionFilter === prevFiltersRef.current.collection &&
            rarityFilter === prevFiltersRef.current.rarity &&
            searchQuery === prevFiltersRef.current.search &&
            statTrakFilter !== prevFiltersRef.current.statTrak;

        prevFiltersRef.current = {
            collection: collectionFilter,
            rarity: rarityFilter,
            search: searchQuery,
            statTrak: statTrakFilter,
        };

        if (onlyStatTrakChanged && skins.length > 0) {
            // Instant local toggle and truncate back to page 1 (first 40 items)
            const isSt = statTrakFilter === '1';
            setSkins((prev) =>
                prev.slice(0, 40).map((skin) => ({
                    ...skin,
                    statTrak: isSt,
                })),
            );
            setCurrentPage(1);
            return;
        }

        setIsLoading(true);
        isLoadingMoreRef.current = true;
        setSkins([]);
        setCurrentPage(1);

        axios
            .get('/api/skins', { params: getApiParams(1) })
            .then((res) => {
                setSkins(res.data.data || []);
                setLastPage(res.data.last_page || 1);
                setCurrentPage(res.data.current_page);
            })
            .catch((err) => console.error('Failed to load skins:', err))
            .finally(() => {
                setIsLoading(false);
                isLoadingMoreRef.current = false;
            });
    }, [getApiParams]);

    // ---- Infinite scroll using IntersectionObserver ----
    useEffect(() => {
        if (currentPage >= lastPage) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoadingMoreRef.current) {
                isLoadingMoreRef.current = true;

                axios
                    .get('/api/skins', {
                        params: getApiParams(currentPage + 1),
                    })
                    .then((res) => {
                        setSkins((prev) => [
                            ...prev,
                            ...(res.data.data || []),
                        ]);
                        setCurrentPage(res.data.current_page);
                        setLastPage(res.data.last_page);
                    })
                    .catch((err) =>
                        console.error('Failed to load more skins:', err),
                    )
                    .finally(() => {
                        isLoadingMoreRef.current = false;
                    });
            }
        });

        const el = loadMoreRef.current;
        if (el) observer.observe(el);
        return () => {
            if (el) observer.unobserve(el);
        };
    }, [currentPage, lastPage, getApiParams]);

    // ---- Debounced search ----
    const handleSearchInput = (value: string) => {
        setSearchInput(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(
            () => setSearchQuery(value),
            600,
        );
    };

    useEffect(
        () => () => {
            if (searchTimeoutRef.current)
                clearTimeout(searchTimeoutRef.current);
        },
        [],
    );

    return (
        <>
            <Head title="Skins Database">
                <meta name="description" content="Browse weapon finishes and track real-time Steam market prices. A complete database of CS2 skins with floats, rarities, and 30d/90d averages." />
                <meta name="keywords" content="cs2 skins database, steam skin prices, cs2 skin values, wear float checker, counter strike skins database" />
            </Head>
            <div className="pageContent min-h-[90vh] bg-background p-6 text-white">
                {/* ── Page Header ── */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                            <Coins className="h-6 w-6 text-orange-500" />
                            <span>Skins Database & Prices</span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Browse weapon finishes and track market averages.
                        </p>
                    </div>
                    
                    {/* Live update disclaimer card */}
                    <div className="flex items-center gap-2.5 rounded-xl border border-orange-500/10 bg-orange-950/10 px-4 py-2 text-xs text-slate-300">
                        <Clock className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>Prices are based on 30d/90d averages and updated every 2 hours.</span>
                    </div>
                </div>

                {/* Sponsored Banner */}
                <div className="mb-6">
                    <a
                        href="https://csgo-skins.com/?ref=ALXAY"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-orange-500/10 bg-orange-950/5 p-4 hover:border-orange-500/20 hover:bg-orange-950/10 transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.01)]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider font-extrabold shrink-0">
                                Sponsored
                            </span>
                            <p className="text-xs text-slate-300 leading-normal">
                                Want to upgrade your CS2 inventory? Open cases and withdraw instantly at <span className="font-bold text-orange-400 hover:underline">CSGO-Skins.com</span>. Use referral code <span className="font-bold text-orange-400">ALXAY</span> for an exclusive bonus!
                            </p>
                        </div>
                        <div className="shrink-0 rounded-xl bg-orange-500 group-hover:bg-orange-400 px-4 py-2 text-xs font-bold text-black transition-colors">
                            Claim Bonus
                        </div>
                    </a>
                </div>

                {/* ── Search & Filters ── */}
                <div className="space-y-4 border border-white/5 bg-slate-900/10 rounded-2xl p-4 mb-6">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search skins by weapon or pattern name (e.g., AK-47 Redline)..."
                            value={searchInput}
                            className="w-full rounded-xl border border-white/10 bg-[#161b22] py-3 pr-4 pl-11 text-sm text-white placeholder-slate-500 transition-colors outline-none focus:border-orange-500/50 focus:bg-[#1c2128]"
                            onChange={(e) => handleSearchInput(e.target.value)}
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Collection Filter */}
                        <div className="relative" ref={collectionRef}>
                            <button
                                className="flex w-60 items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#161b22] px-3.5 py-2.5 text-sm text-slate-300 transition-colors outline-none hover:bg-white/5 focus:border-orange-500/50"
                                onClick={() => setIsCollectionOpen(!isCollectionOpen)}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    {collectionFilter ? (
                                        <>
                                            <img
                                                src={collections.find((c) => String(c.id) === collectionFilter)?.image_url}
                                                alt=""
                                                className="h-5 w-7 shrink-0 object-contain"
                                            />
                                            <span className="truncate">
                                                {collections.find((c) => String(c.id) === collectionFilter)?.name}
                                            </span>
                                        </>
                                    ) : (
                                        'All Collections'
                                    )}
                                </div>
                                <span className="shrink-0 text-[10px] text-slate-500">▼</span>
                            </button>

                            {isCollectionOpen && (
                                <div
                                    className="absolute top-full left-0 mt-1.5 z-40 max-h-64 w-72 overflow-y-auto rounded-xl border border-white/10 bg-[#161b22] shadow-2xl"
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#334155 transparent',
                                    }}
                                >
                                    <button
                                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${collectionFilter === '' ? 'bg-white/5 text-white' : 'text-slate-400'}`}
                                        onClick={() => {
                                            setCollectionFilter('');
                                            setIsCollectionOpen(false);
                                        }}
                                    >
                                        <div className="w-7 shrink-0"></div>
                                        <span>All Collections</span>
                                    </button>
                                    {collections.map((c) => (
                                        <button
                                            key={c.id}
                                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${collectionFilter === String(c.id) ? 'bg-white/5 text-white' : 'text-slate-400'}`}
                                            onClick={() => {
                                                setCollectionFilter(String(c.id));
                                                setIsCollectionOpen(false);
                                            }}
                                        >
                                            <img
                                                src={c.image_url}
                                                alt=""
                                                className="h-5 w-7 shrink-0 object-contain"
                                            />
                                            <span className="truncate text-left">{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rarity Filter */}
                        <div className="relative" ref={rarityRef}>
                            <button
                                className="flex w-52 items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#161b22] px-3.5 py-2.5 text-sm text-slate-300 transition-colors outline-none hover:bg-white/5 focus:border-orange-500/50"
                                onClick={() => setIsRarityOpen(!isRarityOpen)}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    {rarityFilter ? (
                                        <>
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: rarities.find((r) => String(r.id) === rarityFilter)?.color_hex,
                                                }}
                                            />
                                            <span className="truncate">
                                                {rarities.find((r) => String(r.id) === rarityFilter)?.name}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-slate-500 bg-transparent" />
                                            <span>All Rarities</span>
                                        </>
                                    )}
                                </div>
                                <span className="shrink-0 text-[10px] text-slate-500">▼</span>
                            </button>

                            {isRarityOpen && (
                                <div
                                    className="absolute top-full left-0 mt-1.5 z-40 max-h-64 w-52 overflow-y-auto rounded-xl border border-white/10 bg-[#161b22] shadow-2xl"
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#334155 transparent',
                                    }}
                                >
                                    <button
                                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${rarityFilter === '' ? 'bg-white/5 text-white' : 'text-slate-400'}`}
                                        onClick={() => {
                                            setRarityFilter('');
                                            setIsRarityOpen(false);
                                        }}
                                    >
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-slate-500 bg-transparent" />
                                        <span>All Rarities</span>
                                    </button>
                                    {rarities.map((r) => (
                                        <button
                                            key={r.id}
                                            className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${rarityFilter === String(r.id) ? 'bg-white/5 text-white' : 'text-slate-400'}`}
                                            onClick={() => {
                                                setRarityFilter(String(r.id));
                                                setIsRarityOpen(false);
                                            }}
                                        >
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{ backgroundColor: r.color_hex }}
                                            />
                                            <span className="truncate text-left">{r.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* StatTrak Custom Toggle */}
                        <button
                            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
                                statTrakFilter === '1'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold'
                                    : 'border-white/10 bg-[#161b22] text-slate-400 hover:border-white/20 hover:bg-white/5'
                            }`}
                            onClick={() => setStatTrakFilter((p) => (p === '1' ? '0' : '1'))}
                        >
                            <div className={`h-4.5 w-8 rounded-full transition-colors p-0.5 ${statTrakFilter === '1' ? 'bg-amber-500' : 'bg-slate-600'}`}>
                                <div className={`h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${statTrakFilter === '1' ? 'translate-x-3.5' : 'translate-x-0'}`} />
                            </div>
                            StatTrak™
                        </button>

                        {/* Condition Tabs */}
                        <div className="flex rounded-xl border border-white/10 bg-[#161b22] p-1 ml-auto">
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

                {/* ── Skins Grid ── */}
                {isLoading && skins.length === 0 ? (
                    /* Loading Skeleton */
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.02]"
                            >
                                <div className="p-5 flex items-center justify-center">
                                    <div className="h-24 w-24 rounded-xl bg-white/5" />
                                </div>
                                <div className="space-y-2 p-4 border-t border-white/5">
                                    <div className="h-3 w-3/4 rounded bg-white/5" />
                                    <div className="h-2 w-1/2 rounded bg-white/5" />
                                    <div className="h-4 w-1/3 rounded bg-white/5 mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {skins
                                .filter((skin) => getPriceByCondition(skin, conditionFilter) > 0)
                                .map((skin) => {
                                    const price = getPriceByCondition(skin, conditionFilter);
                                    const rarityColor = skin.rarity?.color_hex || '#6b7280';

                                    return (
                                        <Link
                                            key={skin.id}
                                            href={`/skin/${skin.id}-${getSkinSlug(skin.weapon?.name, skin.name)}`}
                                            className="group block overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/[0.02]"
                                            style={{
                                                borderTopColor: rarityColor,
                                                borderTopWidth: '3.5px',
                                            }}
                                        >
                                            {/* Weapon image container */}
                                            <div className="relative flex items-center justify-center bg-white/[0.01] p-5 aspect-square">
                                                {(skin.statTrak === true || String(skin.statTrak) === '1') && (
                                                    <div className="absolute top-3 left-3 rounded bg-gradient-to-r from-amber-600 to-amber-500 px-2 py-0.5 text-[9px] font-extrabold text-white shadow-md uppercase tracking-wider">
                                                        ST™
                                                    </div>
                                                )}
                                                
                                                <a
                                                    href={`https://steamcommunity.com/market/listings/730/${encodeURIComponent(
                                                        (skin.statTrak === true || String(skin.statTrak) === '1' ? 'StatTrak™ ' : '') + 
                                                        (skin.weapon?.name ? skin.weapon.name + ' | ' : '') + 
                                                        skin.name + 
                                                        ` (${conditionFilter})`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 border border-white/10 p-1 opacity-0 group-hover:opacity-100 hover:bg-black/90 hover:border-white/20 transition-all duration-200"
                                                    title="View on Steam Market"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <img
                                                        src="https://store.steampowered.com/favicon.ico"
                                                        alt="Steam"
                                                        className="h-3.5 w-3.5"
                                                    />
                                                </a>

                                                <img
                                                    src={skin.image_url}
                                                    alt={skin.name}
                                                    className="h-28 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1.5 p-4 border-t border-white/5">
                                                <h4 className="truncate text-sm font-bold text-slate-100 group-hover:text-white transition-colors" title={`${skin.weapon?.name ? skin.weapon.name + ' | ' : ''}${skin.name}`}>
                                                    {skin.weapon?.name ? skin.weapon.name + ' | ' : ''}{skin.name}
                                                </h4>
                                                
                                                <p
                                                    className="text-xs font-semibold tracking-wide uppercase text-[10px]"
                                                    style={{ color: rarityColor }}
                                                >
                                                    {skin.rarity?.name}
                                                </p>

                                                <div className="flex items-baseline justify-between pt-1">
                                                    <span className="text-base font-extrabold text-white">
                                                        ${price.toFixed(2)}
                                                    </span>
                                                    <span className="font-mono text-[9px] text-slate-500 font-bold uppercase bg-slate-900/60 rounded px-1.5 py-0.5 border border-white/5">
                                                        {conditionFilter === 'Factory New' ? 'FN' :
                                                         conditionFilter === 'Minimal Wear' ? 'MW' :
                                                         conditionFilter === 'Field-Tested' ? 'FT' :
                                                         conditionFilter === 'Well-Worn' ? 'WW' : 'BS'}
                                                    </span>
                                                </div>

                                                <p className="font-mono text-[10px] text-slate-500 pt-1">
                                                    Float: <span className="text-slate-400">{skin.min_float.toFixed(2)}</span> – <span className="text-slate-400">{skin.max_float.toFixed(2)}</span>
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>

                        {/* Empty state */}
                        {skins.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl">
                                <AlertCircle className="mb-4 h-12 w-12 text-slate-600 animate-pulse" />
                                <p className="text-base text-slate-400 font-semibold">No skins found</p>
                                <p className="text-xs text-slate-500 mt-1">No database records match your active filters.</p>
                            </div>
                        )}

                        {/* Infinite scroll loader */}
                        {currentPage < lastPage && (
                            <div
                                ref={loadMoreRef}
                                className="flex items-center justify-center py-10 mt-6"
                            >
                                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                                <span className="ml-3 text-sm text-slate-400 font-semibold">
                                    Loading more skins...
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
