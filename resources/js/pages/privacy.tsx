import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Privacy() {
    return (
        <>
            <Head title="Privacy Policy - alxay.ninja" />
            <div className="relative min-h-screen bg-[#070a10] text-slate-100 overflow-hidden font-sans selection:bg-orange-500 selection:text-black">
                {/* Glowing decorative background grids */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
                
                {/* Radial glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-950/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-950/15 blur-[120px] pointer-events-none" />

                {/* ── Navbar ── */}
                <header className="relative z-10 border-b border-white/5 bg-[#090d16]/60 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-950/60 to-slate-900/60 border border-orange-500/30 text-orange-500 group-hover:border-orange-500/50 transition-colors">
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
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 px-4 py-2 text-xs font-semibold text-slate-200 transition-all duration-200"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Go Back</span>
                        </Link>
                    </div>
                </header>

                {/* ── Content ── */}
                <main className="relative z-10 mx-auto max-w-3xl px-6 pt-16 pb-24">
                    <div className="mb-10 text-center">
                        <div className="mx-auto inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 mb-4">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-slate-400">
                            Effective Date: May 26, 2026 • Website: alxay.ninja
                        </p>
                    </div>

                    <div className="space-y-8 rounded-2xl border border-white/5 bg-[#090d16]/40 p-8 backdrop-blur-sm shadow-xl">
                        {/* Section 1 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                1. Data Controller
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The data controller of the alxay.ninja website is the owner of the site. If you have any questions regarding privacy, please contact us at:{' '}
                                <a href="mailto:alxay7@proton.me" className="text-orange-400 hover:underline inline-flex items-center gap-1 font-semibold">
                                    <Mail className="h-3.5 w-3.5 inline" /> alxay7@proton.me
                                </a>.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                2. What Data is Collected
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The alxay.ninja website does not directly collect any personal data from its users (such as names, email addresses, phone numbers, or passwords) as there are no contact forms or user registration systems on the site.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed mt-2">
                                We automatically collect only basic anonymous visit statistics using the Umami analytics tool (e.g., number of visits, viewed pages, time spent on the site, approximate country-level location, device type, and browser).
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                3. Purpose of Data Processing
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Statistical data is processed solely for:
                            </p>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 pl-2">
                                <li>Monitoring website traffic and evaluating its popularity.</li>
                                <li>Optimizing website performance and tailoring it to users' devices.</li>
                                <li>Ensuring the stability and security of the website.</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                4. Cookies and Analytics
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The website uses the <strong>Umami</strong> analytics tool. This is a privacy-first alternative to Google Analytics. It does not track users across other websites and does not build advertising profiles.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Cookies may be used solely to a minimal technical extent for analytical purposes (e.g., to prevent counting the same user twice as a new visitor). You can disable or limit cookie support in your browser settings at any time.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                5. Affiliate Links and Commission Disclosure
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The website contains an affiliate link redirecting to an external partner site – a CS2 case opening and skin exchange platform (<strong>CSGO-Skins.com</strong>). 
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Clicking on this link and taking action on the partner website (e.g., signing in, depositing funds) may result in an affiliate commission for the owner of alxay.ninja. This link is marked on the site as a <strong>sponsored advertisement</strong>.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                6. No User Accounts
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                The alxay.ninja website operates fully open and anonymously. We have disabled and removed all options for registration, login, and user profile creation. Using the simulator and price database does not require providing any credentials.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                7. User Rights (GDPR)
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                According to the General Data Protection Regulation (GDPR), you have the right to access, rectify, erase, or restrict the processing of your data.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Since our website does not collect data allowing the identification of a specific natural person, it is technically impossible to associate anonymous visit statistics with a specific user. Nevertheless, if you have concerns, you have the right to lodge a complaint with a supervisory authority (e.g., the President of the Personal Data Protection Office in Poland or your local GDPR authority).
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                8. Contact
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Please send any inquiries, complaints, or requests regarding privacy to:{' '}
                                <a href="mailto:alxay7@proton.me" className="text-orange-400 hover:underline font-semibold">
                                    alxay7@proton.me
                                </a>.
                            </p>
                        </section>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/5 bg-[#090d16]/30 py-8 text-center text-xs text-slate-500">
                    <p className="max-w-md mx-auto leading-relaxed">
                        &copy; 2026 alxay.ninja. All rights reserved.
                    </p>
                </footer>
            </div>
        </>
    );
}
