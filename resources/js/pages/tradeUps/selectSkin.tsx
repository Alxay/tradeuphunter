import axios from 'axios';
import { dashboard } from '@/routes';
import { useEffect, useRef, useState } from 'react';

interface Rarity {
    id: number;
    name: string;
    color_hex: string;
}

interface Skin {
    id: number;
    name: string;
    image_url: string;
    min_float: number;
    max_float: number;
    rarity: Rarity; // Zagnieżdżony obiekt rarity
    collection_id: number;
    price: number;
}

// Skoro Laravel zwraca paginację, struktura wygląda tak:

interface ApiData {
    current_page: number;
    data: Skin[]; // Tu są Twoje skiny
    total?: number;
    last_page?: number;
}

interface Props {
    apiData: ApiData;
    collections: Collection[];
    rarities: Rarity[];
    contractRarity: Rarity | null;
    onSelect: (skin: Skin) => void;
    onClose: () => void;
    visible: boolean;
}

interface Collection {
    id: number;
    name: string;
    api_id: number;
    image_url: string;
}

SelectSkin.layout = {
    breadcrumbs: [
        {
            title: 'TradeUps',
            href: dashboard(),
        },
    ],
};

// export default function SelectSkin({ apiData, collections, rarities }: Props) {
export default function SelectSkin({
    apiData,
    collections,
    rarities,
    contractRarity,
    onSelect,
    onClose,
    visible,
}: Props) {
    //const skins = apiData.data;
    // console.log(collections);
    // console.log(rarities);

    const [skins, setSkins] = useState<Skin[]>(apiData.data);
    const [currentPage, setCurrentPage] = useState<number>(
        apiData.current_page,
    );
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [collectionFilter, setCollectionFilter] = useState<string>('');
    const [rarityFilter, setRarityFilter] = useState<string>('');
    const [lastPage, setLastPage] = useState<number>(apiData.last_page || 1);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [conditionFilter, setConditionFilter] =
        useState<string>('Field-Tested');
    // console.log(rarities);

    useEffect(() => {
        setIsLoadingMore(true);
        setSkins([]);
        setCurrentPage(1);
        console.log(
            'Filters changed:',
            collectionFilter,
            rarityFilter,
            conditionFilter,
        );
        console.warn('PYTAM API');
        axios
            .get(
                `/api/skins?page=1&collection=${collectionFilter}&rarity=${rarityFilter}&condition=${conditionFilter}&statTrak=0`,
            )
            .then((response) => {
                console.log('API Response:', response.data);
                const annotated = (response.data.data || []).map((s: any) => ({
                    ...s,
                }));
                setSkins(annotated);
                setLastPage(response.data.last_page || 1);
                setCurrentPage(response.data.current_page);
                // setLastApiData(response.data);

                console.log('Current Page:', response.data.current_page);
                console.log('Last Page:', response.data.last_page);
            })
            .catch((error) => {
                console.error('Failed to load skins:', error);
            })
            .finally(() => {
                setIsLoadingMore(false);
            });
    }, [collectionFilter, rarityFilter, conditionFilter]);

    useEffect(() => {
        if (currentPage >= lastPage) {
            return;
        }
        // 1. Tworzymy obserwatora i definiujemy co ma zrobić

        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (
                target.isIntersecting &&
                currentPage < lastPage &&
                !isLoadingMore
            ) {
                setIsLoadingMore(true);
                console.warn('PYTAM API');
                axios
                    .get(
                        `/api/skins?page=${currentPage + 1}&collection=${collectionFilter}&rarity=${rarityFilter}&condition=${conditionFilter}&statTrak=0`,
                    )
                    .then((response) => {
                        const newSkins = response.data.data || []; // Pobieramy nowe skiny
                        setSkins((prevSkins) => [...prevSkins, ...newSkins]); // Dodajemy je do istniejących
                        setCurrentPage(response.data.current_page); // Zwiększamy numer strony
                        setLastPage(response.data.last_page);

                        console.log(
                            'Current Page:',
                            response.data.current_page,
                        );
                        console.log('Last Page:', response.data.last_page);
                        //     console.log(
                        //         'Current Page:',
                        //         response.data.current_page,
                        //     );
                        //    console.log('Last Page:', response.data.last_page);
                        // setLastApiData(response.data);
                    })
                    .catch((error) => {
                        console.error('Failed to load more skins:', error);
                    })
                    .finally(() => {
                        setIsLoadingMore(false);
                    });
            }
        });

        const loadMoreElement = loadMoreRef.current;

        if (loadMoreElement) {
            observer.observe(loadMoreElement);
        }
        return () => {
            if (loadMoreElement) {
                observer.unobserve(loadMoreElement);
            }
        };
    }, [
        currentPage,
        lastPage,
        collectionFilter,
        rarityFilter,
        conditionFilter,

        isLoadingMore,
    ]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                visibility: visible ? 'visible' : 'hidden',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div
                className="relative max-h-[80vh] w-[90vw] max-w-4xl overflow-auto rounded bg-[#0B0E14] p-4 text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Wybierz skina</h3>
                    <button
                        className="ml-2 rounded bg-gray-700 px-2 py-1"
                        onClick={() => {
                            onClose();
                        }}
                    >
                        Zamknij
                    </button>
                </div>

                <div
                    id="header"
                    className="mb-6 flex items-center justify-between"
                >
                    <select
                        className="rounded bg-[#1a1f29] p-2"
                        value={collectionFilter}
                        onChange={(e) => setCollectionFilter(e.target.value)}
                    >
                        <option value="">Wszystkie kolekcje</option>

                        {collections.map((collection) => (
                            <option key={collection.id} value={collection.id}>
                                {collection.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="rounded bg-[#1a1f29] p-2"
                        value={rarityFilter}
                        onChange={(e) => setRarityFilter(e.target.value)}
                    >
                        {!contractRarity ? (
                            <>
                                {rarities.map((rarity) => (
                                    <option key={rarity.id} value={rarity.id}>
                                        {rarity.name}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value={contractRarity.id}>
                                {contractRarity.name}
                            </option>
                        )}
                    </select>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="statTrack"
                            className="mr-2"
                        />
                        <label htmlFor="statTrack">StatTrak</label>
                    </div>

                    <select
                        defaultValue={'Field-Tested'}
                        className="rounded bg-[#1a1f29] p-2"
                        value={conditionFilter}
                        onChange={(e) => setConditionFilter(e.target.value)}
                    >
                        <option value="Battle-Scarred">Battle-Scarred</option>
                        <option value="Well-Worn">Well-Worn</option>
                        <option value="Field-Tested">Field-Tested</option>
                        <option value="Minimal Wear">Minimal Wear</option>
                        <option value="Factory New">Factory New</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {skins.map((skin) => (
                        <div
                            onClick={() => {
                                onSelect(skin);
                                onClose();
                            }}
                            key={skin.id}
                            className="rounded-lg border border-gray-800 bg-[#1a1f29] p-4"
                        >
                            <img
                                src={skin.image_url}
                                alt={skin.name}
                                className="mb-2 h-auto w-full"
                            />

                            <h3 className="font-bold">{skin.name}</h3>

                            <p style={{ color: skin.rarity.color_hex }}>
                                {skin.rarity.name}
                            </p>
                            <p className="mt-1 font-semibold">
                                Cena: {skin.price}$
                            </p>

                            <div className="mt-2 text-xs text-gray-400">
                                Float: {skin.min_float} - {skin.max_float}
                            </div>
                        </div>
                    ))}

                    {skins.length === 0 && !isLoadingMore && (
                        <div className="col-span-full py-8 text-center text-gray-400">
                            No skins found for the selected filters.
                        </div>
                    )}

                    {currentPage < lastPage && (
                        <div ref={loadMoreRef}>
                            <p>Ładowanie...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
