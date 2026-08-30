import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAddresses, addAddress } from '../features/auth/authSlice';
import { createOrder } from '../features/orders/orderSlice';
import { createPayment, verifyPayment, resetPayment } from '../features/payment/paymentSlice';
import { fetchCart } from '../features/cart/cartSlice';
import { ErrorBanner } from '../components/Feedback';

const emptyAddress = { street: '', city: '', state: '', country: '', zip: '' };

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses } = useSelector((s) => s.auth);
  const { error: orderError } = useSelector((s) => s.orders);
  const { error: paymentError, status: paymentStatus } = useSelector((s) => s.payment);
  const [selected, setSelected] = useState(null);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [showNewForm, setShowNewForm] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(resetPayment());
  }, [dispatch]);

  async function handleAddAddress(e) {
    e.preventDefault();
    const res = await dispatch(addAddress({ addresses: [newAddress] }));
    if (res.meta.requestStatus === 'fulfilled') {
      setShowNewForm(false);
      setNewAddress(emptyAddress);
    }
  }

  async function handlePlaceOrder() {
    if (!selected) return;
    setPlacing(true);

    const orderRes = await dispatch(createOrder({ shippingAddress: selected }));
    if (orderRes.meta.requestStatus !== 'fulfilled') {
      setPlacing(false);
      return;
    }
    const order = orderRes.payload;

    const paymentRes = await dispatch(createPayment(order._id));
    if (paymentRes.meta.requestStatus !== 'fulfilled') {
      setPlacing(false);
      return;
    }
    const payment = paymentRes.payload;

    const ok = await loadRazorpayScript();
    if (!ok) {
      setPlacing(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: payment.price.amount,
      currency: payment.price.currency,
      order_id: payment.razorpayOrderId,
      name: 'VendEx',
      description: `Order #${order._id}`,
      handler: async (response) => {
        const verifyRes = await dispatch(
          verifyPayment({
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            razorpayOrderId: response.razorpay_order_id,
          })
        );
        setPlacing(false);
        if (verifyRes.meta.requestStatus === 'fulfilled') {
          dispatch(fetchCart());
          navigate(`/orders/${order._id}`);
        }
      },
      modal: {
        ondismiss: () => setPlacing(false),
      },
      theme: { color: '#22304A' },
    });
    rzp.open();
  }

  return (
    <div className="container-page py-10 max-w-xl mx-auto">
      <h1 className="font-display text-2xl font-bold">Checkout</h1>
      <ErrorBanner message={orderError} />
      <ErrorBanner message={paymentError} />

      <h2 className="font-display font-semibold mt-6 mb-2">Shipping address</h2>
      <div className="space-y-2">
        {addresses.map((addr) => (
          <label
            key={addr._id}
            className={`card p-3 flex items-start gap-3 cursor-pointer hover:border-pine-400 ${
              selected?._id === addr._id ? 'border-pine-600' : ''
            }`}
          >
            <input
              type="radio"
              name="address"
              className="mt-1"
              checked={selected?._id === addr._id}
              onChange={() => setSelected(addr)}
            />
            <span className="text-sm text-ink/70">
              {addr.street}, {addr.city}, {addr.state}, {addr.country} — {addr.zip}
            </span>
          </label>
        ))}
      </div>

      {!showNewForm ? (
        <button onClick={() => setShowNewForm(true)} className="btn btn-ghost mt-3 text-sm">
          + Add new address
        </button>
      ) : (
        <form onSubmit={handleAddAddress} className="card p-4 mt-3 space-y-2">
          {['street', 'city', 'state', 'country', 'zip'].map((field) => (
            <input
              key={field}
              required
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="input"
              value={newAddress[field]}
              onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
            />
          ))}
          <button type="submit" className="btn btn-primary w-full">
            Save address
          </button>
        </form>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={!selected || placing || paymentStatus === 'verifying'}
        className="btn btn-accent w-full mt-8"
      >
        {placing ? 'Processing…' : 'Place order & pay'}
      </button>
    </div>
  );
}
