import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { symbol } = req.query;

    if (!symbol || typeof symbol !== 'string') {
      res.status(400).json({ error: 'Symbol parameter is required' });
      return;
    }

    const pair = symbol.toUpperCase() + "_USDT";
    const mexcUrl = `https://www.mexc.com/open/api/v2/market/ticker?symbol=${pair}`;

    // Try MEXC first
    try {
      const mexcResponse = await fetch(mexcUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AlphaCompetition/1.0)',
        },
      });

      if (mexcResponse.ok) {
        const mexcData = await mexcResponse.json();
        res.status(200).json(mexcData);
        return;
      }
    } catch (mexcError) {
      console.log('MEXC API failed, trying Bybit...');
    }

    // Fallback to Bybit if MEXC fails
    const bybitSymbol = symbol.toUpperCase() + "USDT";
    const bybitUrl = `https://api.bybit.com/v5/market/tickers?category=spot&symbol=${bybitSymbol}`;

    const bybitResponse = await fetch(bybitUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AlphaCompetition/1.0)',
      },
    });

    if (!bybitResponse.ok) {
      throw new Error(`Bybit API responded with status: ${bybitResponse.status}`);
    }

    const bybitData = await bybitResponse.json();

    // Transform Bybit response to match MEXC format
    if (bybitData.retCode === 0 && bybitData.result.list && bybitData.result.list.length > 0) {
      const ticker = bybitData.result.list[0];
      const transformedData = {
        code: 200,
        data: [{
          symbol: ticker.symbol.replace('USDT', '_USDT'),
          price: String(ticker.lastPrice),
          volume: String(ticker.volume24h),
          high: String(ticker.highPrice24h),
          low: String(ticker.lowPrice24h),
          change: String(ticker.price24hPcnt),
          changeRate: String(ticker.price24hPcnt),
          source: 'bybit'
        }]
      };
      res.status(200).json(transformedData);
    } else {
      throw new Error('Invalid response from Bybit API');
    }

  } catch (error) {
    console.error('Error fetching price data:', error);
    res.status(500).json({
      error: 'Failed to fetch price data from both MEXC and Bybit',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 