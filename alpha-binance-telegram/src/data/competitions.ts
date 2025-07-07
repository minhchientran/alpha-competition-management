export interface Competition {
    id: number;
    tokenName: string;
    condition: string;
    deadline: string;
    reward: number;
}

export const competitionsData: Competition[] = [
    { id: 14, tokenName: 'AVAIL', condition: 'Top 12500', deadline: '04/07/2025 14:00:00', reward: 2600 },
    { id: 16, tokenName: 'BULLA', condition: 'Top 11700', deadline: '06/07/2025 17:00:00', reward: 1000 },
    { id: 17, tokenName: 'CARV', condition: 'Top 8300', deadline: '07/07/2025 14:00:00', reward: 360 },
    { id: 18, tokenName: 'REKT', condition: 'Top 12500', deadline: '12/07/2025 20:00:00', reward: 277800000, },
    { id: 19, tokenName: 'FUEL', condition: 'Top 9000', deadline: '13/07/2025 20:00:00', reward: 11000 },
    { id: 20, tokenName: 'BGSC', condition: 'Top 12500', deadline: '15/07/2025 15:30:00', reward: 10900 },
    { id: 21, tokenName: 'MPLX', condition: 'Top 12500', deadline: '20/07/2025 20:00:00', reward: 713 },
]; 