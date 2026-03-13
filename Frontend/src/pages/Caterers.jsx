import { useState, useEffect, useMemo } from 'react';
import { fetchCaterers } from '../services/api';
import CatererCard from '../components/CatererCard';
import CatererModal from '../components/CatererModal';
import SearchBar from '../components/SearchBar';
import PriceFilter from '../components/PriceFilter';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="rounded-xl glass p-5 animate-pulse flex flex-col gap-4">
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 rounded-lg bg-white/[0.06]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded bg-white/[0.06] w-3/4" />
        <div className="h-3 rounded bg-white/[0.06] w-1/2" />
      </div>
    </div>
    <div className="h-px bg-white/[0.04]" />
    <div className="flex justify-between">
      <div className="h-3 rounded bg-white/[0.06] w-24" />
      <div className="h-4 rounded bg-white/[0.06] w-16" />
    </div>
    <div className="flex gap-1.5">
      <div className="h-5 w-16 rounded-md bg-white/[0.06]" />
      <div className="h-5 w-20 rounded-md bg-white/[0.06]" />
    </div>
    <div className="h-9 mt-auto rounded-lg bg-white/[0.04]" />
  </div>
);

// ─── Caterers Page ────────────────────────────────────────────────────────────
const Caterers = () => {
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selected, setSelected] = useState(null); // for modal

  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError(null);
        const data = await fetchCaterers();
        setCaterers(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to reach the server. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() =>
    caterers.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase().trim());
      const cPrice = c.pricePerPlate || 0;
      const matchesPrice = maxPrice === Infinity || cPrice <= maxPrice;
      return matchesSearch && matchesPrice;
    }), [caterers, search, maxPrice]);

  const clearFilters = () => { setSearch(''); setMaxPrice(Infinity); };
  const hasFilters = search || maxPrice !== Infinity;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0f' }}>

      {/* ── Hero ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-14 pb-12 border-b border-white/[0.05] overflow-hidden">
        {/* subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        {/* amber glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-amber-500/10 blur-[80px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="section-label mb-4">🍽 &nbsp;Professional Catering Services</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-[1.15]">
            Find the Right Caterer<br />
            <span className="text-amber-400">for Every Occasion</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            Compare top-rated caterers across India. Filter by cuisine, budget, and location — then get a personalised quote in minutes.
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1"><SearchBar value={search} onChange={setSearch} /></div>
          <PriceFilter maxPrice={maxPrice} onChange={setMaxPrice} />
        </div>

        {/* Results meta */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs text-gray-600">
              <span className="text-white font-semibold">{filtered.length}</span> of {caterers.length} caterers
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                Clear filters ×
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-6 py-10 text-center max-w-md mx-auto">
            <p className="text-2xl mb-3">⚠️</p>
            <p className="text-sm font-semibold text-red-300 mb-1">Connection failed</p>
            <p className="text-xs text-red-400/70 mb-5">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary text-xs">
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
              : filtered.length === 0
              ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-3xl mb-3">🔍</p>
                  <p className="text-sm font-semibold text-gray-400 mb-1">No results found</p>
                  <p className="text-xs text-gray-600">
                    {search ? `No caterers matching "${search}"` : `No caterers under your budget`}
                  </p>
                  {hasFilters && (
                    <button onClick={clearFilters} className="mt-4 btn-ghost text-xs">
                      Clear filters
                    </button>
                  )}
                </div>
              )
              : filtered.map((c) => (
                  <CatererCard
                    key={c.id || c._id}
                    caterer={c}
                    onViewDetails={setSelected}
                  />
                ))
            }
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-700">© 2026 CaterersNearMe. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-700">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
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
