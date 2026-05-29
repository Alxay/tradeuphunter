import { Link } from '@inertiajs/react';
import { Database, Sparkles, Shield, Mail, Globe } from 'lucide-react';

export function AppFooter() {
    return (
        <footer className="border-t border-white/5 bg-[#090d16]/60 backdrop-blur-md text-slate-400 py-12 mt-auto">
            <div className="mx-auto max-w-7xl px-6">
                {/* Upper row: Brand and Quick links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-950/60 to-slate-900/60 border border-orange-500/30 text-orange-500">
                                <Sparkles className="size-4" />
                            </div>
                            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent">
                                TradeUpHunter
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                            The ultimate analytics engine and simulator for Counter-Strike 2 trade-up contracts. Calculate Expected Value (EV), drop probabilities, float values, and track Steam market pricing trends.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/tradeups" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                                    <Sparkles className="h-3 w-3" /> Trade-Up Simulator
                                </Link>
                            </li>
                            <li>
                                <Link href="/skins" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                                    <Database className="h-3 w-3" /> Skins Database & Prices
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                                    <Shield className="h-3 w-3" /> Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support & Contact</h4>
                        <ul className="space-y-2 text-xs">
                            <li className="flex items-center gap-1.5">
                                <Mail className="h-3 w-3 text-slate-500" />
                                <span>alxay7@proton.me</span>
                            </li>
                            <li className="flex items-center gap-1.5">
                                <Globe className="h-3 w-3 text-slate-500" />
                                <a href="https://alxay.ninja" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                                    alxay.ninja
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* SEO Text Block - Copyright & Search Keywords */}
                <div className="py-8 text-slate-500 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed">
                        <div className="space-y-2">
                            <h5 className="font-semibold text-slate-400">CS2 Trade-Up Simulator & Skin Prices Tracker</h5>
                            <p>
                                TradeUpHunter is an advanced calculator and indexing search engine for Counter-Strike 2 tradeup contracts. 
                                Our platform enables precise profitability calculations for custom tradeups. Simply input your weapon float values 
                                (spanning Factory New, Minimal Wear, Field-Tested, Well-Worn, and Battle-Scarred conditions), and our algorithm 
                                computes the Expected Value (EV), win/loss percentages, and physical wear values of all potential outputs. 
                                The database indexes standard and StatTrak™ weapons across all active CS2 and CS:GO collections, such as 
                                the Anubis Collection, Recoil Collection, Kilowatt Collection, and Prisma Collection. 
                                Prices are tracked via average Steam market listing sales and refreshed automatically.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="font-semibold text-slate-400">Counter-Strike 2 Float Calculator & EV Index</h5>
                            <p>
                                Make informed inventory upgrades using scientific tradeup calculations. Track return on investment (ROI), 
                                input costs, and outcome floats based on standard CS2 float degradation math. 
                                Browse our database of CS2 weapons, case drops, gloves, and skins to view live pricing indices. 
                                Compare values across all wears (FN, MW, FT, WW, BS), check StatTrak™ pricing differentials, 
                                and study adjacent rarity tiers within each collection to maximize contract outcomes.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 text-[10px] text-slate-600 space-y-2">
                        <p>
                            &copy; {new Date().getFullYear()} TradeUpHunter / alxay.ninja. All rights reserved.
                        </p>
                        <p>
                            CS2, Counter-Strike 2, CS:GO, Steam, and the Steam logo are trademarks or registered trademarks of Valve Corporation. 
                            TradeUpHunter is a fan site and independent service, not affiliated with or endorsed by Valve Corporation or Steam. 
                            Prices displayed are estimates derived from recent market sales and average database analytics. Use the simulator at your own risk.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
