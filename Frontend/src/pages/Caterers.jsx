import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchCaterers, searchCaterers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import CatererCard from '../components/CatererCard';
import CatererModal from '../components/CatererModal';
import PriceFilter from '../components/PriceFilter';

// ─── Quick-filter chips for common cuisine/type searches ──────────────────────
const QUICK_FILTERS = [
  'North Indian', 'South Indian', 'Chinese', 'Mughlai',
  'Jain', 'Veg', 'Non-Veg', 'Bengali', 'Continental'
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="rounded-xl glass p-5 animate-pulse flex flex-col gap-4">
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 rounded-lg bg-gray-200 bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded bg-gray-200 bg-gray-200 w-3/4" />
        <div className="h-3 rounded bg-gray-200 bg-gray-200 w-1/2" />
      </div>
    </div>
    <div className="h-px bg-gray-200 bg-gray-100" />
    <div className="flex justify-between">
      <div className="h-3 rounded bg-gray-200 bg-gray-200 w-24" />
      <div className="h-4 rounded bg-gray-200 bg-gray-200 w-16" />
    </div>
    <div className="flex gap-1.5">
      <div className="h-5 w-16 rounded-md bg-gray-200 bg-gray-200" />
      <div className="h-5 w-20 rounded-md bg-gray-200 bg-gray-200" />
    </div>
    <div className="h-9 mt-auto rounded-lg bg-gray-100 bg-gray-100" />
  </div>
);

