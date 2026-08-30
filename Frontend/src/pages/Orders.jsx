import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../features/orders/orderSlice';
import { Loader, EmptyState } from '../components/Feedback';

const statusColors = {
  PENDING: 'bg-gold-50 text-gold-600',
  CONFIRMED: 'bg-pine-50 text-pine-600',
  SHIPPED: 'bg-pine-50 text-pine-600',
  DELIEVERED: 'bg-moss/10 text-moss',
  CANCELLED: 'bg-rust/10 text-rust',
};

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, status } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (status === 'loading') return <Loader label="Loading orders…" />;

  if (orders.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState title="No orders yet" subtitle="Once you place an order, it'll show up here." />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-bold mb-6">Your orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Order #{order._id.slice(-8)}</p>
              <p className="text-sm text-ink/50">
                {order.items?.length} item(s) · {order.totalAmount?.currency === 'USD' ? '$' : '₹'}
                {order.totalAmount?.amount}
              </p>
            </div>
            <span className={`badge ${statusColors[order.status] || 'bg-line text-ink/60'}`}>
              {order.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
