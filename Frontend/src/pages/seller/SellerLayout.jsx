import { NavLink, Outlet } from 'react-router-dom';

const tabClass = ({ isActive }) =>
  `px-4 py-2 rounded text-sm font-medium ${
    isActive ? 'bg-pine-600 text-paper' : 'text-ink/60 hover:bg-pine-50'
  }`;

export default function SellerLayout() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl font-bold mb-6">Seller Studio</h1>
      <div className="flex gap-2 border-b border-line pb-3 mb-6 flex-wrap">
        <NavLink to="/seller" end className={tabClass}>
          Overview
        </NavLink>
        <NavLink to="/seller/products" className={tabClass}>
          Products
        </NavLink>
        <NavLink to="/seller/products/new" className={tabClass}>
          Add product
        </NavLink>
        <NavLink to="/seller/orders" className={tabClass}>
          Orders
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
