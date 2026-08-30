import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

const navLinkClass = ({ isActive }) =>
  `nav-link text-sm font-medium transition-colors ${
    isActive ? 'text-ink active' : 'text-ink/55 hover:text-ink'
  }`;

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.cart?.items?.length ?? 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate('/');
  }

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="container-page h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-8 h-8 rounded-sm bg-pine-600 text-paper font-display font-bold flex items-center justify-center text-sm transition-transform duration-200 group-hover:-rotate-6">
            Vx
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">VendEx</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            Browse
          </NavLink>
          {user?.role === 'seller' && (
            <NavLink to="/seller" className={navLinkClass}>
              Seller Studio
            </NavLink>
          )}
          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <Link to="/cart" className="relative btn-ghost btn px-3 py-2">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="text-sm font-medium text-ink/70 hover:text-ink hidden sm:inline">
                {user.fullname?.firstname || user.username}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
