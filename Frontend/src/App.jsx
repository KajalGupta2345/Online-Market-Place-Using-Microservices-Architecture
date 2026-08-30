import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './features/auth/authSlice';
import { fetchCart } from './features/cart/cartSlice';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIBuddyWidget from './features/aiBuddy/AIBuddyWidget';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';

import SellerLayout from './pages/seller/SellerLayout';
import SellerOverview from './pages/seller/SellerOverview';
import SellerProducts from './pages/seller/SellerProducts';
import ProductForm from './pages/seller/ProductForm';
import SellerOrders from './pages/seller/SellerOrders';

export default function App() {
  const dispatch = useDispatch();
  const { user, bootstrapped } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller"
            element={
              <ProtectedRoute roles={['seller']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SellerOverview />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<SellerOrders />} />
          </Route>

          <Route
            path="*"
            element={
              <div className="container-page py-24 text-center">
                <p className="font-display text-2xl font-bold">Page not found</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      {bootstrapped && <AIBuddyWidget />}
    </div>
  );
}
