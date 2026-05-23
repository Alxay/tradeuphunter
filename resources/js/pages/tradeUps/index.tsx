import { Head } from '@inertiajs/react';
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
    rarity: Rarity;
    collection_id: number;
    price: number;
    condition?: string | null;
    statTrak: boolean;
    float?: number | null;
}

interface ApiData {
    current_page: number;
    data: Skin[];
    total?: number;
    last_page?: number;
}

interface Collection {
    id: number;
    name: string;
    api_id: number;
    image_url: string;
}

interface Props {
    apiData: ApiData;
    collections: Collection[];
    rarities: Rarity[];
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
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [selectedSkins, setSelectedSkins] = useState<(Skin | null)[]>(
        Array(10).fill(null),
    );
    const [outputSkins, setOutputSkins] = useState<Skin[]>([]);
    const [avgNormalizedFloat, setAvgNormalizedFloat] = useState(0);

    // 1. Dynamicznie sprawdzamy rzadkość na podstawie pierwszego wrzuconego skina
    const contractRarity = useMemo(() => {
        const firstSkin = selectedSkins.find((s) => s !== null);
        return firstSkin ? firstSkin.rarity : null;
    }, [selectedSkins]);

    const contractStatTrak = useMemo(() => {
        const firstSkin = selectedSkins.find((s) => s !== null);
        return firstSkin ? firstSkin.statTrak : null;
    }, [selectedSkins]);

    // 2. Czy kontrakt ma komplet 10 skinów
    const isFull = useMemo(
        () => selectedSkins.every((s) => s !== null),
        [selectedSkins],
    );

    // 3. Jedyne źródło prawdy dla statystyk (Brak useState dla pojedynczych liczb!)
    const stats = useMemo(() => {
        const inputCost = selectedSkins.reduce(
            (sum, skin) => sum + (skin?.price || 0),
            0,
        );

        if (outputSkins.length === 0) {
            return {
                ev: 0,
                inputCost,
                expectedReturn: 0,
                roi: 0,
                chanceForProfit: 0,
                expectedProfit: 0,
            };
        }

        const ev =
            outputSkins.reduce((sum, skin) => sum + (skin.price || 0), 0) /
            outputSkins.length;

        const roi = inputCost > 0 ? ((ev - inputCost) / inputCost) * 100 : 0;

        const profitSkinsCount = outputSkins.filter(
            (skin) => (skin.price || 0) > inputCost,
        ).length;

        const chanceForProfit = (profitSkinsCount / outputSkins.length) * 100;
        const expectedProfit = ev - inputCost;

        return {
            ev,
            inputCost,
            expectedReturn: ev,
            roi,
            chanceForProfit,
            expectedProfit,
        };
    }, [selectedSkins, outputSkins]);

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
        setSelectingSkin(false);
        setSelectedSlot(null);
    }

    function delSkin(index: number) {
        console.log('Usuwam skina z indexu:', index);
        setSelectedSkins((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    }

    function updateFloat(position: number, value: number) {
        setSelectedSkins((prev) => {
            const next = [...prev];
            if (next[position]) {
                next[position] = { ...next[position], float: value };
            }
            return next;
        });

        if (isFull) {
            const avgFloat =
                selectedSkins.reduce(
                    (sum, skin) => sum + (skin?.float || 0),
                    0,
                ) / selectedSkins.length;
            setAvgNormalizedFloat(avgFloat);
        }
    }

    // 4. Pobieranie danych z API z poprawnymi zależnościami
    useEffect(() => {
        if (!isFull) {
            if (outputSkins.length > 0) setOutputSkins([]); // Czyścimy wyniki, jeśli wyciągnięto skina
            return;
        }

        const avgFloat =
            selectedSkins.reduce((sum, skin) => sum + (skin?.float || 0), 0) /
            selectedSkins.length;
        setAvgNormalizedFloat(avgFloat);

        const rarityId = contractRarity ? contractRarity.id : 1;

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
                console.log('Otrzymane dane z API:', response.data);
                setOutputSkins(response.data);
            })
            .catch((error) => {
                console.error('Error fetching tradeup results:', error);
            });
        // selectedSkins musi tu być, by zmiana dowolnego skina przy pełnym kontrakcie wysłała nowe zapytanie
    }, [isFull, selectedSkins, contractRarity]);

    function duplicateSkin(skin: unknown) {
        for (let i = 0; i < 10; i++) {
            if (selectedSkins[i] === null) {
                setSelectedSkins((prev) => {
                    const next = [...prev];
                    next[i] = skin as Skin;
                    return next;
                });
                break;
            }
        }
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-[80vh] bg-[#0B0E14] p-6 text-white">
                {/* Przekazujemy wartości bezpośrednio z obiektu stats */}
                <StatsBar
                    EV={stats.ev}
                    inputCost={stats.inputCost}
                    expectedReturn={stats.expectedReturn}
                    ROI={stats.roi}
                    chanceForProfit={stats.chanceForProfit}
                    expectedProfit={stats.expectedProfit}
                    avgNormalizedFloat={avgNormalizedFloat}
                />

                <div className="flex gap-6">
                    <InputArea
                        skins={selectedSkins}
                        reset={() => setSelectedSkins(Array(10).fill(null))}
                        onSlotClick={(i) => openPicker(i)}
                        duplicateSkin={duplicateSkin}
                        delSkin={delSkin}
                        updateFloat={updateFloat}
                    />
                    <OutputArea outputSkins={outputSkins} />
                </div>
            </div>

            <SelectSkin
                apiData={apiData}
                collections={collections}
                rarities={rarities}
                contractRarity={contractRarity}
                contractStatTrak={contractStatTrak}
                onSelect={handleSkinSelect}
                onClose={() => setSelectingSkin(false)}
                visible={selectingSkin && selectedSlot !== null}
            />
        </>
    );
}
