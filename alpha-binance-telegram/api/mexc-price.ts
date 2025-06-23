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

    const response = await fetch(mexcUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AlphaCompetition/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`MEXC API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Forward the MEXC API response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching MEXC price:', error);
    res.status(500).json({ 
      error: 'Failed to fetch price data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 