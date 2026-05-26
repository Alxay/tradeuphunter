import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Skin, Rarity, ApiData, Collection } from '../../types/skin';
import { X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    apiData: ApiData;
    collections: Collection[];
    rarities: Rarity[];
    contractRarity: Rarity | null;
    contractStatTrak: boolean | null;
    onSelect: (skin: Skin) => void;
    onClose: () => void;
    visible: boolean;
}

const DEFAULT_FLOATS: Record<string, number> = {
    'Factory New': 0.03,
    'Minimal Wear': 0.1,
    'Field-Tested': 0.25,
    'Well-Worn': 0.4,
    'Battle-Scarred': 0.7,
};

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

export default function SelectSkin({
    apiData,
    collections,
    rarities,
    contractRarity,
    contractStatTrak,
    onSelect,
    onClose,
    visible,
}: Props) {
    const [skins, setSkins] = useState<Skin[]>(apiData.data);
    const [currentPage, setCurrentPage] = useState<number>(
        apiData.current_page,
    );
    const [lastPage, setLastPage] = useState<number>(apiData.last_page || 1);

    const [collectionFilter, setCollectionFilter] = useState<string>('');
    const [rarityFilter, setRarityFilter] = useState<string>(''); // Default is empty to show all rarities
    const [conditionFilter, setConditionFilter] =
        useState<string>('Field-Tested');
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

    // Build API params (condition excluded — backend does not use it / prevent refetch)
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

    // ---- Fetch skins when server-relevant filters change ----
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

    // ---- Infinite scroll with IntersectionObserver ----
    useEffect(() => {
        if (!visible || currentPage >= lastPage) return;

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
                        console.error('Failed to load more:', err),
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
    }, [currentPage, lastPage, getApiParams, visible]);

    // ---- Debounced search ----
    const handleSearchInput = (value: string) => {
        setSearchInput(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(
            () => setSearchQuery(value),
            600, // Updated to 700ms delay
        );
    };

    useEffect(
        () => () => {
            if (searchTimeoutRef.current)
                clearTimeout(searchTimeoutRef.current);
        },
        [],
    );

    useEffect(() => {
        if (visible) {
            if (contractStatTrak !== null) {
                setStatTrakFilter(contractStatTrak ? '1' : '0');
            }
            if (contractRarity !== null) {
                setRarityFilter(String(contractRarity.id));
            }
        }
    }, [visible, contractStatTrak, contractRarity]);

    // ---- Don't render when hidden ----
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative flex max-h-[85vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">
                        Select Skin
                    </h3>
                    <button
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* ── Search & Filters ── */}
                <div className="space-y-3 border-b border-white/5 px-6 py-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search skins…"
                            value={searchInput}
                            className="w-full rounded-xl border border-white/10 bg-[#161b22] py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-500 transition-colors outline-none focus:border-orange-500/50 focus:bg-[#1c2128]"
                            onChange={(e) => handleSearchInput(e.target.value)}
                        />
                    </div>

                    {/* Filters row */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Collection Custom Dropdown */}
                        <div className="relative z-40" ref={collectionRef}>
                            <button
                                className="flex w-56 items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#161b22] px-3 py-2 text-sm text-gray-300 transition-colors outline-none hover:bg-white/5 focus:border-orange-500/50"
                                onClick={() =>
                                    setIsCollectionOpen(!isCollectionOpen)
                                }
                            >
                                <div className="flex items-center gap-2 truncate">
                                    {collectionFilter ? (
                                        <>
                                            <img
                                                src={
                                                    collections.find(
                                                        (c) =>
                                                            String(c.id) ===
                                                            collectionFilter,
                                                    )?.image_url
                                                }
                                                alt=""
                                                className="h-5 w-7 shrink-0 object-contain"
                                            />
                                            <span className="truncate">
                                                {
                                                    collections.find(
                                                        (c) =>
                                                            String(c.id) ===
                                                            collectionFilter,
                                                    )?.name
                                                }
                                            </span>
                                        </>
                                    ) : (
                                        'All Collections'
                                    )}
                                </div>
                                <span className="shrink-0 text-[10px] text-gray-500">
                                    ▼
                                </span>
                            </button>

                            {isCollectionOpen && (
                                <div
                                    className="absolute top-full left-0 mt-1 max-h-60 w-72 overflow-y-auto rounded-lg border border-white/10 bg-[#161b22] shadow-xl shadow-black/50"
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#334155 transparent',
                                    }}
                                >
                                    <button
                                        className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/10 ${collectionFilter === '' ? 'bg-white/5 text-white' : 'text-gray-400'}`}
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
                                            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/10 ${collectionFilter === String(c.id) ? 'bg-white/5 text-white' : 'text-gray-400'}`}
                                            onClick={() => {
                                                setCollectionFilter(
                                                    String(c.id),
                                                );
                                                setIsCollectionOpen(false);
                                            }}
                                        >
                                            <img
                                                src={c.image_url}
                                                alt=""
                                                className="h-5 w-7 shrink-0 object-contain"
                                            />
                                            <span className="truncate text-left">
                                                {c.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Rarity Custom Dropdown */}
                        <div className="relative z-30" ref={rarityRef}>
                            <button
                                className={`flex w-48 items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#161b22] px-3 py-2 text-sm transition-colors outline-none hover:bg-white/5 focus:border-orange-500/50 ${contractRarity ? 'cursor-not-allowed opacity-50' : ''}`}
                                onClick={() =>
                                    !contractRarity &&
                                    setIsRarityOpen(!isRarityOpen)
                                }
                            >
                                <div className="flex items-center gap-2 truncate text-gray-300">
                                    {contractRarity ? (
                                        <>
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        contractRarity.color_hex,
                                                }}
                                            />
                                            <span className="truncate">
                                                {contractRarity.name}
                                            </span>
                                        </>
                                    ) : rarityFilter ? (
                                        <>
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        rarities.find(
                                                            (r) =>
                                                                String(r.id) ===
                                                                rarityFilter,
                                                        )?.color_hex,
                                                }}
                                            />
                                            <span className="truncate">
                                                {
                                                    rarities.find(
                                                        (r) =>
                                                            String(r.id) ===
                                                            rarityFilter,
                                                    )?.name
                                                }
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-gray-500 bg-transparent" />
                                            <span className="truncate">
                                                All Rarities
                                            </span>
                                        </>
                                    )}
                                </div>
                                <span className="shrink-0 text-[10px] text-gray-500">
                                    ▼
                                </span>
                            </button>

                            {isRarityOpen && !contractRarity && (
                                <div
                                    className="absolute top-full left-0 mt-1 max-h-60 w-48 overflow-y-auto rounded-lg border border-white/10 bg-[#161b22] shadow-xl shadow-black/50"
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#334155 transparent',
                                    }}
                                >
                                    <button
                                        className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/10 ${rarityFilter === '' ? 'bg-white/5 text-white' : 'text-gray-400'}`}
                                        onClick={() => {
                                            setRarityFilter('');
                                            setIsRarityOpen(false);
                                        }}
                                    >
                                        <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-gray-500 bg-transparent" />
                                        <span>All Rarities</span>
                                    </button>
                                    {rarities.map((r) => (
                                        <button
                                            key={r.id}
                                            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/10 ${rarityFilter === String(r.id) ? 'bg-white/5 text-white' : 'text-gray-400'}`}
                                            onClick={() => {
                                                setRarityFilter(String(r.id));
                                                setIsRarityOpen(false);
                                            }}
                                        >
                                            <span
                                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        r.color_hex,
                                                }}
                                            />
                                            <span className="truncate text-left">
                                                {r.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* StatTrak toggle */}
                        <button
                            disabled={contractStatTrak != null}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                                statTrakFilter === '1'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                                    : 'border-white/10 bg-[#161b22] text-gray-400 hover:border-white/20 hover:bg-white/5'
                            } ${contractStatTrak != null ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            onClick={() => {
                                if (contractStatTrak != null) return;
                                setStatTrakFilter((p) =>
                                    p === '1' ? '0' : '1',
                                );
                            }}
                        >
                            <div
                                className={`h-4 w-7 rounded-full transition-colors ${statTrakFilter === '1' ? 'bg-amber-500' : 'bg-gray-600'}`}
                            >
                                <div
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${statTrakFilter === '1' ? 'translate-x-3' : 'translate-x-0'}`}
                                />
                            </div>
                            StatTrak™
                        </button>

                        {/* Condition pills */}
                        <div className="flex rounded-lg border border-white/10 bg-[#161b22] p-0.5">
                            {CONDITIONS.map((cond) => (
                                <button
                                    key={cond}
                                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                                        conditionFilter === cond
                                            ? 'bg-orange-500/20 text-orange-500 shadow-sm'
                                            : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                    }`}
                                    onClick={() => setConditionFilter(cond)}
                                >
                                    {CONDITION_SHORT[cond]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Skin grid (scrollable) ── */}
                <div
                    className="flex-1 overflow-y-auto p-6"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#334155 transparent',
                    }}
                >
                    {/* Skeleton loading */}
                    {isLoading && skins.length === 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse rounded-xl border border-white/5 bg-white/[0.02]"
                                >
                                    <div className="p-4">
                                        <div className="mx-auto h-20 w-20 rounded-lg bg-white/5" />
                                    </div>
                                    <div className="space-y-2 p-3">
                                        <div className="h-3 w-3/4 rounded bg-white/5" />
                                        <div className="h-3 w-1/2 rounded bg-white/5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {skins
                                    .filter((skin) => getPriceByCondition(skin, conditionFilter) > 0)
                                    .map((skin) => {
                                    const price = getPriceByCondition(
                                        skin,
                                        conditionFilter,
                                    );
                                    const rarityColor =
                                        skin.rarity?.color_hex || '#6b7280';

                                    return (
                                        <div
                                            key={skin.id}
                                            onClick={() => {
                                                if (skin.rarity?.name === 'Covert' || skin.rarity_id === 1) {
                                                    toast.error('Covert skins cannot be traded up.');
                                                    return;
                                                }
                                                onSelect({
                                                    ...skin,
                                                    condition: conditionFilter,
                                                    float:
                                                        DEFAULT_FLOATS[
                                                            conditionFilter
                                                        ] || 0.25,
                                                });
                                                onClose();
                                            }}
                                            className="group cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06] hover:shadow-lg"
                                            style={{
                                                borderTopColor: rarityColor,
                                                borderTopWidth: '2px',
                                            }}
                                        >
                                            <div className="relative flex items-center justify-center bg-white/[0.02] p-4">
                                                {(skin.statTrak == true ||
                                                    String(skin.statTrak) ===
                                                        '1') && (
                                                    <div className="absolute top-2 left-2 rounded bg-gradient-to-r from-amber-600 to-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md">
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
                                                    className="absolute top-2 right-2 z-10 flex h-5 w-5 items-center justify-center rounded bg-black/60 border border-white/10 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-black/90 hover:border-white/20 transition-all duration-200"
                                                    title="View on Steam Market"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <img
                                                        src="https://store.steampowered.com/favicon.ico"
                                                        alt="Steam"
                                                        className="h-3 w-3"
                                                    />
                                                </a>

                                                <img
                                                    src={skin.image_url}
                                                    alt={skin.name}
                                                    className="h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="space-y-1 p-3">
                                                <h4 className="truncate text-sm font-semibold text-gray-200" title={`${skin.weapon?.name ? skin.weapon.name + ' | ' : ''}${skin.name}`}>
                                                    {skin.weapon?.name ? skin.weapon.name + ' | ' : ''}{skin.name}
                                                </h4>
                                                <p
                                                    className="text-xs font-medium"
                                                    style={{
                                                        color: rarityColor,
                                                    }}
                                                >
                                                    {skin.rarity.name}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-white">
                                                        ${price.toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="font-mono text-[10px] text-gray-500">
                                                    {skin.min_float.toFixed(2)}{' '}
                                                    –{' '}
                                                    {skin.max_float.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* No results */}
                            {skins.length === 0 && !isLoading && (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Search className="mb-3 h-10 w-10 text-gray-600" />
                                    <p className="text-sm text-gray-500">
                                        No skins found for the selected filters.
                                    </p>
                                </div>
                            )}

                            {/* Infinite scroll sentinel */}
                            {currentPage < lastPage && (
                                <div
                                    ref={loadMoreRef}
                                    className="flex items-center justify-center py-6"
                                >
                                    <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                                    <span className="ml-2 text-sm text-gray-500">
                                        Loading more…
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
