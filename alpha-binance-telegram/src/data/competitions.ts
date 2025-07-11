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
    { id: 18, tokenName: 'REKT', condition: 'Top 12500', deadline: '12/07/2025 20:00:00', reward: 277800000, },
    { id: 19, tokenName: 'FUEL', condition: 'Top 9000', deadline: '13/07/2025 20:00:00', reward: 11000 },
    { id: 20, tokenName: 'BGSC', condition: 'Top 12500', deadline: '15/07/2025 15:30:00', reward: 10900 },
    { id: 21, tokenName: 'MPLX', condition: 'Top 12500', deadline: '20/07/2025 20:00:00', reward: 713 },
    { id: 22, tokenName: 'OIK', condition: 'Top 5000', deadline: '22/07/2025 20:00:00', reward: 1000 },
    { id: 23, tokenName: 'M', condition: 'Top 14000', deadline: '24/07/2025 23:00:00', reward: 357 },
    { id: 24, tokenName: 'IDOL', condition: 'Top 8000', deadline: '24/07/2025 23:00:00', reward: 4750 },
    { id: 25, tokenName: 'AIN', condition: 'Top 9000', deadline: '24/07/2025 23:00:00', reward: 733 },
    { id: 26, tokenName: 'CROSS', condition: 'Top 11000', deadline: '24/07/2025 23:00:00', reward: 909 },
    { id: 27, tokenName: 'ECHO', condition: 'Top 5000', deadline: '24/07/2025 23:00:00', reward: 2000 },
];

export const alphaSoonData: AlphaSoon[] = [
    { id: 1, tokenName: 'G', type: 'AIRDROP2', date: '11/07/2025 15:00:00', reward: '', points: '' },
    { id: 2, tokenName: 'TALE', type: 'AIRDROP2', date: '11/07/2025 17:00:00', reward: '500', points: '190' },
]; 