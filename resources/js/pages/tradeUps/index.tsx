import { Head, InfiniteScroll, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import axiox from 'axios';

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
}

export default function index({ apiData }: Props) {
    // Twoje skiny są teraz tutaj:
    const skins = apiData.data;

    return (
        <>
            <Head title="Dashboard" />
            <div className="pageContent min-h-[80vh] bg-[#0B0E14] p-6 text-white">
                <h1 className="mb-6 text-2xl font-bold text-slate-200">
                    Panel Wymiany - Baza Skinów
                </h1>

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
