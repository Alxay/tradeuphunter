import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import InputArea from './inputArea';
import OutputArea from './outputArea';
import StatsBar from './statsBar';
import SelectSkin from './selectSkin';
import { Rarity, Skin, ApiData, Collection } from '../../types/skin';

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

    function conditionToPrice(skin: Skin): number {
        switch (skin.condition ?? 'Field-Tested') {
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

    function getConditionFromFloat(skin: Skin): string {
        if (skin.float == null) return 'N/A';
        const float = skin.float;
        if (float >= 0 && float < 0.07) return 'Factory New';
        if (float >= 0.07 && float < 0.15) return 'Minimal Wear';
        if (float >= 0.15 && float < 0.38) return 'Field-Tested';
        if (float >= 0.38 && float < 0.45) return 'Well-Worn';
        if (float >= 0.45 && float <= 1.0) return 'Battle-Scarred';
        return 'N/A';
    }

    function getSkinNormalizedFloat(skin: Skin, float: number): number {
        const range = skin.max_float - skin.min_float;

        if (range <= 0) {
            return 0;
        }

        return (float - skin.min_float) / range;
    }

    // 3. Jedyne źródło prawdy dla statystyk (Brak useState dla pojedynczych liczb!)
    const stats = useMemo(() => {
        const inputCost = selectedSkins.reduce(
            (sum, skin) => sum + (skin ? conditionToPrice(skin) : 0),
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
            outputSkins.reduce(
                (sum, skin) => sum + (skin ? conditionToPrice(skin) : 0),
                0,
            ) / outputSkins.length;

        const roi = inputCost > 0 ? ((ev - inputCost) / inputCost) * 100 : 0;

        const profitSkinsCount = outputSkins.filter(
            (skin) => (skin ? conditionToPrice(skin) : 0) > inputCost,
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
            // If contract is full after this change, compute average based on the updated array
            if (next.every((s) => s !== null)) {
                const avgFloat =
                    next.reduce(
                        (sum, skin) =>
                            sum + getSkinNormalizedFloat(skin, skin.float || 0),
                        0,
                    ) / next.length;
                setAvgNormalizedFloat(avgFloat);
            }
            return next;
        });
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
        const normalizedAvgFloat =
            selectedSkins.reduce((sum, skin) => {
                if (!skin) {
                    return sum;
                }

                return sum + getSkinNormalizedFloat(skin, skin.float || 0);
            }, 0) / selectedSkins.length;

        setAvgNormalizedFloat(normalizedAvgFloat);

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
                    statTrak: contractStatTrak,
                },
            })
            .then((response) => {
                console.log('Otrzymane dane z API:', response.data);
                // Use the locally computed avgFloat (absolute float) instead of
                // the state `avgNormalizedFloat` which may be stale.
                response.data.map((skin: Skin) => {
                    // avgFloat is an absolute float value (0..1 range), so assign directly
                    skin.float =
                        normalizedAvgFloat * (skin.max_float - skin.min_float) +
                        skin.min_float;
                    skin.condition = getConditionFromFloat(skin);
                });
                setOutputSkins(response.data);
            })
            .catch((error) => {
                console.error('Error fetching tradeup results:', error);
            });
        // selectedSkins musi tu być, by zmiana dowolnego skina przy pełnym kontrakcie wysłała nowe zapytanie
    }, [selectedSkins]);

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
                        conditionToPrice={conditionToPrice}
                    />
                    <OutputArea
                        outputSkins={outputSkins}
                        getConditionFromFloat={getConditionFromFloat}
                        conditionToPrice={conditionToPrice}
                    />
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
