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
    // { id: 22, tokenName: 'OIK', condition: 'Top 5000', deadline: '22/07/2025 20:00:00', reward: 1000 },
    // { id: 23, tokenName: 'M', condition: 'Top 14000', deadline: '24/07/2025 23:00:00', reward: 357 },
    // { id: 24, tokenName: 'IDOL', condition: 'Top 8000', deadline: '24/07/2025 23:00:00', reward: 4750 },
    // { id: 25, tokenName: 'AIN', condition: 'Top 9000', deadline: '24/07/2025 23:00:00', reward: 733 },
    // { id: 26, tokenName: 'CROSS', condition: 'Top 11000', deadline: '24/07/2025 23:00:00', reward: 909 },
    // { id: 27, tokenName: 'ECHO', condition: 'Top 5000', deadline: '24/07/2025 23:00:00', reward: 2000 },
    { id: 28, tokenName: 'PEAQ', condition: 'Top 11000', deadline: '26/07/2025 14:00:00', reward: 955 },
    { id: 29, tokenName: 'SPA', condition: 'Top 9000', deadline: '27/07/2025 21:00:00', reward: 4900 },
    { id: 30, tokenName: 'UPTOP', condition: 'Top 5580', deadline: '03/08/2025 14:00:00', reward: 1700 },
    { id: 31, tokenName: 'SUNDOG', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 1111 },
    { id: 32, tokenName: 'NFT', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 155474173 },
    { id: 33, tokenName: 'PEPEONTRON', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 990 },
    { id: 34, tokenName: 'TRX', condition: 'Top 11300', deadline: '31/07/2025 23:00:00', reward: 230 },
];

export const alphaSoonData: AlphaSoon[] = [
    // { id: 1, tokenName: 'ERA', type: 'AIRDROP', date1: '17/07/2025 20:30:00', date2: '18/07/2025 14:30:00', reward: '150', point1: '224', point2: '140' },
    // { id: 3, tokenName: 'TAKER', type: 'AIRDROP2', date: '18/07/2025 17:00:00', reward: '1000', points: '165' },
    // { id: 4, tokenName: 'G', type: 'AIRDROP2', date: '18/07/2025 20:00:00', reward: '88000', points: '165' },
    // { id: 5, tokenName: 'ESPORTS', type: 'AIRDROP2', date: '19/07/2025 23:00:00', reward: '', points: '' },
    // { id: 6, tokenName: 'TA', type: 'AIRDROP2', date: '21/07/2025 14:00:00', reward: '', points: '' },
    // { id: 7, tokenName: 'ZKWASM', type: 'IDO', date: '22/07/2025 15:00:00', reward: '', points: '225' },
    // { id: 8, tokenName: 'ZALA', type: 'AIRDROP2', date: '22/07/2025 23:00:00', reward: '', points: '' },
    // { id: 9, tokenName: 'COA', type: 'AIRDROP2', date: '23/07/2025 23:00:00', reward: '', points: '' },
    // { id: 10, tokenName: 'ASP', type: 'AIRDROP2', date: '24/07/2025 23:00:00', reward: '', points: '' },
    // { id: 11, tokenName: 'LN', type: 'AIRDROP2', date: '25/07/2025 23:00:00', reward: '', points: '' },
    // { id: 12, tokenName: 'PHY', type: 'AIRDROP2', date: '26/07/2025 23:00:00', reward: '', points: '' },
    { id: 12, tokenName: 'DELABS', type: 'IDO', date: '28/07/2025 15:00:00', reward: '', points: '' },
    { id: 13, tokenName: 'TREE', type: 'AIRDROP2', date: '29/07/2025 23:00:00', reward: '', points: '' },
    { id: 14, tokenName: 'BTR', type: 'AIRDROP2', date: '', reward: '', points: '' },
]; 