import { Head, Link } from '@inertiajs/react';
import { Sparkles, ArrowLeft, ArrowRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { getSkinSlug, getCollectionSlug } from '@/lib/utils';

interface Rarity {
    id: number;
    name: string;
    color_hex: string;
}

interface Weapon {
    id: number;
    name: string;
}

interface Collection {
    id: number;
    name: string;
    image_url: string;
}

interface Price {
    condition: string;
    is_stattrak: boolean | number;
    price_30d: number | null;
    price_90d: number | null;
}

interface Skin {
    id: number;
    name: string;
    image_url: string;
    min_float: number;
    max_float: number;
    rarity: Rarity;
    weapon?: Weapon;
    collection?: Collection;
    prices: Price[];
}

interface RelatedSkin {
    id: number;
    name: string;
    image_url: string;
    min_float: number;
    max_float: number;
    rarity: Rarity;
    weapon?: Weapon;
    priceFT?: number;
}

interface Props {
    skin: Skin;
    rarityMinus1Skins: RelatedSkin[];
    rarityPlus1Skins: RelatedSkin[];
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

// Help helper for pricing fallback
function getConditionPrice(prices: Price[], condition: string, isSt: boolean) {
    const match = prices.find(
        (p) =>
            p.condition === condition &&
            (isSt ? (p.is_stattrak === true || String(p.is_stattrak) === '1') : (p.is_stattrak === false || String(p.is_stattrak) === '0'))
    );
    return match ? (match.price_30d ?? match.price_90d ?? 0) : 0;
}

function getSteamLink(weaponName: string, skinName: string, condition: string, isStatTrak: boolean) {
    const stPrefix = isStatTrak ? 'StatTrak™ ' : '';
    const fullName = `${stPrefix}${weaponName} | ${skinName} (${condition})`;
    return `https://steamcommunity.com/market/listings/730/${encodeURIComponent(fullName)}`;
}

export default function Show({ skin, rarityMinus1Skins, rarityPlus1Skins }: Props) {
    const rarityColor = skin.rarity?.color_hex || '#6b7280';
    const weaponName = skin.weapon?.name || '';
    const fullName = `${weaponName} | ${skin.name}`;

    return (
        <>
            <Head title={`${fullName} - Prices, Floats & Tradeup Info - TradeUpHunter`}>
                <meta name="description" content={`Check current average prices, wear float limits, and trade-up targets for the CS2 skin ${fullName} from the ${skin.collection?.name || 'Steam collections'}.`} />
                <meta name="keywords" content={`cs2 ${fullName} price, ${fullName} float bounds, ${fullName} stattrak price, cs2 skin market values, steam market redirects`} />
                
                <meta property="og:title" content={`${fullName} - Prices & Floats - TradeUpHunter`} />
                <meta property="og:description" content={`Check current average prices, wear float limits, and trade-up targets for the CS2 skin ${fullName}`} />
                <meta property="og:image" content={skin.image_url} />
                <meta property="og:type" content="website" />
            </Head>

            <div className="pageContent min-h-[90vh] bg-[#0b0f19] p-6 text-white selection:bg-orange-500 selection:text-black">
                {/* Back button and breadcrumbs */}
                <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <Link
                        href="/skins"
                        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Database</span>
                    </Link>

                    {skin.collection && (
                        <div className="text-xs text-slate-400">
                            Collection:{' '}
                            <Link
                                href={`/collection/${skin.collection.id}-${getCollectionSlug(skin.collection.name)}`}
                                className="text-orange-400 hover:underline font-bold"
                            >
                                {skin.collection.name}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Main Two Column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                    {/* Left Column: Image, floats, and basic info */}
                    <div className="lg:col-span-5 space-y-6">
                        <div
                            className="relative flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-slate-950/40 p-8 shadow-xl"
                            style={{ borderTop: `4px solid ${rarityColor}` }}
                        >
                            <img
                                src={skin.image_url}
                                alt={fullName}
                                className="h-56 w-auto object-contain drop-shadow-[0_10px_15px_rgba(255,255,255,0.02)] transition-transform duration-500 hover:scale-105"
                            />

                            <span
                                className="mt-4 inline-block rounded-full px-4 py-1 text-xs font-extrabold tracking-wide uppercase"
                                style={{ backgroundColor: `${rarityColor}1a`, color: rarityColor, border: `1px solid ${rarityColor}33` }}
                            >
                                {skin.rarity?.name}
                            </span>
                        </div>

                        {/* Float bounds visualization */}
                        <div className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 space-y-5">
                            <h3 className="text-sm font-bold text-slate-200">Wear Float Limits</h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-mono font-bold">
                                    <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Min Float: {skin.min_float.toFixed(2)}</span>
                                    <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">Max Float: {skin.max_float.toFixed(2)}</span>
                                </div>
                                
                                <div className="relative pt-2 pb-2">
                                    {/* Background Slider Track */}
                                    <div className="h-2 w-full rounded-full bg-slate-800" />
                                    
                                    {/* Active Slider Track (gradient) */}
                                    <div
                                        className="absolute top-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500"
                                        style={{
                                            left: `${skin.min_float * 100}%`,
                                            right: `${(1 - skin.max_float) * 100}%`,
                                        }}
                                    />
                                    
                                    {/* Min Float Tick */}
                                    <div
                                        className="absolute top-1.5 h-3.5 w-1.5 bg-white rounded shadow"
                                        style={{ left: `${skin.min_float * 100}%`, transform: 'translateX(-50%)' }}
                                        title={`Min Float: ${skin.min_float}`}
                                    />
                                    
                                    {/* Max Float Tick */}
                                    <div
                                        className="absolute top-1.5 h-3.5 w-1.5 bg-white rounded shadow"
                                        style={{ left: `${skin.max_float * 100}%`, transform: 'translateX(-50%)' }}
                                        title={`Max Float: ${skin.max_float}`}
                                    />
                                </div>
                                
                                <div className="pt-2 flex justify-between text-[10px] text-slate-500">
                                    <span>Factory New (0.00)</span>
                                    <span>Field-Tested (0.15 - 0.38)</span>
                                    <span>Battle-Scarred (1.00)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing table and meta details */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white">
                                {weaponName ? (
                                    <>
                                        <span className="text-slate-400 font-medium">{weaponName}</span>{' '}
                                        <span className="text-orange-500">|</span> {skin.name}
                                    </>
                                ) : (
                                    skin.name
                                )}
                            </h1>
                            <p className="text-xs text-slate-400 mt-2">
                                Browse accurate wear average prices. All prices represent average values extracted from active Steam market listings.
                            </p>
                        </div>

                        {/* Price matrix table */}
                        <div className="overflow-hidden rounded-3xl border border-white/5 bg-slate-950/20">
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    <span>Market Prices & Steam Direct Links</span>
                                </h3>
                                <div className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                                    Avg 30 Days
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-[11px] text-slate-500 font-bold uppercase">
                                        <th className="p-4">Condition</th>
                                        <th className="p-4 text-right">Normal Price</th>
                                        <th className="p-4 text-right text-amber-500">StatTrak™ Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CONDITIONS.map((cond) => {
                                        const normalPrice = getConditionPrice(skin.prices, cond, false);
                                        const stPrice = getConditionPrice(skin.prices, cond, true);

                                        return (
                                            <tr key={cond} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors text-sm">
                                                <td className="p-4 font-semibold flex items-center gap-2">
                                                    <span className="rounded bg-slate-800 text-slate-300 font-bold font-mono text-[9px] px-1.5 py-0.5 border border-white/5 uppercase">
                                                        {CONDITION_SHORT[cond]}
                                                    </span>
                                                    <span className="text-slate-300">{cond}</span>
                                                </td>
                                                <td className="p-4 text-right font-mono">
                                                    {normalPrice > 0 ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-slate-100 font-bold">${normalPrice.toFixed(2)}</span>
                                                            <a
                                                                href={getSteamLink(weaponName, skin.name, cond, false)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="View normal on Steam Market"
                                                                className="text-slate-500 hover:text-white transition-colors"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 text-xs">N/A</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right font-mono">
                                                    {stPrice > 0 ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-amber-400 font-bold">${stPrice.toFixed(2)}</span>
                                                            <a
                                                                href={getSteamLink(weaponName, skin.name, cond, true)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                title="View StatTrak™ on Steam Market"
                                                                className="text-amber-500/70 hover:text-amber-400 transition-colors"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-600 text-xs">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Related Adjacent Rarities Section (Tradeups) */}
                <div className="mt-12 space-y-8">
                    <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-orange-500" />
                        <span>Adjacent Rarity Tiers in {skin.collection?.name || 'this collection'}</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Rarity -1 (One tier up, Target output skins) */}
                        <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                                    <span>Trade-up Targets (One Rarity Tier Higher)</span>
                                </h3>
                                <span className="text-[10px] text-slate-500">Output Target</span>
                            </div>

                            {rarityMinus1Skins.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {rarityMinus1Skins.map((s) => (
                                        <Link
                                            key={s.id}
                                            href={`/skin/${s.id}-${getSkinSlug(s.weapon?.name, s.name)}`}
                                            className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3 hover:bg-white/[0.04] hover:border-white/10 transition-all"
                                        >
                                            <img
                                                src={s.image_url}
                                                alt={s.name}
                                                className="h-10 w-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
                                            />
                                            <div className="truncate">
                                                <h4 className="truncate text-xs font-bold text-slate-200 group-hover:text-white">
                                                    {s.weapon?.name} | {s.name}
                                                </h4>
                                                <p className="text-[10px] font-semibold mt-0.5" style={{ color: s.rarity?.color_hex }}>
                                                    {s.rarity?.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs text-slate-500 py-6 justify-center border border-dashed border-white/5 rounded-xl">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>Highest rarity reached (Covert). No higher targets in this collection.</span>
                                </div>
                            )}
                        </div>

                        {/* Rarity +1 (One tier down, Ingredient skins) */}
                        <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-amber-500" />
                                    <span>Trade-up Ingredients (One Rarity Tier Lower)</span>
                                </h3>
                                <span className="text-[10px] text-slate-500">Inputs</span>
                            </div>

                            {rarityPlus1Skins.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {rarityPlus1Skins.map((s) => (
                                        <Link
                                            key={s.id}
                                            href={`/skin/${s.id}-${getSkinSlug(s.weapon?.name, s.name)}`}
                                            className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.01] p-3 hover:bg-white/[0.04] hover:border-white/10 transition-all"
                                        >
                                            <img
                                                src={s.image_url}
                                                alt={s.name}
                                                className="h-10 w-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
                                            />
                                            <div className="truncate">
                                                <h4 className="truncate text-xs font-bold text-slate-200 group-hover:text-white">
                                                    {s.weapon?.name} | {s.name}
                                                </h4>
                                                <p className="text-[10px] font-semibold mt-0.5" style={{ color: s.rarity?.color_hex }}>
                                                    {s.rarity?.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-xs text-slate-500 py-6 justify-center border border-dashed border-white/5 rounded-xl">
                                    <ShieldAlert className="h-4 w-4" />
                                    <span>Lowest rarity reached. No lower ingredients in this collection.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
