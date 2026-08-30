import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerMetrics } from '../../features/seller/sellerSlice';
import { Loader } from '../../components/Feedback';

export default function SellerOverview() {
  const dispatch = useDispatch();
  const { metrics, status } = useSelector((s) => s.seller);

  useEffect(() => {
    dispatch(fetchSellerMetrics());
  }, [dispatch]);

  if (status === 'loading' && !metrics) return <Loader label="Loading metrics…" />;
  if (!metrics) return null;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="eyebrow">Units sold</p>
          <p className="font-display text-3xl font-bold mt-2">{metrics.sales}</p>
        </div>
        <div className="card p-5">
          <p className="eyebrow">Revenue</p>
          <p className="font-display text-3xl font-bold mt-2">₹{metrics.revenue}</p>
        </div>
      </div>

      <h2 className="font-display font-semibold text-lg mt-8 mb-3">Top products</h2>
      <div className="space-y-2">
        {metrics.topProducts?.length ? (
          metrics.topProducts.map((p) => (
            <div key={p.id} className="card p-3 flex items-center justify-between">
              <span className="text-sm font-medium">{p.title}</span>
              <span className="badge bg-gold-50 text-gold-600">{p.sold} sold</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-ink/50">No sales yet.</p>
        )}
      </div>
    </div>
  );
}
