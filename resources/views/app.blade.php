<!DOCTYPE html>
<html lang="en" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        <script>
            (function() {
                const consentCookieName = 'analytics_consent';
                const umamiScriptId = 'umami-analytics-script';
                const umamiScriptSrc = 'https://cloud.umami.is/script.js';
                const umamiWebsiteId = '2776d012-77ea-4d78-90a6-d27918d31696';

                function getConsent() {
                    const cookie = document.cookie
                        .split('; ')
                        .find((entry) => entry.startsWith(consentCookieName + '='));

                    return cookie ? cookie.split('=')[1] : null;
                }

                function setConsentCookie(value) {
                    document.cookie = consentCookieName + '=' + value + '; path=/; max-age=31536000; samesite=lax';
                }

                function loadUmami() {
                    if (document.getElementById(umamiScriptId)) {
                        return;
                    }

                    const script = document.createElement('script');
                    script.defer = true;
                    script.id = umamiScriptId;
                    script.src = umamiScriptSrc;
                    script.setAttribute('data-website-id', umamiWebsiteId);
                    document.head.appendChild(script);
                }

                window.acceptCookies = function() {
                    setConsentCookie('accepted');
                    loadUmami();
                    const banner = document.getElementById('cookie-consent-banner');

                    if (banner) {
                        banner.remove();
                    }
                };

                window.declineCookies = function() {
                    setConsentCookie('declined');
                    const banner = document.getElementById('cookie-consent-banner');

                    if (banner) {
                        banner.remove();
                    }
                };

                const consent = getConsent();

                if (consent === 'accepted') {
                    loadUmami();
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <!-- Global SEO Meta Tags -->
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ request()->url() }}">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'TradeUpHunter') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />

        @if (! in_array(request()->cookie('analytics_consent'), ['accepted', 'declined'], true))
            <div id="cookie-consent-banner" class="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:inset-x-6 sm:bottom-6">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div class="space-y-1">
                        <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Używamy plików cookie</p>
                        <p class="text-sm leading-6 text-slate-600 dark:text-slate-400">
                            Korzystamy z Umami, aby mierzyć ruch i poprawiać działanie serwisu. Analityka zostanie włączona dopiero po Twojej zgodzie.
                        </p>
                    </div>

                    <div class="flex shrink-0 gap-3">
                        <button
                            type="button"
                            onclick="declineCookies()"
                            class="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                        >
                            Odrzuć
                        </button>

                        <button
                            type="button"
                            onclick="acceptCookies()"
                            class="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        >
                            Akceptuję
                        </button>
                    </div>
                </div>
            </div>
        @endif
    </body>
</html>
