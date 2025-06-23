import { useState, useCallback } from 'react';

export const useMexcPrice = (symbol: string) => {
    const [price, setPrice] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchPrice = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const url = `/api/mexc-price?symbol=${encodeURIComponent(symbol)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.code && data.code !== 200) {
                throw new Error(`API Error: ${data.msg || `code ${data.code}`}`);
            }

            if (data?.data?.[0]?.last) {
                const parsedPrice = parseFloat(data.data[0].last);
                if (Number.isFinite(parsedPrice)) {
                    setPrice(parsedPrice);
                } else {
                    setError(`Invalid price for ${symbol.toUpperCase()}`);
                    setPrice(null);
                }
            } else {
                setError(`Price not found for ${symbol.toUpperCase()}`);
                setPrice(null);
            }
        } catch (err: any) {
            setError(err.message);
            setPrice(null);
        } finally {
            setLoading(false);
        }
    }, [symbol]);

    return { price, loading, error, fetchPrice };
}; 