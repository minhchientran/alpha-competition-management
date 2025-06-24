import { useEffect, useState } from "react";
import type { Competition } from "../data/competitions";
import { useMexcPrice } from "../hooks/useMexcPrice";

interface CompetitionRowProps {
    rowData: Competition;
    triggerFetch: number;
    onPriceUpdate: (id: number, prize: number) => void;
}

const CountdownTimer = ({ deadline }: { deadline: string }) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            // Parse datetime format: "DD/MM/YYYY HH:MM:SS"
            const [datePart, timePart] = deadline.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];

            const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
            const now = new Date();
            const difference = deadlineDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    if (isExpired) {
        return <div className="text-red-500 text-sm font-bold flex justify-end low-20">Hết hạn</div>;
    }

    return (
        <div className="text-sm text-gray-600 flex justify-end">
            <div className="">
                {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
                {timeLeft.hours > 0 && <span>{timeLeft.hours}h </span>}
                {timeLeft.minutes > 0 && <span>{timeLeft.minutes}m </span>}
                <span>{timeLeft.seconds}s</span>
            </div>
        </div>
    );
};

const CompetitionRow = ({ rowData, triggerFetch, onPriceUpdate }: CompetitionRowProps) => {
    const { price, changeRate, loading, error, fetchPrice } = useMexcPrice(rowData.tokenName);

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
        // Parse datetime format: "DD/MM/YYYY HH:MM:SS"
        const [datePart, timePart] = rowData.deadline.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];

        // Create deadline date with time
        const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
        const today = new Date();
        return deadlineDate < today;
    };

    const hasExpired = isExpired();
    const isLow50 = estimatedPrize > 0 && estimatedPrize < 50;
    const isLow20 = estimatedPrize > 0 && estimatedPrize < 20;

    // Format percentage change
    const formatChangeRate = (rate: number | null) => {
        if (rate === null) return '';
        const percentage = (rate * 100).toFixed(2);
        const isPositive = rate >= 0;
        return `${isPositive ? '+' : ''}${percentage}%`;
    };

    const changeRateText = formatChangeRate(changeRate);
    const isPositiveChange = changeRate !== null && changeRate >= 0;

    return (
        <div className={`border-b border-black pb-3 mb-4`}>
            <div className="flex justify-between items-baseline mb-2">
                <h3 className={`token-name font-bold text-2xl ${hasExpired ? '' : 'text-black'}`}>{rowData.tokenName}</h3>
                <div className="text-right price-and-change-rate">
                    <div className={`font-bold text-lg p-1 rounded ${isLow50 ? 'low-50' : 'normal-prize'} ${isLow20 ? 'low-20' : ''}`}>
                        {loading ? '...' : (estimatedPrize > 0 ? `$${estimatedPrize.toFixed(2)}` : '...')} 
                    </div>
                    {changeRateText && (
                        <div className={`rate-text text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                            {changeRateText}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-2 text-base ml-4 card-competition-info">
                <div>Điều kiện</div>
                <div className="text-right">{rowData.condition}</div>
                <div>Deadline</div>
                <div className={`text-right ${hasExpired ? 'expired-row' : ''}`}>
                    {rowData.deadline}
                </div>
                <div>Còn lại</div>
                <div className="mt-1">
                    <CountdownTimer deadline={rowData.deadline} />
                </div>
                <div>Phần thưởng</div>
                <div className="text-right">{rowData.reward.toLocaleString()}</div>
                <div>Giá hiện tại</div>
                <div className="text-right">
                    {loading ? '...' : (error ? <span className="text-red-500">{error}</span> : price)}
                </div>
            </div>
        </div>
    );
};

export default CompetitionRow; 