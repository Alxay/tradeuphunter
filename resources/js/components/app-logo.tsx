import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-950/40 to-slate-900/40 border border-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="grid flex-1 text-left text-sm">
                <span className="truncate text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-orange-400 bg-clip-text text-transparent">
                    TradeUpHunter
                </span>
                <span className="text-[10px] font-semibold text-orange-500/80 uppercase tracking-widest leading-none">
                    CS2 Simulator
                </span>
            </div>
        </div>
    );
}
