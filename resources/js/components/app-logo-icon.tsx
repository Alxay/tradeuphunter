import { Locate } from 'lucide-react';
import type { ComponentProps } from 'react';

export default function AppLogoIcon(props: ComponentProps<typeof Locate>) {
    return (
        <Locate
            {...props}
            className={`text-orange-500 ${props.className || ''}`}
        />
    );
}
