import { useEffect, useState } from "react";
import type { AlphaSoon } from "../data/competitions";

interface AlphaSoonRowProps {
    rowData: AlphaSoon;
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

const AIRDROPCountdownTimer = ({ date1, date2 }: { date1: string, date2: string }) => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const [currentPhase, setCurrentPhase] = useState<'date1' | 'date2'>('date1');
    const [isDate1Expired, setIsDate1Expired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            
            // Check if date1 has expired
            const [date1Part, time1Part] = date1.split(' ');
            const [day1, month1, year1] = date1Part.split('/').map(Number);
            const [hours1, minutes1, seconds1] = time1Part ? time1Part.split(':').map(Number) : [0, 0, 0];
            const date1Deadline = new Date(year1, month1 - 1, day1, hours1, minutes1, seconds1);
            const isDate1ExpiredNow = date1Deadline < now;
            setIsDate1Expired(isDate1ExpiredNow);

            // Determine which date to countdown to
            let targetDate: Date;
            if (!isDate1ExpiredNow) {
                // Still counting down to date1
                targetDate = date1Deadline;
                setCurrentPhase('date1');
            } else {
                // date1 expired, countdown to date2
                const [date2Part, time2Part] = date2.split(' ');
                const [day2, month2, year2] = date2Part.split('/').map(Number);
                const [hours2, minutes2, seconds2] = time2Part ? time2Part.split(':').map(Number) : [0, 0, 0];
                targetDate = new Date(year2, month2 - 1, day2, hours2, minutes2, seconds2);
                setCurrentPhase('date2');
            }

            const difference = targetDate.getTime() - now.getTime();

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
    }, [date1, date2]);

    const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    if (isExpired) {
        return <div className="text-red-500 text-sm font-bold flex justify-end low-20">Hết hạn</div>;
    }

    // Show red color when counting down to date2 (after date1 expired)
    const textColor = currentPhase === 'date2' ? 'text-red-500' : 'text-gray-600';
    const phaseText = currentPhase === 'date2' ? '(Claim 2)' : '(Claim 1)';

    return (
        <div className={`text-sm ${textColor} flex justify-end`}>
            <div className="">
                <span className="text-xs opacity-70">{phaseText} </span>
                {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
                {timeLeft.hours > 0 && <span>{timeLeft.hours}h </span>}
                {timeLeft.minutes > 0 && <span>{timeLeft.minutes}m </span>}
                <span>{timeLeft.seconds}s</span>
            </div>
        </div>
    );
};

const AlphaSoonRow = ({ rowData }: AlphaSoonRowProps) => {
    const isExpired = () => {
        if (rowData.type === 'IDO' && rowData.date) {
            // Parse datetime format: "DD/MM/YYYY HH:MM:SS"
            const [datePart, timePart] = rowData.date.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];

            const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
            const today = new Date();
            return deadlineDate < today;
        } else if (rowData.type === 'AIRDROP' && rowData.date2) {
            // For AIRDROP, check if the second date has passed
            const [datePart, timePart] = rowData.date2.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];

            const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
            const today = new Date();
            return deadlineDate < today;
        } else if (rowData.type === 'AIRDROP2' && rowData.date) {
            // For AIRDROP2, check if the single date has passed
            const [datePart, timePart] = rowData.date.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];

            const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
            const today = new Date();
            return deadlineDate < today;
        }
        return false;
    };

    const hasExpired = isExpired();

    const getTypeBadge = (type: string) => {
        const baseClasses = "px-2 py-1 text-xs font-bold rounded";
        if (type === 'IDO') {
            return `${baseClasses} bg-blue-500 text-white`;
        } else if (type === 'AIRDROP') {
            return `${baseClasses} bg-green-500 text-white`;
        } else if (type === 'AIRDROP2') {
            return `${baseClasses} bg-purple-500 text-white`;
        }
        return `${baseClasses} bg-gray-500 text-white`;
    };

    return (
        <div className={`border-b border-black pb-3 mb-4`}>
            <div className="flex justify-between items-baseline mb-2">
                <div className="flex items-center gap-2">
                    <h3 className={`token-name font-bold text-2xl ${hasExpired ? '' : 'text-black'}`}>
                        {rowData.tokenName}
                    </h3>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg p-1 rounded normal-prize">
                        {rowData.type === 'IDO' ? 'IDO' : rowData.type === 'AIRDROP' ? 'AIRDROP' : 'AIRDROP/FCFS'}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 text-base ml-4 card-competition-info">
                {rowData.type === 'IDO' || rowData.type === 'AIRDROP2' ? (
                    <>
                        <div>Ngày</div>
                        <div className={`text-right ${hasExpired ? 'expired-row' : ''}`}>
                            {rowData.date || 'Chưa có'}
                        </div>
                        <div>Còn lại</div>
                        <div className="mt-1">
                            <CountdownTimer deadline={rowData.date || ''} />
                        </div>
                        <div>Điểm</div>
                        <div className="text-right">{rowData.points || 'Chưa có'}</div>
                    </>
                ) : (
                    <>
                        <div>Ngày claim 1</div>
                        <div className={`text-right ${(() => {
                            if (!rowData.date1) return '';
                            const [datePart, timePart] = rowData.date1.split(' ');
                            const [day, month, year] = datePart.split('/').map(Number);
                            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
                            const date1Deadline = new Date(year, month - 1, day, hours, minutes, seconds);
                            const now = new Date();
                            return date1Deadline < now ? 'expired-date' : '';
                        })()}`}>
                            {rowData.date1 || 'Chưa có'}
                        </div>
                        <div>Điểm claim 1</div>
                        <div className="text-right">{rowData.point1 || 'Chưa có'}</div>
                        <div>Ngày claim 2</div>
                        <div className={`text-right ${(() => {
                            if (!rowData.date2) return '';
                            const [datePart, timePart] = rowData.date2.split(' ');
                            const [day, month, year] = datePart.split('/').map(Number);
                            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
                            const date2Deadline = new Date(year, month - 1, day, hours, minutes, seconds);
                            const now = new Date();
                            return date2Deadline < now ? 'expired-date' : '';
                        })()}`}>
                            {rowData.date2 || 'Chưa có'}
                        </div>
                        <div>Điểm claim 2</div>
                        <div className="text-right">{rowData.point2 || 'Chưa có'}</div>
                        <div>Còn lại</div>
                        <div className="mt-1">
                            <AIRDROPCountdownTimer date1={rowData.date1 || ''} date2={rowData.date2 || ''} />
                        </div>
                        
                        
                    </>
                )}
                <div>Phần thưởng</div>
                <div className="text-right">{rowData.reward || 'Chưa có'} {rowData.reward ? rowData.tokenName : ''}</div>
            </div>
        </div>
    );
};

export default AlphaSoonRow; 