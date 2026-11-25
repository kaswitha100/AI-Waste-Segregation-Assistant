import React, { useState, useEffect } from 'react';
import { historyAPI } from '../services/api';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { getCategoryMeta } from '../utils/wasteCategories';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        search: searchQuery.trim() || undefined
      };
      const res = await historyAPI.getHistory(params);
      setHistory(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('[History Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this scan record?')) return;
    try {
      await historyAPI.deleteItem(id);
      fetchHistory();
    } catch (err) {
      console.error('[Delete Error]:', err);
    }
  };

  const handleFeedback = async (id, feedbackType) => {
    try {
      await historyAPI.submitFeedback(id, feedbackType);
      setHistory((prev) =>
        prev.map((item) => (item.id === id ? { ...item, feedback: feedbackType } : item))
      );
    } catch (err) {
      console.error('[Feedback Error]:', err);
    }
  };

  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Item Name', 'Category', 'Confidence', 'Bin Color', 'Timestamp'];
    const rows = history.map(item => [
      item.id,
      `"${item.item_name}"`,
      `"${item.category}"`,
      item.confidence,
      `"${item.disposal_guide?.bin_color || ''}"`,
      `"${item.timestamp}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `waste_segregation_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <History className="w-7 h-7 text-emerald-600" />
            <span>Classification History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, and audit your AI-assisted waste segregation records ({total} total scans)
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={history.length === 0}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Wet Waste', 'Recyclable Waste', 'Hazardous Waste', 'Dry Waste'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="w-full md:w-72 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search waste item name..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* History Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading history logs...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
          <History className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Classification Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filter or scan a new waste item using the AI camera.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {history.map((item) => {
            const meta = getCategoryMeta(item.category);
            const conf = Math.round(item.confidence * 100);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
              >
                {/* Header color accent */}
                <div 
                  className="h-2 w-full"
                  style={{ backgroundColor: meta.binColor }}
                />

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                      style={{ 
                        backgroundColor: `${meta.binColor}15`, 
                        color: meta.binColor 
                      }}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {conf}% Match
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                      {item.item_name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {item.disposal_guide?.primary_action || 'Segregate responsibly.'}
                    </p>
                  </div>

                  {item.notes && (
                    <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-500 italic border border-slate-100">
                      "{item.notes}"
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFeedback(item.id, 'accurate')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.feedback === 'accurate'
                          ? 'bg-emerald-100 text-emerald-700 font-bold'
                          : 'text-slate-400 hover:text-emerald-600'
                      }`}
                      title="Accurate prediction"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(item.id, 'inaccurate')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.feedback === 'inaccurate'
                          ? 'bg-red-100 text-red-700 font-bold'
                          : 'text-slate-400 hover:text-red-600'
                      }`}
                      title="Report inaccurate prediction"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-4 flex items-center justify-between border-t border-slate-200">
          <span className="text-xs font-medium text-slate-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HistoryPage;
