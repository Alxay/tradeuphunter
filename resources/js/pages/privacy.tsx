import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Privacy() {
    return (
        <>
            <Head title="Polityka Prywatności - alxay.ninja" />
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
                            <span>Powrót</span>
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
                            Polityka Prywatności
                        </h1>
                        <p className="text-sm text-slate-400">
                            Ważna od: 26 maja 2026 r. • Serwis alxay.ninja
                        </p>
                    </div>

                    <div className="space-y-8 rounded-2xl border border-white/5 bg-[#090d16]/40 p-8 backdrop-blur-sm shadow-xl">
                        {/* Section 1 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                1. Administrator danych
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Administratorem danych osobowych serwisu alxay.ninja jest właściciel strony. W przypadku jakichkolwiek pytań dotyczących prywatności, zachęcamy do kontaktu pod adresem e-mail:{' '}
                                <a href="mailto:alxay7@proton.me" className="text-orange-400 hover:underline inline-flex items-center gap-1 font-semibold">
                                    <Mail className="h-3.5 w-3.5 inline" /> alxay7@proton.me
                                </a>.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                2. Jakie dane są zbierane
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Serwis alxay.ninja nie zbiera bezpośrednio żadnych danych osobowych od swoich użytkowników (takich jak imiona, adresy e-mail, numery telefonów czy hasła), ponieważ na stronie nie znajdują się formularze kontaktowe ani system rejestracji użytkowników.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed mt-2">
                                W sposób automatyczny i w pełni anonimowy zbieramy jedynie podstawowe statystyki odwiedzin przy użyciu narzędzia analitycznego Umami (np. liczba wizyt, przeglądane podstrony, czas spędzony na stronie, przybliżona lokalizacja na poziomie kraju, typ urządzenia oraz przeglądarki).
                            </p>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                3. Cel przetwarzania danych
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Dane statystyczne przetwarzane są wyłącznie w celu:
                            </p>
                            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1.5 pl-2">
                                <li>Monitorowania ruchu na stronie i badania jej popularności.</li>
                                <li>Optymalizacji działania serwisu i dostosowania go do urządzeń użytkowników.</li>
                                <li>Zapewnienia stabilności i bezpieczeństwa strony internetowej.</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                4. Cookies i analityka
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Strona korzysta z narzędzia analitycznego <strong>Umami</strong>. Jest to alternatywa dla Google Analytics dbająca o prywatność (privacy-first). Narzędzie to nie śledzi użytkowników na innych stronach ani nie tworzy profili reklamowych.
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Ewentualne pliki cookies (ciasteczka) mogą być wykorzystywane wyłącznie w minimalnym zakresie technicznym do celów analitycznych (np. aby uniknąć wielokrotnego zliczania tego samego użytkownika jako nowego odwiedzającego). Możesz w każdej chwili wyłączyć lub ograniczyć obsługę cookies w ustawieniach swojej przeglądarki internetowej.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                5. Linki afiliacyjne i informacja o prowizji
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Serwis zawiera link afiliacyjny przekierowujący do zewnętrznej strony partnerskiej – platformy wymiany i otwierania skrzynek CS2 (<strong>CSGO-Skins.com</strong>). 
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Kliknięcie w ten link i podjęcie działań na stronie partnerskiej (np. zalogowanie, doładowanie salda) może skutkować naliczeniem prowizji partnerskiej dla właściciela alxay.ninja. Link ten jest oznaczony w serwisie jako <strong>reklama sponsorowana</strong>.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                6. Brak kont użytkowników
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Serwis alxay.ninja działa w pełni otwarcie i anonimowo. Wyłączyliśmy oraz usunęliśmy wszelkie opcje rejestracji, logowania i tworzenia profili. Korzystanie z symulatora oraz bazy cen nie wymaga podawania żadnych danych uwierzytelniających.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                7. Prawa użytkownika (RODO)
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Zgodnie z Ogólnym Rozporządzeniem o Ochronie Danych (RODO), przysługują Ci prawa dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania. 
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Ponieważ nasz serwis nie gromadzi danych umożliwiających identyfikację konkretnej osoby fizycznej, w większości przypadków technicznie niemożliwe jest powiązanie anonimowych statystyk wizyt z konkretnym użytkownikiem. Mimo to, jeśli masz wątpliwości, masz prawo wnieść skargę do organu nadzorczego (Prezesa Urzędu Ochrony Danych Osobowych w Polsce).
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section className="space-y-2">
                            <h2 className="text-lg font-bold text-orange-500 border-b border-white/5 pb-1">
                                8. Kontakt
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Wszelkie zapytania, skargi oraz wnioski dotyczące prywatności prosimy kierować na adres:{' '}
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
                        &copy; 2026 alxay.ninja. Wszystkie prawa zastrzeżone.
                    </p>
                </footer>
            </div>
        </>
    );
}
