import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, addAddress, deleteAddress } from '../features/auth/authSlice';
import { ErrorBanner } from '../components/Feedback';

const emptyAddress = { street: '', city: '', state: '', country: '', zip: '' };

export default function Profile() {
  const dispatch = useDispatch();
  const { user, addresses, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState(emptyAddress);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  async function handleAdd(e) {
    e.preventDefault();
    const res = await dispatch(addAddress({ addresses: [form] }));
    if (res.meta.requestStatus === 'fulfilled') {
      setForm(emptyAddress);
      setShowForm(false);
    }
  }

  return (
    <div className="container-page py-10 max-w-xl mx-auto">
      <h1 className="font-display text-2xl font-bold">Your profile</h1>
      <div className="card p-5 mt-4">
        <p className="text-sm text-ink/50">Name</p>
        <p className="font-medium">
          {user?.fullname?.firstname} {user?.fullname?.lastname}
        </p>
        <p className="text-sm text-ink/50 mt-3">Username</p>
        <p className="font-medium">{user?.username}</p>
        <p className="text-sm text-ink/50 mt-3">Email</p>
        <p className="font-medium">{user?.email}</p>
        <p className="text-sm text-ink/50 mt-3">Account type</p>
        <span className="badge bg-pine-50 text-pine-600 mt-1">{user?.role}</span>
      </div>

      <h2 className="font-display text-lg font-semibold mt-8 mb-2">Saved addresses</h2>
      <ErrorBanner message={error} />
      <div className="space-y-2">
        {addresses.map((addr) => (
          <div key={addr._id} className="card p-3 flex items-start justify-between gap-3">
            <span className="text-sm text-ink/70">
              {addr.street}, {addr.city}, {addr.state}, {addr.country} — {addr.zip}
            </span>
            <button
              onClick={() => dispatch(deleteAddress(addr._id))}
              className="text-rust text-xs font-medium shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
        {addresses.length === 0 && <p className="text-sm text-ink/50">No saved addresses yet.</p>}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn btn-ghost mt-3 text-sm">
          + Add address
        </button>
      ) : (
        <form onSubmit={handleAdd} className="card p-4 mt-3 space-y-2">
          {['street', 'city', 'state', 'country', 'zip'].map((field) => (
            <input
              key={field}
              required
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="input"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
          <button type="submit" className="btn btn-primary w-full">
            Save address
          </button>
        </form>
      )}
    </div>
  );
}
