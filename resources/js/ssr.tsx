import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppHeaderLayout from '@/layouts/app/app-header-layout';

createInertiaApp({
    layout: (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName === 'welcome' || lowerName === 'privacy') {
            return null;
        }
        return AppHeaderLayout;
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
});
