import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Sparkles, Database, Clock, BookOpen, FolderGit2 } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/Alxay/tradeuphunter',
        icon: FolderGit2,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;

    const mainNavItems: NavItem[] = [];

    if (auth?.user) {
        mainNavItems.push({
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        });
    }

    mainNavItems.push(
        {
            title: 'Trade-Up Simulator',
            href: '/tradeups',
            icon: Sparkles,
        },
        {
            title: 'Skins Database',
            href: '/skins',
            icon: Database,
        }
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-white/5 p-4 bg-slate-950/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-slate-950/5">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/5 p-4 bg-slate-950/20">
                {auth?.user && <NavUser />}

                {/* Prices Update Banner */}
                <div className="mt-3 rounded-xl border border-orange-500/10 bg-orange-950/10 p-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 font-bold text-orange-500 mb-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Real-time Prices</span>
                    </div>
                    Prices are based on 30d/90d averages and refreshed every 2h.
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
