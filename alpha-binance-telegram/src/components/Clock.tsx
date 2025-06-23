import { useState, useEffect } from 'react';

const Clock = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => {
            clearInterval(timerId);
        };
    }, []);

    const formatDateTime = (timeZone: string) => {
        const options: Intl.DateTimeFormatOptions = {
            timeZone,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    return (
        <div className="text-center text-sm text-gray-500 mb-4">
            <div><strong>VN:</strong> {formatDateTime('Asia/Ho_Chi_Minh')}</div>
            <div><strong>UTC:</strong> {formatDateTime('UTC')}</div>
        </div>
    );
};

export default Clock; 