// ─── Caterers Page ────────────────────────────────────────────────────────────
const Caterers = () => {
  const [allCaterers, setAllCaterers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [activeChip, setActiveChip] = useState(null);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'asc' | 'desc'
  const PAGE_SIZE = 8;

  const debounceRef = useRef(null);

  // Load all caterers on mount (for "no search" state)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCaterers();
        setAllCaterers(data);
        setResults(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to reach the server. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Debounced search — fires 350ms after typing stops
  const runSearch = useCallback(async (q, price, chip) => {
    const effectiveQ = chip ? chip : q;
    const hasFilters = effectiveQ.trim() || price !== Infinity;

    if (!hasFilters) {
      // Nothing to search — show all
      setResults(allCaterers);
      return;
    }

    setSearching(true);
    try {
      const data = await searchCaterers(effectiveQ, price === Infinity ? null : price);
      setResults(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  }, [allCaterers]);

  // Trigger debounced search whenever search, maxPrice, or activeChip changes
  useEffect(() => {
    if (loading) return; // don't search before initial load
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(search, maxPrice, activeChip);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search, maxPrice, activeChip, loading, runSearch]);

  const clearFilters = () => {
    setSearch('');
    setMaxPrice(Infinity);
    setActiveChip(null);
  };

  const handleChip = (chip) => {
    setActiveChip(prev => prev === chip ? null : chip);
    setPage(1);
    setSearch(''); // clear text search when chip is clicked
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    setActiveChip(null); // deactivate chip when typing
  };

  const hasFilters = search || maxPrice !== Infinity || activeChip;
  const isLoading = loading || searching;

  const totalResults = results.length;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalResults / PAGE_SIZE)),
    [totalResults]
  );

  const currentPage = Math.min(page, totalPages);

  const sortedResults = useMemo(() => {
    if (sortOrder === 'asc') {
      return [...results].sort((a, b) => (a.pricePerPlate ?? a.minPrice ?? 0) - (b.pricePerPlate ?? b.minPrice ?? 0));
    }
    if (sortOrder === 'desc') {
      return [...results].sort((a, b) => (b.pricePerPlate ?? b.minPrice ?? 0) - (a.pricePerPlate ?? a.minPrice ?? 0));
    }
    return results;
  }, [results, sortOrder]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedResults.slice(start, start + PAGE_SIZE);
  }, [sortedResults, currentPage]);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
    const listSection = document.getElementById('caterer-search');
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const buildPageNumbers = () => {
    const pages = [];
    const maxToShow = 5;
    if (totalPages <= maxToShow) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
      return pages;
    }
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    if (currentPage <= 3) {
      start = 1;
      end = maxToShow;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - (maxToShow - 1);
      end = totalPages;
    }
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 transition-colors">

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pb-20 lg:pb-24 bg-white overflow-hidden">
        
        {/* Top Decorative Amber Wave */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320" 
            className="block w-full h-[60px] sm:h-[80px] lg:h-[120px]" 
            preserveAspectRatio="none"
          >
            <path 
              fill="currentColor" 
              className="text-amber-500" 
              fillOpacity="1" 
              d="M0,224L48,229.3C96,235,192,245,288,250.7C384,256,480,256,576,250.7C672,245,768,235,864,208C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.08) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-amber-500/10 blur-[80px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center z-10 mt-8">
          <p className="inline-block bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 text-amber-600 text-[11px] font-bold tracking-widest uppercase mb-4 sm:mb-6 shadow-sm">
            🍽 &nbsp;Professional Catering Services
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-[1.15]">
            Find the Right Caterer<br />
            <span className="text-amber-500">for Every Occasion</span>
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto leading-relaxed">
            Search by name, city, area, cuisine, or even a specific dish then get a personalised quote in minutes.
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* ─── Search bar + price filter ─── */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search input - full width, prominent on laptop */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none">
              {searching ? (
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <input
              id="caterer-search"
              type="text"
              placeholder="Search by name, city, area, cuisine, dish…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input-field pl-10 sm:pl-12 pr-10 sm:pr-12 w-full h-12 sm:h-14 text-base"
            />
            {search && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-4 sm:right-5 flex items-center text-gray-600 hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            )}
          </div>
          <PriceFilter maxPrice={maxPrice} onChange={setMaxPrice} />
        </div>

        {/* ─── Quick-filter chips ─── */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-6 scrollbar-hide w-full max-w-full snap-x">
          {QUICK_FILTERS.map(chip => (
            <button
              key={chip}
              onClick={() => handleChip(chip)}
              className={`shrink-0 snap-start px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${activeChip === chip
                  ? 'bg-amber-400 text-gray-950 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-900'
                }`}
            >
              {chip}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="shrink-0 snap-start px-4 py-1.5 rounded-full text-xs font-semibold border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-150"
            >
              Clear all ×
            </button>
          )}
        </div>

        {/* Results meta */}
        {!isLoading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <p className="text-xs text-gray-600">
              <span className="text-gray-900 font-semibold">
                {totalResults}
              </span>
              {hasFilters
                ? ` result${totalResults !== 1 ? 's' : ''} found`
                : ` of ${allCaterers.length} caterers`}
              {totalResults > PAGE_SIZE && (
                <span className="text-gray-500 ml-2">
                  · Page {currentPage} of {totalPages}
                </span>
              )}
            </p>

            <div className="flex items-center gap-2">
              {activeChip && (
                <p className="text-xs text-amber-500 font-medium">Showing: {activeChip}</p>
              )}
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  id="price-sort"
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                  className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-full border border-gray-200 bg-white text-gray-700 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer transition-colors"
                >
                  <option value="default">Sort by price</option>
                  <option value="asc">Price: Low → High</option>
                  <option value="desc">Price: High → Low</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center max-w-md mx-auto">
            <p className="text-2xl mb-3">⚠️</p>
            <p className="text-sm font-semibold text-red-700 mb-1">Connection failed</p>
            <p className="text-xs text-red-600 mb-5">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary text-xs">
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoading
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton key={i} />)
                : totalResults === 0
                  ? (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-3xl mb-3">🔍</p>
                      <p className="text-sm font-semibold text-gray-500 mb-1">No results found</p>
                      <p className="text-xs text-gray-600 max-w-xs mx-auto">
                        {search
                          ? `No caterers matching "${search}" — try city, cuisine, or a dish name`
                          : activeChip
                            ? `No caterers found for "${activeChip}"`
                            : 'No caterers within your budget'}
                      </p>
                      {hasFilters && (
                        <button onClick={clearFilters} className="mt-4 btn-ghost text-xs">
                          Clear filters
                        </button>
                      )}
                    </div>
                  )
                  : paginatedResults.map((c) => (
                    <CatererCard
                      key={c.id || c._id}
                      caterer={c}
                      onViewDetails={setSelected}
                    />
                  ))
              }
            </div>

            {/* Pagination controls */}
            {!isLoading && totalResults > PAGE_SIZE && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {buildPageNumbers().map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${p === currentPage
                        ? 'bg-amber-400 text-gray-950 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Top Wave */}
      <div className="w-full overflow-hidden leading-none pointer-events-none -mb-1 relative z-10 rotate-180 mt-auto">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          className="block w-full h-[60px] sm:h-[100px] lg:h-[140px]" 
          preserveAspectRatio="none"
        >
          <path 
            fill="currentColor" 
            className="text-amber-500" 
            fillOpacity="1" 
            d="M0,224L48,229.3C96,235,192,245,288,250.7C384,256,480,256,576,250.7C672,245,768,235,864,208C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
      <footer className="pt-2 pb-8 bg-amber-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950 font-medium">
          <p className="text-xs">© 2026 CaterersNearMe. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* ── Modal ── */}
      {selected && (
        <CatererModal caterer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default Caterers;
