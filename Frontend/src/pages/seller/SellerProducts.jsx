import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyProducts, deleteProduct } from '../../features/products/productSlice';
import { Loader, EmptyState } from '../../components/Feedback';

export default function SellerProducts() {
  const dispatch = useDispatch();
  const { myProducts, status } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  if (status === 'loading' && myProducts.length === 0) return <Loader label="Loading products…" />;

  if (myProducts.length === 0) {
    return (
      <EmptyState
        title="No products listed yet"
        subtitle="Add your first product to start selling."
        action={
          <Link to="/seller/products/new" className="btn btn-primary">
            Add product
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {myProducts.map((p) => (
        <div key={p._id} className="card p-3 flex items-center gap-3">
          <div className="w-14 h-14 bg-pine-50 rounded overflow-hidden shrink-0">
            {p.images?.[0]?.url && <img src={p.images[0].url} className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{p.title}</p>
            <p className="text-sm text-ink/50">
              {p.price?.currency === 'USD' ? '$' : '₹'}
              {p.price?.amount} · {p.stock} in stock
            </p>
          </div>
          <Link to={`/seller/products/${p._id}/edit`} className="btn btn-ghost text-xs">
            Edit
          </Link>
          <button onClick={() => dispatch(deleteProduct(p._id))} className="btn btn-danger text-xs">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
