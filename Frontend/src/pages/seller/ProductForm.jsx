import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  updateProduct,
  fetchProductById,
  clearCurrentProduct,
} from '../../features/products/productSlice';
import { ErrorBanner, Loader } from '../../components/Feedback';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, error } = useSelector((s) => s.products);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    category: '',
    stock: '',
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) dispatch(fetchProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        title: current.title || '',
        description: current.description || '',
        priceAmount: current.price?.amount ?? '',
        priceCurrency: current.price?.currency || 'INR',
        category: current.category || '',
        stock: current.stock ?? '',
      });
    }
  }, [isEdit, current]);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('priceAmount', form.priceAmount);
    fd.append('priceCurrency', form.priceCurrency);
    if (form.category) fd.append('category', form.category);
    // stock is only accepted on update (create defaults it to 0 server-side)
    if (isEdit && form.stock !== '') fd.append('stock', form.stock);
    files.forEach((file) => fd.append('images', file));

    const action = isEdit
      ? updateProduct({ id, formData: fd })
      : createProduct(fd);

    const res = await dispatch(action);
    setSubmitting(false);
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/seller/products');
    }
  }

  if (isEdit && !current) return <Loader label="Loading product…" />;

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-xl font-semibold mb-4">
        {isEdit ? 'Edit product' : 'Add product'}
      </h2>
      <ErrorBanner message={error} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input required className="input mt-1" value={form.title} onChange={update('title')} />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            maxLength={500}
            rows={4}
            className="input mt-1"
            value={form.description}
            onChange={update('description')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Price</label>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              className="input mt-1"
              value={form.priceAmount}
              onChange={update('priceAmount')}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Currency</label>
            <select className="input mt-1" value={form.priceCurrency} onChange={update('priceCurrency')}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <input className="input mt-1" value={form.category} onChange={update('category')} />
        </div>
        {isEdit && (
          <div>
            <label className="text-sm font-medium">Stock</label>
            <input
              type="number"
              min="0"
              className="input mt-1"
              value={form.stock}
              onChange={update('stock')}
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="input mt-1"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          {isEdit && (
            <p className="text-xs text-ink/50 mt-1">
              Uploading new images here will replace all existing ones.
            </p>
          )}
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary w-full">
          {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish product'}
        </button>
      </form>
    </div>
  );
}
