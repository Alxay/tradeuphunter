import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
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
            title: 'Trade-Up Simulator',
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
    const lastChangeType = useRef<'composition' | 'float'>('composition');

    // Rarity is locked to the first added skin's rarity
    const contractRarity = useMemo(() => {
        const first = selectedSkins.find((s) => s !== null);
        return first ? first.rarity : null;
    }, [selectedSkins]);

    // StatTrak is locked to the first added skin's statTrak flag
    const contractStatTrak = useMemo(() => {
        const first = selectedSkins.find((s) => s !== null);
        return first ? first.statTrak : null;
    }, [selectedSkins]);

    // Is the contract full (10/10)?
    const isFull = useMemo(
        () => selectedSkins.every((s) => s !== null),
        [selectedSkins],
    );

    // ── Utility helpers ──

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
        const f = skin.float;
        if (f >= 0 && f <= 0.07) return 'Factory New';
        if (f > 0.07 && f <= 0.15) return 'Minimal Wear';
        if (f > 0.15 && f <= 0.38) return 'Field-Tested';
        if (f > 0.38 && f <= 0.45) return 'Well-Worn';
        if (f > 0.45 && f <= 1.0) return 'Battle-Scarred';
        return 'N/A';
    }

    function getSkinNormalizedFloat(skin: Skin, float: number): number {
        const range = skin.max_float - skin.min_float;
        if (range <= 0) return 0;
        return (float - skin.min_float) / range;
    }

    // ── Derived stats (single source of truth) ──

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

        const ev = outputSkins.reduce((sum, skin) => {
            const price = skin ? conditionToPrice(skin) : 0;
            const chance = skin?.chance ? skin.chance : 0;
            return sum + price * (chance / 100);
        }, 0);

        const roi = inputCost > 0 ? ((ev - inputCost) / inputCost) * 100 : 0;

        const chanceForProfit = outputSkins.reduce((sum, skin) => {
            const price = skin ? conditionToPrice(skin) : 0;
            const chance = skin?.chance ? skin.chance : 0;
            if (price > inputCost) {
                return sum + chance;
            }
            return sum;
        }, 0);

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

    // ── Handlers ──

    function openPicker(index: number) {
        setSelectedSlot(index);
        setSelectingSkin(true);
    }

    function handleSkinSelect(skin: Skin) {
        if (selectedSlot === null) return;
        lastChangeType.current = 'composition';
        setSelectedSkins((prev) => {
            const next = [...prev];
            next[selectedSlot] = skin;
            return next;
        });
        setSelectingSkin(false);
        setSelectedSlot(null);
    }

    function delSkin(index: number) {
        lastChangeType.current = 'composition';
        setSelectedSkins((prev) => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
    }

    function updateFloat(position: number, value: number) {
        lastChangeType.current = 'float';
        setSelectedSkins((prev) => {
            const next = [...prev];
            if (next[position]) {
                const updated: Skin = { ...next[position]!, float: value };
                // Keep condition in sync with float (immutably)
                updated.condition = getConditionFromFloat(updated);
                next[position] = updated;
            }
            if (next.every((s) => s !== null)) {
                const avg =
                    next.reduce(
                        (sum, s) =>
                            sum + getSkinNormalizedFloat(s!, s!.float || 0),
                        0,
                    ) / next.length;
                setAvgNormalizedFloat(avg);
            }
            return next;
        });
    }

    function duplicateSkin(skin: Skin) {
        for (let i = 0; i < 10; i++) {
            if (selectedSkins[i] === null) {
                lastChangeType.current = 'composition';
                setSelectedSkins((prev) => {
                    const next = [...prev];
                    next[i] = skin;
                    return next;
                });
                break;
            }
        }
    }

    function fillEmptySlots(skin: Skin) {
        lastChangeType.current = 'composition';
        setSelectedSkins((prev) => {
            const next = [...prev];
            for (let i = 0; i < 10; i++) {
                if (next[i] === null) {
                    next[i] = skin;
                }
            }
            return next;
        });
    }

    /**
     * Set all skin floats so the average normalized float equals the target.
     * Each skin's float = skin.min_float + targetNorm * (skin.max_float - skin.min_float),
     * clamped to [min_float, max_float].
     */
    const handleAvgFloatInput = useCallback(
        (targetAvg: number) => {
            if (!isFull) return;
            lastChangeType.current = 'float';
            setSelectedSkins((prev) => {
                const next = prev.map((s) => {
                    if (!s) return s;
                    const range = s.max_float - s.min_float;
                    const newFloat = Math.min(
                        s.max_float,
                        Math.max(
                            s.min_float,
                            s.min_float + targetAvg * range,
                        ),
                    );
                    const updated: Skin = {
                        ...s,
                        float: parseFloat(newFloat.toFixed(6)),
                    };
                    updated.condition = getConditionFromFloat(updated);
                    return updated;
                });

                // Update avg normalized float
                const avg =
                    next.reduce(
                        (sum, s) =>
                            sum +
                            getSkinNormalizedFloat(s!, s!.float || 0),
                        0,
                    ) / next.length;
                setAvgNormalizedFloat(avg);

                return next;
            });
        },
        [isFull],
    );

    // ── Fetch trade-up output when contract changes ──

    useEffect(() => {
        if (!isFull) {
            if (outputSkins.length > 0) setOutputSkins([]);
            return;
        }

        const avgFloat =
            selectedSkins.reduce((sum, s) => sum + (s?.float || 0), 0) /
            selectedSkins.length;

        const normalizedAvg =
            selectedSkins.reduce((sum, s) => {
                if (!s) return sum;
                return sum + getSkinNormalizedFloat(s, s.float || 0);
            }, 0) / selectedSkins.length;

        setAvgNormalizedFloat(normalizedAvg);

        // Float-only change → recalculate locally, no API call
        if (lastChangeType.current === 'float') {
            setOutputSkins((prev) =>
                prev.map((skin) => {
                    const newFloat =
                        normalizedAvg * (skin.max_float - skin.min_float) +
                        skin.min_float;
                    const updated: Skin = { ...skin, float: newFloat };
                    updated.condition = getConditionFromFloat(updated);
                    return updated;
                }),
            );
            return;
        }

        // Composition change → fetch from API
        const rarityId = contractRarity ? contractRarity.id : 1;
        const collectionIds = selectedSkins.map((s) => s!.collection_id);

        axios
            .get('/api/tradeup', {
                params: {
                    avgInputFloat: normalizedAvg,
                    rarity: rarityId,
                    collections: collectionIds,
                    statTrak: contractStatTrak,
                },
            })
            .then((response) => {
                const processed: Skin[] = (response.data as Skin[]).map(
                    (skin) => {
                        const newFloat =
                            normalizedAvg * (skin.max_float - skin.min_float) +
                            skin.min_float;
                        const updated: Skin = { ...skin, float: newFloat };
                        updated.condition = getConditionFromFloat(updated);
                        return updated;
                    },
                );
                setOutputSkins(processed);
            })
            .catch((error) => {
                console.error('Error fetching tradeup results:', error);
            });
    }, [selectedSkins]);

    // ── Render ──

    return (
        <>
            <Head title="Trade-Up Simulator">
                <meta name="description" content="Calculate outcomes, floats, wear tiers, EV, and ROI for CS2 trade-up contracts with mathematical models and live Steam prices." />
                <meta name="keywords" content="cs2 tradeup calculator, trade up simulator, cs2 trade contract, float calculator cs2, skin tradeup profit" />
            </Head>
            <div className="min-h-[90vh] bg-background p-6 text-white">
                {/* ── Page Header ── */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-orange-500 fill-current" />
                            <span>Trade-Up Contract Simulator</span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Simulate CS2 / CS:GO contract outcomes, float math, and expected profitability.
                        </p>
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

                <StatsBar
                    EV={stats.ev}
                    inputCost={stats.inputCost}
                    expectedReturn={stats.expectedReturn}
                    ROI={stats.roi}
                    chanceForProfit={stats.chanceForProfit}
                    expectedProfit={stats.expectedProfit}
                    avgNormalizedFloat={avgNormalizedFloat}
                    selectedSkins={selectedSkins}
                    updateFloat={updateFloat}
                    onAvgFloatInput={handleAvgFloatInput}
                />

                <div className="flex flex-col gap-6 lg:flex-row">
                    <InputArea
                        skins={selectedSkins}
                        reset={() => {
                            lastChangeType.current = 'composition';
                            setSelectedSkins(Array(10).fill(null));
                        }}
                        onSlotClick={(i) => openPicker(i)}
                        duplicateSkin={duplicateSkin}
                        fillEmptySlots={fillEmptySlots}
                        delSkin={delSkin}
                        updateFloat={updateFloat}
                        conditionToPrice={conditionToPrice}
                    />
                    <OutputArea
                        outputSkins={outputSkins}
                        inputCost={stats.inputCost}
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
