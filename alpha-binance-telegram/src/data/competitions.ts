export interface Competition {
    id: number;
    tokenName: string;
    condition: string;
    deadline: string;
    reward: number;
}

export const competitionsData: Competition[] = [
    { id: 12, tokenName: 'ROAM', condition: 'Top 12300', deadline: '27/06/2025 20:00:00', reward: 400 },
    { id: 13, tokenName: 'VELO', condition: 'Top 12500', deadline: '30/06/2025 14:00:00', reward: 6100 },
    { id: 14, tokenName: 'AVAIL', condition: 'Top 12500', deadline: '04/07/2025 14:00:00', reward: 2600 },
    { id: 15, tokenName: 'F', condition: 'Top 6940', deadline: '29/06/2025 15:00:00', reward: 7100 },
    { id: 16, tokenName: 'BULLA', condition: 'Top 6940', deadline: '06/07/2025 17:00:00', reward: 1000 },
    { id: 17, tokenName: 'CARV', condition: 'Top 8300', deadline: '07/07/2025 14:00:00', reward: 360 },
    { id: 18, tokenName: 'REKT', condition: 'Top 12500', deadline: '12/07/2025 20:00:00', reward: 277800000, },
    { id: 19, tokenName: 'FUEL', condition: 'Top 9000', deadline: '13/07/2025 20:00:00', reward: 11000 },
]; 