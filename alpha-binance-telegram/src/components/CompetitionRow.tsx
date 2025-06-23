import { useEffect } from "react";
import type { Competition } from "../data/competitions";
import { useMexcPrice } from "../hooks/useMexcPrice";

interface CompetitionRowProps {
    rowData: Competition;
    triggerFetch: number;
    onPriceUpdate: (id: number, prize: number) => void;
}

const CompetitionRow = ({ rowData, triggerFetch, onPriceUpdate }: CompetitionRowProps) => {
    const { price, loading, error, fetchPrice } = useMexcPrice(rowData.tokenName);

    useEffect(() => {
        fetchPrice();
    }, [fetchPrice]);

    useEffect(() => {
        if (triggerFetch > 0) {
            fetchPrice();
        }
    }, [triggerFetch, fetchPrice]);

    const estimatedPrize = price ? price * rowData.reward : 0;

    useEffect(() => {
        onPriceUpdate(rowData.id, estimatedPrize);
    }, [estimatedPrize, onPriceUpdate, rowData.id]);

    const isExpired = () => {
        const [day, month, year] = rowData.deadline.split('/').map(Number);
        // The deadline is considered passed at the start of the next day.
        const deadlineDate = new Date(year, month - 1, day + 1);
        const today = new Date();
        return deadlineDate < today;
    };

    const hasExpired = isExpired();
    const isLow50 = estimatedPrize > 0 && estimatedPrize < 50;
    const isLow20 = estimatedPrize > 0 && estimatedPrize < 20;

    return (
        <div className={`border-b border-black pb-3 mb-4`}>
            <div className="flex justify-between items-baseline mb-2">
                <h3 className={`font-bold text-2xl ${hasExpired ? '' : 'text-black'}`}>{rowData.tokenName}</h3>
                <span className={`font-bold text-lg p-1 rounded ${isLow50 ? 'low-50' : 'normal-prize'} ${isLow20 ? 'low-20' : ''}`}>
                    {loading ? '...' : (estimatedPrize > 0 ? `$${estimatedPrize.toFixed(2)}` : '...')}
                </span>
            </div>
            <div className="grid grid-cols-2 text-base ml-4">
                <div>Điều kiện</div>
                <div className="text-right">{rowData.condition}</div>
                <div>Deadline</div>
                <div className={`text-right ${hasExpired ? 'expired-row' : ''}`}>{rowData.deadline}</div>
                <div>Phần thưởng</div>
                <div className="text-right">{rowData.reward.toLocaleString()}</div>
                <div>Giá MEXC</div>
                <div className="text-right">
                    {loading ? '...' : (error ? <span className="text-red-500">{error}</span> : price)}
                </div>
            </div>
        </div>
    );
};

export default CompetitionRow; 