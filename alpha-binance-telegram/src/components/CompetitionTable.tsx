import { useState, useCallback, useMemo, useEffect } from "react";
import { competitionsData } from "../data/competitions";
import CompetitionRow from "./CompetitionRow";
import Clock from "./Clock";
import { useDebounce } from "../hooks/useDebounce";

type SortField = 'deadline' | 'reward' | 'calculatedPrize' | null;
type SortDirection = 'asc' | 'desc';

const CompetitionTable = () => {
    const [prizes, setPrizes] = useState<Record<number, number>>({});
    const [triggerFetch, setTriggerFetch] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [hideExpired, setHideExpired] = useState(false);
    const [selectedTokens, setSelectedTokens] = useState<string[]>(() => {
        const stored = localStorage.getItem('selectedTokens');
        return stored ? JSON.parse(stored) : ['all'];
    });
    const [showTokenFilter, setShowTokenFilter] = useState(false);

    // Debounce search term with 300ms delay
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const handlePriceUpdate = useCallback((id: number, prize: number) => {
        setPrizes(prev => ({ ...prev, [id]: prize }));
    }, []);

    // Get unique token names for dropdown
    const tokenNames = useMemo(() => {
        const names = competitionsData.map(comp => comp.tokenName);
        return ['all', ...Array.from(new Set(names))];
    }, []);

    // Handle token selection/deselection
    const handleTokenSelection = (token: string) => {
        if (token === 'all') {
            // If "all" is selected, clear other selections
            setSelectedTokens(['all']);
        } else {
            setSelectedTokens(prev => {
                // Remove "all" if it was selected
                const withoutAll = prev.filter(t => t !== 'all');

                if (withoutAll.includes(token)) {
                    // Remove token if already selected
                    const newSelection = withoutAll.filter(t => t !== token);
                    // If no tokens selected, default to "all"
                    return newSelection.length > 0 ? newSelection : ['all'];
                } else {
                    // Add token to selection
                    return [...withoutAll, token];
                }
            });
        }
    };

    // Calculate total prize based on selected tokens
    const totalPrize = useMemo(() => {
        if (selectedTokens.includes('all')) {
            // Sum all prizes
            return Object.values(prizes)
                .filter(prize => Number.isFinite(prize))
                .reduce((sum, prize) => sum + prize, 0);
        } else {
            // Sum only prizes for selected tokens
            return competitionsData
                .filter(comp => selectedTokens.includes(comp.tokenName))
                .reduce((sum, comp) => {
                    const prize = prizes[comp.id];
                    return sum + (Number.isFinite(prize) ? prize : 0);
                }, 0);
        }
    }, [prizes, selectedTokens]);

    const handleReload = () => {
        setTriggerFetch(prev => prev + 1);
    };

    // Helper function to check if a competition is expired
    const isExpired = (deadline: string) => {
        const [datePart, timePart] = deadline.split(' ');
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
        const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
        const today = new Date();
        return deadlineDate < today;
    };

    // Filter competitions based on debounced search term and hide expired option
    const filteredCompetitions = useMemo(() => {
        let filtered = competitionsData;

        // Filter by search term
        if (debouncedSearchTerm.trim()) {
            filtered = filtered.filter(comp =>
                comp.tokenName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }

        // Filter out expired competitions if hideExpired is true
        if (hideExpired) {
            filtered = filtered.filter(comp => !isExpired(comp.deadline));
        }

        return filtered;
    }, [debouncedSearchTerm, hideExpired]);

    // Sort competitions
    const sortedCompetitions = useMemo(() => {
        if (!sortField) return filteredCompetitions;

        return [...filteredCompetitions].sort((a, b) => {
            let aValue: any, bValue: any;

            if (sortField === 'deadline') {
                // Convert deadline datetime string to Date for comparison
                // Parse datetime format: "DD/MM/YYYY HH:MM:SS"
                const parseDeadline = (deadline: string) => {
                    const [datePart, timePart] = deadline.split(' ');
                    const [day, month, year] = datePart.split('/').map(Number);
                    const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
                    return new Date(year, month - 1, day, hours, minutes, seconds);
                };

                aValue = parseDeadline(a.deadline);
                bValue = parseDeadline(b.deadline);
            } else if (sortField === 'reward') {
                aValue = a.reward;
                bValue = b.reward;
            } else if (sortField === 'calculatedPrize') {
                // Use the calculated prize values (price * reward)
                aValue = prizes[a.id] || 0;
                bValue = prizes[b.id] || 0;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredCompetitions, sortField, sortDirection, prizes]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    // Persist selectedTokens to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('selectedTokens', JSON.stringify(selectedTokens));
    }, [selectedTokens]);

    return (
        <div>
            <div className="background-71">
                <h1 className="text-4xl text-center mb-4 font-bold">Alpha Competition</h1>
                <Clock />
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-4 space-y-3">
                {/* Search Input */}
                <div className="relative wrapper-search-input">
                    <input
                        type="text"
                        placeholder="Tìm kiếm token..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="clear-search-input absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Sort Buttons */}
                <div className="flex wrapper-sort-buttons">
                    <button
                        onClick={() => handleSort('deadline')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors btn-deadline ${sortField === 'deadline'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Deadline {getSortIcon('deadline')}
                    </button>
                    <button
                        onClick={() => handleSort('calculatedPrize')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors btn-prize ${sortField === 'calculatedPrize'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Prize Value {getSortIcon('calculatedPrize')}
                    </button>
                </div>

                {/* Hide Expired Toggle */}
                <div className="flex justify-center hide-expired-button">
                    <button
                        onClick={() => setHideExpired(!hideExpired)}
                        className={`btn-hide-expired px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${hideExpired
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-gray-500 text-white border-gray-500'
                            }`}
                    >
                        {hideExpired ? '🔒 Ẩn hết hạn' : '👁️ Hiện tất cả'}
                    </button>
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-600 display-title">
                    Hiển thị {sortedCompetitions.length} / {competitionsData.length} kết quả
                </div>
            </div>

            <div className="flex items-center justify-between mb-2 border-b border-black pb-2">
                <div className="text-lg normal-prize">
                    <span>
                        {selectedTokens.includes('all')
                            ? 'Tổng: '
                            : selectedTokens.length === 1
                                ? `Tổng ${selectedTokens[0]}: `
                                : selectedTokens.length <= 3
                                    ? `Tổng (${selectedTokens.join(', ')}): `
                                    : `Tổng (${selectedTokens.length} tokens): `
                        }
                    </span>
                    <span className="font-bold">${totalPrize.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowTokenFilter(!showTokenFilter)}
                        className="token-filter-toggle-btn"
                        title="Toggle token filter"
                    >
                        {showTokenFilter ? '▼' : '▲'}
                    </button>
                    <button
                        onClick={handleReload}
                        className="btn-refresh"
                    >
                        ⟳
                    </button>
                </div>
            </div>

            {/* Collapsible Token Filter */}
            {showTokenFilter && (
                <div className="token-filter-section mb-4">
                    <div className="token-filter-container">
                        <div className="token-filter-header">
                            <span>
                                Chọn tokens:
                                {!selectedTokens.includes('all') && (
                                    <span className="selected-count"> ({selectedTokens.length})</span>
                                )}
                            </span>
                            <button
                                onClick={() => setSelectedTokens(['all'])}
                                className="select-all-btn"
                            >
                                Chọn tất cả
                            </button>
                        </div>
                        <div className="token-filter-options">
                            {tokenNames.map((token) => (
                                <label key={token} className="token-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedTokens.includes(token)}
                                        onChange={() => handleTokenSelection(token)}
                                        className="token-checkbox"
                                    />
                                    <span className="token-label">
                                        {token === 'all' ? 'Tất cả tokens' : token}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4">
                {sortedCompetitions.length > 0 ? (
                    sortedCompetitions.map((comp) => (
                        <CompetitionRow
                            key={comp.id}
                            rowData={comp}
                            triggerFetch={triggerFetch}
                            onPriceUpdate={handlePriceUpdate}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy token nào phù hợp
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionTable; 