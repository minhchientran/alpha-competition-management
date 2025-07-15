export interface Competition {
    id: number;
    tokenName: string;
    condition: string;
    deadline: string;
    reward: number;
}

export interface AlphaSoon {
    id: number;
    tokenName: string;
    date?: string;
    date1?: string;
    date2?: string;
    type: string;
    reward: string;
    points?: string;
    point1?: string;
    point2?: string;
}

export const competitionsData: Competition[] = [
    { id: 20, tokenName: 'BGSC', condition: 'Top 12500', deadline: '15/07/2025 15:30:00', reward: 10900 },
    { id: 21, tokenName: 'MPLX', condition: 'Top 12500', deadline: '20/07/2025 20:00:00', reward: 713 },
    { id: 22, tokenName: 'OIK', condition: 'Top 5000', deadline: '22/07/2025 20:00:00', reward: 1000 },
    { id: 23, tokenName: 'M', condition: 'Top 14000', deadline: '24/07/2025 23:00:00', reward: 357 },
    { id: 24, tokenName: 'IDOL', condition: 'Top 8000', deadline: '24/07/2025 23:00:00', reward: 4750 },
    { id: 25, tokenName: 'AIN', condition: 'Top 9000', deadline: '24/07/2025 23:00:00', reward: 733 },
    { id: 26, tokenName: 'CROSS', condition: 'Top 11000', deadline: '24/07/2025 23:00:00', reward: 909 },
    { id: 27, tokenName: 'ECHO', condition: 'Top 5000', deadline: '24/07/2025 23:00:00', reward: 2000 },
    { id: 28, tokenName: 'PEAQ', condition: 'Top 11000', deadline: '26/07/2025 14:00:00', reward: 955 },
    { id: 29, tokenName: 'SPA', condition: 'Top 9000', deadline: '27/07/2025 21:00:00', reward: 4900 },
];

export const alphaSoonData: AlphaSoon[] = [
    { id: 1, tokenName: 'TAC', type: 'AIRDROP2', date: '15/07/2025 17:00:00', reward: '', points: '' },
    { id: 2, tokenName: 'RION', type: 'IDO', date: '16/07/2025 15:00:00', reward: '', points: '' },
    { id: 3, tokenName: 'ERA', type: 'AIRDROP2', date: '17/07/2025 23:00:00', reward: '', points: '' },
]; 