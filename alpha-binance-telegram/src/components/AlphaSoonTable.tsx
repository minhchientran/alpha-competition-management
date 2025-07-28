import { useState, useMemo, useEffect } from "react";
import { alphaSoonData } from "../data/competitions";
import AlphaSoonRow from "./AlphaSoonRow";
import Clock from "./Clock";
import { useDebounce } from "../hooks/useDebounce";

type SortField = 'date' | 'type' | null;
type SortDirection = 'asc' | 'desc';

const AlphaSoonTable = () => {
    const [searchTerm, setSearchTerm] = useState(() => {
        const stored = localStorage.getItem('alphaSoon_searchTerm');
        return stored || '';
    });
    const [sortField, setSortField] = useState<SortField>(() => {
        const stored = localStorage.getItem('alphaSoon_sortField');
        return stored === 'date' || stored === 'type' ? stored : null;
    });
    const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
        const stored = localStorage.getItem('alphaSoon_sortDirection');
        return stored === 'desc' ? 'desc' : 'asc';
    });
    const [hideExpired, setHideExpired] = useState(() => {
        const stored = localStorage.getItem('alphaSoon_hideExpired');
        return stored === 'true';
    });
    const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
        const stored = localStorage.getItem('alphaSoon_selectedTypes');
        return stored ? JSON.parse(stored) : ['all'];
    });
    const [showTypeFilter, setShowTypeFilter] = useState(() => {
        const stored = localStorage.getItem('alphaSoon_showTypeFilter');
        return stored === 'true';
    });

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('alphaSoon_searchTerm', searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        localStorage.setItem('alphaSoon_sortField', sortField || '');
    }, [sortField]);

    useEffect(() => {
        localStorage.setItem('alphaSoon_sortDirection', sortDirection);
    }, [sortDirection]);

    useEffect(() => {
        localStorage.setItem('alphaSoon_hideExpired', hideExpired.toString());
    }, [hideExpired]);

    useEffect(() => {
        localStorage.setItem('alphaSoon_selectedTypes', JSON.stringify(selectedTypes));
    }, [selectedTypes]);

    useEffect(() => {
        localStorage.setItem('alphaSoon_showTypeFilter', showTypeFilter.toString());
    }, [showTypeFilter]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(alphaSoonData.map(item => item.type)));
        return ['all', ...uniqueTypes];
    }, []);

    const handleTypeSelection = (type: string) => {
        if (type === 'all') {
            setSelectedTypes(['all']);
        } else {
            setSelectedTypes(prev => {
                const withoutAll = prev.filter(t => t !== 'all');
                if (withoutAll.includes(type)) {
                    const newSelection = withoutAll.filter(t => t !== type);
                    return newSelection.length > 0 ? newSelection : ['all'];
                } else {
                    return [...withoutAll, type];
                }
            });
        }
    };

    const totalCount = useMemo(() => {
        if (selectedTypes.includes('all')) {
            return alphaSoonData.length;
        } else {
            return alphaSoonData
                .filter(item => selectedTypes.includes(item.type))
                .length;
        }
    }, [selectedTypes]);

    const isExpired = (item: any) => {
        if (item.type === 'IDO' && item.date) {
            const [datePart, timePart] = item.date.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
            const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
            const today = new Date();
            return deadlineDate < today;
        } else if (item.type === 'AIRDROP' && item.date2) {
            const [datePart, timePart] = item.date2.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
            const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
            const today = new Date();
            return deadlineDate < today;
        } else if (item.type === 'AIRDROP2' && item.date) {
            const [datePart, timePart] = item.date.split(' ');
            const [day, month, year] = datePart.split('/').map(Number);
            const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
            const deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
            const today = new Date();
            return deadlineDate < today;
        }
        return false;
    };

    const filteredItems = useMemo(() => {
        let filtered = alphaSoonData;

        if (debouncedSearchTerm.trim()) {
            filtered = filtered.filter(item =>
                item.tokenName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }

        if (hideExpired) {
            filtered = filtered.filter(item => !isExpired(item));
        }

        return filtered;
    }, [debouncedSearchTerm, hideExpired]);

    const sortedItems = useMemo(() => {
        if (!sortField) return filteredItems;

        return [...filteredItems].sort((a, b) => {
            let aValue: any, bValue: any;

            if (sortField === 'date') {
                const getDate = (item: any) => {
                    if (item.type === 'IDO') return item.date;
                    if (item.type === 'AIRDROP') return item.date2;
                    if (item.type === 'AIRDROP2') return item.date;
                    return '';
                };

                const parseDate = (dateStr: string) => {
                    if (!dateStr) return new Date(0);
                    const [datePart, timePart] = dateStr.split(' ');
                    const [day, month, year] = datePart.split('/').map(Number);
                    const [hours, minutes, seconds] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
                    return new Date(year, month - 1, day, hours, minutes, seconds);
                };

                aValue = parseDate(getDate(a));
                bValue = parseDate(getDate(b));
            } else if (sortField === 'type') {
                aValue = a.type;
                bValue = b.type;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredItems, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return '↕';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div>
            <div className="background-71">
                <h1 className="text-4xl text-center mb-4 font-bold">Alpha Upcoming</h1>
                <Clock />
            </div>

            <div className="mb-4 space-y-3">
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

                <div className="flex wrapper-sort-buttons">
                    <button
                        onClick={() => handleSort('date')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors btn-deadline ${sortField === 'date'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Ngày {getSortIcon('date')}
                    </button>
                    <button
                        onClick={() => handleSort('type')}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors btn-percentage ${sortField === 'type'
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Loại {getSortIcon('type')}
                    </button>
                </div>

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

                <div className="text-sm text-gray-600 display-title">
                    Hiển thị {sortedItems.length} / {alphaSoonData.length} kết quả
                </div>
            </div>

            <div className="flex items-center justify-between mb-2 border-b border-black pb-2">
                <div className="text-lg normal-prize">
                    <span>
                        {selectedTypes.includes('all')
                            ? 'Tổng: '
                            : selectedTypes.length === 1
                                ? `Tổng ${selectedTypes[0]}: `
                                : selectedTypes.length <= 3
                                    ? `Tổng (${selectedTypes.join(', ')}): `
                                    : `Tổng (${selectedTypes.length} loại): `
                        }
                    </span>
                    <span className="font-bold">{totalCount} kèo</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowTypeFilter(!showTypeFilter)}
                        className="token-filter-toggle-btn"
                        title="Toggle type filter"
                    >
                        {showTypeFilter ? '▼' : '▲'}
                    </button>
                </div>
            </div>

            {showTypeFilter && (
                <div className="token-filter-section mb-4">
                    <div className="token-filter-container">
                        <div className="token-filter-header">
                            <span>
                                Chọn loại:
                                {!selectedTypes.includes('all') && (
                                    <span className="selected-count"> ({selectedTypes.length})</span>
                                )}
                            </span>
                            <button
                                onClick={() => setSelectedTypes(['all'])}
                                className="select-all-btn"
                            >
                                Chọn tất cả
                            </button>
                        </div>
                        <div className="token-filter-options">
                            {types.map((type) => (
                                <label key={type} className="token-option">
                                    <input
                                        type="checkbox"
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleTypeSelection(type)}
                                        className="token-checkbox"
                                    />
                                    <span className="token-label">
                                        {type === 'all' ? 'Tất cả loại' : type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4">
                {sortedItems.length > 0 ? (
                    sortedItems.map((item) => (
                        <AlphaSoonRow
                            key={item.id}
                            rowData={item}
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

export default AlphaSoonTable; 