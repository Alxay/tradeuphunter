interface StatsBarProps {
    EV: number | null;
    inputCost: number | null;
    expectedReturn: number | null;
    ROI: number | null;
    chanceForProfit: number | null;
    expectedProfit: number | null;
    avgNormalizedFloat: number;
}

export default function StatsBar({
    EV,
    inputCost,
    expectedReturn,
    ROI,
    chanceForProfit,
    expectedProfit,
    avgNormalizedFloat,
}: StatsBarProps) {
    return (
        <div className="mb-6 flex justify-between rounded-md bg-gray-800 p-4">
            <p>Statystyki kontraktu</p>
            <div className="flex gap-6">
                <p>EV: {EV !== null ? EV.toFixed(2) : 'N/A'}</p>
                <p>
                    Koszt wejścia:{' '}
                    {inputCost !== null ? inputCost.toFixed(2) : 'N/A'}
                </p>
                <p>
                    Oczekiwany zwrot:{' '}
                    {expectedReturn !== null
                        ? expectedReturn.toFixed(2)
                        : 'N/A'}
                </p>
                <p>ROI: {ROI !== null ? ROI.toFixed(2) + '%' : 'N/A'}</p>
                <p>
                    Szansa na zysk:{' '}
                    {chanceForProfit !== null
                        ? chanceForProfit.toFixed(2) + '%'
                        : 'N/A'}
                </p>
                <p>
                    Oczekiwany zysk:{' '}
                    {expectedProfit !== null
                        ? expectedProfit.toFixed(2) + ' $'
                        : 'N/A'}
                </p>
                <p>
                    Średni znormalizowany float:{' '}
                    {avgNormalizedFloat !== null
                        ? avgNormalizedFloat.toFixed(10)
                        : 'N/A'}
                </p>
            </div>
        </div>
    );
}
