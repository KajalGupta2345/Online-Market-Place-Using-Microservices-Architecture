import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../features/auth/authSlice';
import { ErrorBanner } from '../components/Feedback';

const initialForm = {
  username: '',
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  role: 'user',
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      fullname: { firstname: form.firstname, lastname: form.lastname },
      role: form.role,
    };
    const res = await dispatch(registerUser(payload));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  }

  return (
    <div className="container-page py-16 max-w-sm mx-auto">
      <h1 className="font-display text-2xl font-bold">Create an account</h1>
      <p className="text-sm text-ink/50 mt-1">Buy as a shopper or sell as a seller.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <ErrorBanner message={error} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">First name</label>
            <input required className="input mt-1" value={form.firstname} onChange={update('firstname')} />
          </div>
          <div>
            <label className="text-sm font-medium">Last name</label>
            <input required className="input mt-1" value={form.lastname} onChange={update('lastname')} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Username</label>
          <input required minLength={3} className="input mt-1" value={form.username} onChange={update('username')} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input required type="email" className="input mt-1" value={form.email} onChange={update('email')} />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            required
            minLength={6}
            type="password"
            className="input mt-1"
            value={form.password}
            onChange={update('password')}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Account type</label>
          <select className="input mt-1" value={form.role} onChange={update('role')}>
            <option value="user">Shopper</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full">
          {status === 'loading' ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-6 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-pine-600 font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
