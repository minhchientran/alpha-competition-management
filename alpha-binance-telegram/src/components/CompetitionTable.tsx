import { useState, useCallback } from "react";
import { competitionsData } from "../data/competitions";
import CompetitionRow from "./CompetitionRow";
import Clock from "./Clock";

const CompetitionTable = () => {
    const [prizes, setPrizes] = useState<Record<number, number>>({});
    const [triggerFetch, setTriggerFetch] = useState(0);

    const handlePriceUpdate = useCallback((id: number, prize: number) => {
        setPrizes(prev => ({ ...prev, [id]: prize }));
    }, []);

    const totalPrize = Object.values(prizes)
        .filter(prize => Number.isFinite(prize))
        .reduce((sum, prize) => sum + prize, 0);

    const handleReload = () => {
        setTriggerFetch(prev => prev + 1);
    };

    return (
        <div>
            <div className="background-71">

                <h1 className="text-4xl text-center mb-4 font-bold">Alpha Competition</h1>
                <Clock />
            </div>
            <div className="flex items-center justify-between mb-2 border-b border-black pb-2">
                <div className="text-lg normal-prize">
                    <span>Tổng: </span>
                    <span className="font-bold">${totalPrize.toFixed(2)}</span>
                </div>
                <button
                    onClick={handleReload}
                    className="border border-gray-400 bg-gray-100 hover:bg-gray-200 text-black font-bold py-1 px-3 rounded"
                >
                    Làm mới
                </button>
            </div>

            <div className="mt-4">
                {competitionsData.map((comp) => (
                    <CompetitionRow
                        key={comp.id}
                        rowData={comp}
                        triggerFetch={triggerFetch}
                        onPriceUpdate={handlePriceUpdate}
                    />
                ))}
            </div>
        </div>
    );
};

export default CompetitionTable; 