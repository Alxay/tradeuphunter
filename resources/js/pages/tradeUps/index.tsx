import { Head, InfiniteScroll, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import axios from 'axios';
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
}

interface Collection {
    id: number;
    name: string;
    api_id: number;
    image_url: string;
}

export default function index({ apiData, collections, rarities }: Props) {
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
    // console.log(rarities);

    useEffect(() => {
        setIsLoadingMore(true);
        setSkins([]);
        setCurrentPage(1);
        console.log('Filters changed:', collectionFilter, rarityFilter);
        console.warn('PYTAM API');
        axios
            .get(
                `/api/skins?page=1&collection=${collectionFilter}&rarity=${rarityFilter}`,
            )
            .then((response) => {
                console.log('API Response:', response.data);
                if (response.data.data && response.data.data.length === 0) {
                }
                setSkins(response.data.data);
                setLastPage(response.data.last_page || 1);
                setCurrentPage(response.data.current_page);
                setIsLoadingMore(false);

                console.log('Current Page:', response.data.current_page);
                console.log('Last Page:', response.data.last_page);
            });
    }, [collectionFilter, rarityFilter]);

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
                        `/api/skins?page=${currentPage + 1}&collection=${collectionFilter}&rarity=${rarityFilter}`,
                    )
                    .then((response) => {
                        const newSkins = response.data.data; // Pobieramy nowe skiny
                        setSkins((prevSkins) => [...prevSkins, ...newSkins]); // Dodajemy je do istniejących
                        setCurrentPage(response.data.current_page); // Zwiększamy numer strony
                        setLastPage(response.data.last_page);
                        setIsLoadingMore(false);

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
                    });
            }
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [currentPage, lastPage, collectionFilter, rarityFilter, isLoadingMore]);

    return (
        <>
            <Head title="Dashboard" />
            <div className="pageContent min-h-[80vh] bg-[#0B0E14] p-6 text-white">
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
                        <option value="">Wszystkie rzadkości</option>

                        {rarities.map((rarity) => (
                            <option key={rarity.id} value={rarity.id}>
                                {rarity.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {skins.map((skin) => (
                        <div
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
        </>
    );
}

index.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
