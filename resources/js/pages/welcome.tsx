import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Sparkles, Database, ArrowRight, ShieldCheck, TrendingUp, Clock, Target } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {

    return (
        <>
            <Head title="CS2 Trade-Up Simulator & Skins Price Tracker" />
            
            <div className="relative min-h-screen bg-[#070a10] text-slate-100 overflow-hidden font-sans selection:bg-orange-500 selection:text-black">
                {/* Glowing decorative background grids */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
                
                {/* Orange background radial glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-950/15 blur-[120px] pointer-events-none" />
                <div className="absolute top-[-5%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-950/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-yellow-950/10 blur-[140px] pointer-events-none" />

                {/* ── Top Header Navbar ── */}
                <header className="relative z-10 border-b border-white/5 bg-[#090d16]/60 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-950/60 to-slate-900/60 border border-orange-500/30 text-orange-500">
                                <AppLogoIcon className="size-5" />
                            </div>
                            <div className="grid text-left text-sm">
                                <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-400 bg-clip-text text-transparent">
                                    TradeUpHunter
                                </span>
                                <span className="text-[9px] font-bold text-orange-500/80 uppercase tracking-widest leading-none">
                                    CS2 Simulator
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/tradeups" className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors">
                                Simulator
                            </Link>
                            <Link href="/skins" className="text-sm font-medium text-slate-300 hover:text-orange-400 transition-colors">
                                Skins Database
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* ── Hero Section ── */}
                <main className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-24 text-center">
                    {/* Live Info Banner */}
                    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 mb-6 text-xs text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Real-Time CS2 Analytics Engine</span>
                    </div>

                    {/* Headline */}
                    <h1 className="mx-auto max-w-3xl text-4xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6">
                        The Ultimate{' '}
                        <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                            CS2 Trade-Up
                        </span>{' '}
                        Simulator
                    </h1>

                    {/* Copywriting Intro */}
                    <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
                        Calculate exact outcomes, floats, and wear tiers with precision mathematical models. 
                        Hunt down profitable contracts using live database prices tracked and refreshed from the Steam market.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link
                            href="/tradeups"
                            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-400 text-black font-bold py-3.5 px-8 shadow-xl shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            <Sparkles className="h-5 w-5 fill-current" />
                            <span>Trade-Up Simulator</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/skins"
                            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-200 font-bold py-3.5 px-8 transition-all duration-300"
                        >
                            <Database className="h-5 w-5 text-slate-400" />
                            <span>Skins Database & Prices</span>
                        </Link>
                    </div>

                    {/* Sponsored Affiliate Promo */}
                    <div className="mx-auto max-w-lg mb-16">
                        <a
                            href="https://csgo-skins.com/?ref=ALXAY"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-orange-500/20 bg-orange-950/5 p-4 hover:border-orange-500/40 hover:bg-orange-950/10 transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.02)]"
                        >
                            <div className="absolute top-2.5 right-3 text-[8px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-wider font-extrabold">
                                Sponsored / Affiliate Ad
                            </div>
                            <div className="text-left pr-4 pt-2 sm:pt-0">
                                <h4 className="text-sm font-bold text-orange-400 flex items-center gap-1.5">
                                    <span>CSGO-Skins.com</span>
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    Open CS2 cases, upgrade skins, and withdraw instantly. Use code <span className="font-extrabold text-orange-400">ALXAY</span> for a bonus!
                                </p>
                            </div>
                            <div className="shrink-0 rounded-xl bg-orange-500 group-hover:bg-orange-400 px-4 py-2 text-xs font-bold text-black transition-colors">
                                Claim Bonus
                            </div>
                        </a>
                    </div>

                    {/* ── Key Features Grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                        {/* feature 1 */}
                        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-orange-500/20 transition-all duration-300">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                <Target className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-2">Simulate with Math</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Enter precise skin input floats. Our simulator uses exact outcome formula mechanics to compute floats, wear categories, and chances for the outcome skins.
                            </p>
                        </div>

                        {/* feature 2 */}
                        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-orange-500/20 transition-all duration-300">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-2">Profitability Analytics</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Track Expected Value (EV), Return on Investment (ROI), input costs, and probability curves to verify if a contract will yield profit.
                            </p>
                        </div>

                        {/* feature 3 */}
                        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-sm hover:border-orange-500/20 transition-all duration-300">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100 mb-2">Dynamic Price Updates</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Never guess prices. Standard prices are loaded as 30-day and 90-day averages directly from the Steam market API, updated in the database every 2 hours.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer copy */}
                <footer className="relative z-10 border-t border-white/5 bg-[#090d16]/30 py-8 mt-12 text-center text-xs text-slate-500">
                    <p className="max-w-md mx-auto leading-relaxed">
                        &copy; 2026 alxay.ninja / TradeUpHunter. We are not affiliated with Valve Corp. or Steam. 
                        Skin prices are estimated based on safe 30d/90d averages and updated automatically.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <Link href="/privacy" className="text-slate-400 hover:text-orange-400 transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
