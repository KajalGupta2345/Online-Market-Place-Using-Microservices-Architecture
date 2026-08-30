import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, roles }) {
  const { user, bootstrapped } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!bootstrapped) {
    return (
      <div className="container-page py-24 text-center text-ink/50 text-sm">Loading…</div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
