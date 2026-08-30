import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import { Loader, EmptyState } from '../components/Feedback';

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.products);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filtered = search
    ? items.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div>
      <section className="border-b border-line bg-pine-600 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #F1F3EC 0px, #F1F3EC 1px, transparent 1px, transparent 64px)',
          }}
        />
        <div className="container-page pt-16  relative">
          <span className="eyebrow text-gold-400 inline-flex items-center gap-2 border border-gold-400/30 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            stall directory · open now
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-semibold text-paper mt-5 max-w-2xl leading-[1.08]">
            Every shop here is run by someone, not a warehouse.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed" style={{ color: '#C6D3CE' }}>
            VendEx is a stretch of independent stalls under one roof. Browse
            what each seller has put out today, add it to your basket, and
            check out once — no matter how many stalls you visited.
          </p>
          <div className="mt-8 mb-2 max-w-md relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink/40 pointer-events-none z-10"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the stalls…"
              className="input !pl-12 py-3.5 text-[15px] shadow-lift border-transparent focus:shadow-none"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="eyebrow">
            {search ? `Results for "${search}"` : 'On the stalls today'}
          </h2>
          {status === 'succeeded' && (
            <span className="font-mono text-xs text-ink/40">{filtered.length} items</span>
          )}
        </div>
        {status === 'loading' && <Loader label="Setting out the stalls…" />}
        {status === 'succeeded' && filtered.length === 0 && (
          <EmptyState title="No stalls match that" subtitle="Try a different search term." />
        )}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}