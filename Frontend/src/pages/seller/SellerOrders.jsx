import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerOrders } from '../../features/seller/sellerSlice';
import { Loader, EmptyState } from '../../components/Feedback';

export default function SellerOrders() {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((s) => s.seller);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  if (status === 'loading' && orders.length === 0) return <Loader label="Loading orders…" />;

  if (orders.length === 0) {
    return <EmptyState title="No orders yet" subtitle="Orders containing your products will show up here." />;
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div key={order._id} className="card p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order #{order._id.slice(-8)}</p>
            <span className="badge bg-pine-50 text-pine-600">{order.status}</span>
          </div>
          <div className="mt-2 space-y-1">
            {order.items?.map((item, i) => (
              <p key={i} className="text-sm text-ink/60">
                {item.quantity} × {item.price?.currency === 'USD' ? '$' : '₹'}
                {item.price?.amount}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
