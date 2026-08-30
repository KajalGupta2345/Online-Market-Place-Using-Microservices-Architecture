import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../features/cart/cartSlice';
import { fetchProductById } from '../features/products/productSlice';
import { Loader, EmptyState, ErrorBanner } from '../components/Feedback';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, status, error } = useSelector((s) => s.cart);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Cart items only store productId + quantity, so hydrate display details client-side.
  useEffect(() => {
    (cart.items || []).forEach(async (item) => {
      if (productDetails[item.productId]) return;
      const res = await dispatch(fetchProductById(item.productId));
      if (res.meta.requestStatus === 'fulfilled') {
        setProductDetails((prev) => ({ ...prev, [item.productId]: res.payload }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.items]);

  if (status === 'loading' && !cart.items?.length) return <Loader label="Loading cart…" />;

  const items = cart.items || [];
  const total = items.reduce((sum, item) => {
    const p = productDetails[item.productId];
    return sum + (p ? p.price.amount * item.quantity : 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="Your cart is empty"
          subtitle="Add something from the catalogue to get started."
          action={
            <Link to="/" className="btn btn-primary">
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Your cart</h1>
          <button onClick={() => dispatch(clearCart())} className="btn btn-danger text-xs">
            Clear cart
          </button>
        </div>
        <ErrorBanner message={error} />
        {items.map((item) => {
          const p = productDetails[item.productId];
          return (
            <div key={item.productId} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-pine-50 rounded overflow-hidden shrink-0">
                {p?.images?.[0]?.url && (
                  <img src={p.images[0].url} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{p?.title || 'Loading…'}</p>
                <p className="text-sm text-ink/50">
                  {p ? `${p.price.currency === 'USD' ? '$' : '₹'}${p.price.amount}` : ''}
                </p>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  dispatch(updateCartItem({ productId: item.productId, quantity: Number(e.target.value) }))
                }
                className="input w-16"
              />
              <button
                onClick={() => dispatch(removeCartItem(item.productId))}
                className="text-rust text-sm font-medium"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="card p-5 h-fit sticky top-24">
        <h2 className="font-display font-semibold text-lg">Order summary</h2>
        <div className="flex justify-between text-sm mt-4 text-ink/70">
          <span>Items</span>
          <span>{items.length}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="btn btn-accent w-full mt-5">
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
