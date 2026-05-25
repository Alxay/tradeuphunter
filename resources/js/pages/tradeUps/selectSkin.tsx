import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Skin, Rarity, ApiData, Collection } from '../../types/skin';
import { X, Search, Loader2 } from 'lucide-react';

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
    switch (condition) {
        case 'Battle-Scarred':
            return skin.priceBS ?? 0;
        case 'Well-Worn':
            return skin.priceWW ?? 0;
        case 'Field-Tested':
            return skin.priceFT ?? 0;
        case 'Minimal Wear':
            return skin.priceMW ?? 0;
        case 'Factory New':
            return skin.priceFN ?? 0;
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
    const [rarityFilter, setRarityFilter] = useState<string>('');
    const [conditionFilter, setConditionFilter] =
        useState<string>('Field-Tested');
    const [statTrakFilter, setStatTrakFilter] = useState<string>('0');
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const isLoadingMoreRef = useRef(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // Build API params (condition excluded — backend does not use it)
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

    // ---- Fetch skins when server-relevant filters change ----
    useEffect(() => {
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
    }, [currentPage, lastPage, getApiParams]);

    // ---- Debounced search ----
    const handleSearchInput = (value: string) => {
        setSearchInput(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(
            () => setSearchQuery(value),
            350,
        );
    };

    useEffect(
        () => () => {
            if (searchTimeoutRef.current)
                clearTimeout(searchTimeoutRef.current);
        },
        [],
    );

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
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search skins…"
                            value={searchInput}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-cyan-500/50 focus:bg-cyan-500/[0.03]"
                            onChange={(e) => handleSearchInput(e.target.value)}
                        />
                    </div>

                    {/* Filters row */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Collection */}
                        <select
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-cyan-500/50"
                            value={collectionFilter}
                            onChange={(e) =>
                                setCollectionFilter(e.target.value)
                            }
                        >
                            <option value="">All Collections</option>
                            {collections.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* Rarity */}
                        <select
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 outline-none transition-colors focus:border-cyan-500/50"
                            value={rarityFilter}
                            onChange={(e) => setRarityFilter(e.target.value)}
                        >
                            {!contractRarity ? (
                                rarities.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))
                            ) : (
                                <option value={contractRarity.id}>
                                    {contractRarity.name}
                                </option>
                            )}
                        </select>

                        {/* StatTrak toggle */}
                        <button
                            disabled={contractStatTrak != null}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                                statTrakFilter === '1'
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
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
                        <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
                            {CONDITIONS.map((cond) => (
                                <button
                                    key={cond}
                                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                                        conditionFilter === cond
                                            ? 'bg-cyan-500/20 text-cyan-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-300'
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
                                {skins.map((skin) => {
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
                                            <div className="flex items-center justify-center bg-white/[0.02] p-4">
                                                <img
                                                    src={skin.image_url}
                                                    alt={skin.name}
                                                    className="h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="space-y-1 p-3">
                                                <h4 className="truncate text-sm font-semibold text-gray-200">
                                                    {skin.name}
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
                                                    {skin.statTrak ===
                                                        true && (
                                                        <span className="text-[10px] font-bold text-amber-400">
                                                            ST™
                                                        </span>
                                                    )}
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
                                        No skins found for the selected
                                        filters.
                                    </p>
                                </div>
                            )}

                            {/* Infinite scroll sentinel */}
                            {currentPage < lastPage && (
                                <div
                                    ref={loadMoreRef}
                                    className="flex items-center justify-center py-6"
                                >
                                    <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
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
