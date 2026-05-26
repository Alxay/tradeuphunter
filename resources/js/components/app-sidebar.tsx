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

            <SidebarFooter className="border-t border-white/5 p-4 bg-slate-950/20 gap-3">
                {auth?.user && <NavUser />}

                {/* Sponsored Affiliate Link */}
                <a
                    href="https://csgo-skins.com/?ref=ALXAY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block rounded-xl border border-orange-500/10 bg-orange-950/5 p-3 hover:border-orange-500/30 hover:bg-orange-950/10 transition-all duration-200"
                >
                    <div className="flex items-center justify-between text-[11px] font-bold text-orange-400 mb-1">
                        <span>CSGO-Skins.com</span>
                        <span className="text-[8px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded border border-white/5 uppercase">Sponsored</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal group-hover:text-slate-300 transition-colors">
                        Open CS2 cases, upgrade skins, and withdraw instantly. Code <span className="font-bold text-orange-400">ALXAY</span>.
                    </p>
                </a>

                {/* Prices Update Banner */}
                <div className="rounded-xl border border-orange-500/10 bg-orange-950/10 p-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 font-bold text-orange-500 mb-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Real-time Prices</span>
                    </div>
                    Prices are based on 30d/90d averages and refreshed every 2h.
                </div>

                {/* Privacy Policy Link */}
                <div className="text-center mt-1">
                    <Link
                        href="/privacy"
                        className="text-[10px] text-slate-500 hover:text-orange-400 transition-colors"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
