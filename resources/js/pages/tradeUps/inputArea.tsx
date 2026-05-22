import SkinSlot from './skinSlot';

interface Rarity {
    id: number;
    name: string;
    color_hex: string;
}
interface Skin {
    id: number;
    name: string;
    image_url: string;
    min_float: number;
    max_float: number;
    rarity: Rarity; // Zagnieżdżony obiekt rarity
}

interface Props {
    skins: (Skin | null)[];
    onSlotClick: (index: number) => void;
}

export default function InputArea({ skins, onSlotClick }: Props) {
    return (
        <div className="flex-1">
            {' '}
            {/* flex-1 sprawi, że zajmie odpowiednią szerokość */}
            <h2 className="mb-4 text-xl font-semibold">Input Skins</h2>
            {/* Tutaj później wrzucimy siatkę CSS Grid z 10 slotami */}
            <div className="grid grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                    <SkinSlot
                        key={index}
                        skin={skins[index]}
                        onClick={() => onSlotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
}
