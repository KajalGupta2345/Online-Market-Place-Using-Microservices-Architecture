import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../features/orders/orderSlice';
import { Loader, ErrorBanner } from '../components/Feedback';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, status, error } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (status === 'loading' || !current) return <Loader label="Loading order…" />;

  const canCancel = current.status === 'PENDING';

  return (
    <div className="container-page py-10 max-w-2xl mx-auto">
      <ErrorBanner message={error} />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Order #{current._id.slice(-8)}</h1>
        <span className="badge bg-pine-50 text-pine-600">{current.status}</span>
      </div>

      <div className="card p-5 mt-6 space-y-3">
        {current.items?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm border-b border-line pb-3 last:border-0 last:pb-0">
            <span>Product · {item.quantity} × {item.price?.currency === 'USD' ? '$' : '₹'}{item.price?.amount}</span>
            <span className="font-medium">
              {item.price?.currency === 'USD' ? '$' : '₹'}
              {item.price?.amount * item.quantity}
            </span>
          </div>
        ))}
        <div className="flex justify-between font-display font-bold text-lg pt-2">
          <span>Total</span>
          <span>
            {current.totalAmount?.currency === 'USD' ? '$' : '₹'}
            {current.totalAmount?.amount}
          </span>
        </div>
      </div>

      <div className="card p-5 mt-4">
        <h2 className="font-display font-semibold mb-2">Shipping address</h2>
        <p className="text-sm text-ink/70">
          {current.shippingAddress?.street}, {current.shippingAddress?.city},{' '}
          {current.shippingAddress?.state}, {current.shippingAddress?.country} —{' '}
          {current.shippingAddress?.zip}
        </p>
      </div>

      {canCancel && (
        <button onClick={() => dispatch(cancelOrder(current._id))} className="btn btn-danger mt-6">
          Cancel order
        </button>
      )}
    </div>
  );
}
