import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppHeaderLayout from '@/layouts/app/app-header-layout';

const appName = import.meta.env.VITE_APP_NAME || 'TradeUpHunter';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName === 'welcome' || lowerName === 'privacy') {
            return null;
        }
        return AppHeaderLayout;
    },
    strictMode: true,
    setup({ el, App, props }) {
        const app = (
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster />
            </TooltipProvider>
        );

        if (el) {
            if (el.hasAttribute('data-server-rendered')) {
                hydrateRoot(el, app);
            } else {
                createRoot(el).render(app);
            }
        }
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
