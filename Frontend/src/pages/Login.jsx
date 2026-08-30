import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../features/auth/authSlice';
import { ErrorBanner } from '../components/Feedback';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((s) => s.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    // "username" field accepts username OR email; backend matches either.
    const payload = form.username.includes('@')
      ? { email: form.username, password: form.password }
      : { username: form.username, password: form.password };
    const res = await dispatch(loginUser(payload));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate(location.state?.from || '/');
    }
  }

  return (
    <div className="container-page py-16 max-w-sm mx-auto">
      <h1 className="font-display text-2xl font-bold">Log in</h1>
      <p className="text-sm text-ink/50 mt-1">Welcome back to VendEx.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <ErrorBanner message={error} />
        <div>
          <label className="text-sm font-medium">Username or email</label>
          <input
            required
            className="input mt-1"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            required
            type="password"
            className="input mt-1"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full">
          {status === 'loading' ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-6 text-center">
        New here?{' '}
        <Link to="/register" className="text-pine-600 font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}
