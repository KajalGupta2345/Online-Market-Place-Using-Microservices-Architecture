import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../features/products/productSlice';
import { addItemToCart } from '../features/cart/cartSlice';
import { Loader, ErrorBanner } from '../components/Feedback';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, status, error } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  if (status === 'loading' || !current) return <Loader label="Loading product…" />;

  const images = current.images?.length ? current.images : [{ url: null }];

  async function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    setAdding(true);
    setMessage('');
    const res = await dispatch(addItemToCart({ productId: current._id, quantity: qty }));
    setAdding(false);
    setMessage(res.meta.requestStatus === 'fulfilled' ? 'Added to cart.' : 'Could not add to cart.');
  }

  return (
    <div className="container-page py-10">
      <ErrorBanner message={error} />
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-pine-50 rounded-lg overflow-hidden card p-6">
            {images[activeImg]?.url ? (
              <img
                src={images[activeImg].url}
                alt={current.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-pine-400 font-display">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 ${
                    activeImg === i ? 'border-pine-600' : 'border-line'
                  }`}
                >
                  {img.url && <img src={img.url} className="w-full h-full object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {current.category && <span className="eyebrow">{current.category}</span>}
          <h1 className="font-display text-3xl font-bold mt-2">{current.title}</h1>
          <p className="font-display text-2xl font-bold text-pine-600 mt-3">
            {current.price?.currency === 'USD' ? '$' : '₹'}
            {current.price?.amount}
          </p>
          <p className="text-ink/70 mt-4 leading-relaxed">{current.description}</p>

          <p className="text-sm text-ink/50 mt-3">
            {current.stock > 0 ? `${current.stock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <input
              type="number"
              min={1}
              max={current.stock || 1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="input w-20"
            />
            <button
              onClick={handleAddToCart}
              disabled={adding || current.stock === 0}
              className="btn btn-accent flex-1"
            >
              {adding ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
          {message && <p className="text-sm text-moss mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
}