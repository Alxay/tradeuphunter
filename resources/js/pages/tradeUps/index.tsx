import { Head, InfiniteScroll, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import InputArea from './inputArea';
import OutputArea from './outputArea';
import StatsBar from './statsBar';
import SelectSkin from './selectSkin';

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
}

interface Collection {
    id: number;
    name: string;
    api_id: number;
    image_url: string;
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'TradeUps',
            href: dashboard(),
        },
    ],
};

export default function Index({ apiData, collections, rarities }: Props) {
    const [selectingSkin, setSelectingSkin] = useState(false);
    const [selectedSkins, setSelectedSkins] = useState<(Skin | null)[]>(
        Array(10).fill(null),
    );
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [contractRarity, setContractRarity] = useState<Rarity | null>(null);

    const [outputSkins, setOutputSkins] = useState<Skin[]>([]);
    const [EV, setEV] = useState<number | null>(null);
    const [inputCost, setInputCost] = useState<number | null>(null);
    const [expectedReturn, setExpectedReturn] = useState<number | null>(null);
    const [ROI, setROI] = useState<number | null>(null);
    const [chanceForProfit, setChanceForProfit] = useState<number | null>(null);
    const [expectedProfit, setExpectedProfit] = useState<number | null>(null);

    function openPicker(index: number) {
        setSelectedSlot(index);
        setSelectingSkin(true);
    }

    function handleSkinSelect(skin: Skin) {
        if (selectedSlot === null) return;
        setSelectedSkins((prev) => {
            const next = [...prev];
            next[selectedSlot] = skin;
            return next;
        });
        setContractRarity(skin.rarity);
        setSelectingSkin(false);
        setSelectedSlot(null);
    }

    const isFull = useMemo(
        () => selectedSkins.every((s) => s !== null),
        [selectedSkins],
    );

    useEffect(() => {
        if (!isFull) return;
        const avgFloat = 0.2;
        const rarityId = contractRarity ? contractRarity.id : 1;
        // kolekcje musza byc UNIKALNE
        const collectionIds = Array.from(
            new Set(selectedSkins.map((s) => s!.collection_id)),
        );

        axios
            .get('/api/tradeup', {
                params: {
                    avgInputFloat: avgFloat,
                    rarity: rarityId,
                    collections: collectionIds,
                    statTrak: 0,
                },
            })
            .then((response) => {
                console.log('Tradeup results:', response.data);
                setOutputSkins(response.data);
                var ev =
                    response.data.reduce(
                        (sum: number, skin: Skin) => sum + (skin.price || 0),
                        0,
                    ) / response.data.length;
                setEV(ev);
                var inputCost = selectedSkins.reduce(
                    (sum, skin) => sum + (skin?.price || 0),
                    0,
                );
                setInputCost(inputCost);
                setExpectedReturn(ev);
                setROI(
                    inputCost > 0 ? ((ev - inputCost) / inputCost) * 100 : null,
                );
                setChanceForProfit(
                    (response.data.filter(
                        (skin: Skin) => (skin.price || 0) > inputCost,
                    ).length /
                        response.data.length) *
                        100,
                );
                setExpectedProfit(
                    (response.data.filter(
                        (skin: Skin) => (skin.price || 0) > inputCost,
                    ).length /
                        response.data.length) *
                        100,
                );
            })
            .catch((error) => {
                console.error('Error fetching tradeup results:', error);
            });
    }, [isFull]);

    return (
        <>
            <Head title="Dashboard" />
            {/*Page Content*/}
            <div className="min-h-[80vh] bg-[#0B0E14] p-6 text-white">
                {/*Header*/}
                <StatsBar
                    EV={EV}
                    inputCost={inputCost}
                    expectedReturn={expectedReturn}
                    ROI={ROI}
                    chanceForProfit={chanceForProfit}
                    expectedProfit={expectedProfit}
                />
                {/*TradeUp area*/}
                <div className="flex gap-6">
                    {/*Left div with input skins*/}
                    <InputArea
                        skins={selectedSkins}
                        onSlotClick={(i) => openPicker(i)}
                    />
                    {/*Right div with output skins*/}
                    <OutputArea outputSkins={outputSkins} />
                </div>
            </div>

            <SelectSkin
                apiData={apiData}
                collections={collections}
                rarities={rarities}
                contractRarity={contractRarity}
                onSelect={handleSkinSelect}
                onClose={() => setSelectingSkin(false)}
                visible={selectingSkin && selectedSlot !== null}
            />
        </>
    );
}
