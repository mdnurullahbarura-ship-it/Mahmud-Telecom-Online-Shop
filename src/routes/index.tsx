/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../admin/layout/AdminLayout';

// Loading Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Pages - Customer
const Home = lazy(() => import('../pages/Home'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Categories = lazy(() => import('../pages/Categories'));
const SearchResults = lazy(() => import('../pages/Search'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const OrderSuccess = lazy(() => import('../pages/Checkout/OrderSuccess'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const Account = lazy(() => import('../pages/Account'));
const MyOrders = lazy(() => import('../pages/Orders'));
const OrderDetails = lazy(() => import('../pages/Orders/OrderDetails'));
const Contact = lazy(() => import('../pages/Contact'));
const About = lazy(() => import('../pages/About'));
const LegalPage = lazy(() => import('../pages/Legal'));

// Pages - Admin
const AdminDashboard = lazy(() => import('../admin/pages/Dashboard'));
const AdminProducts = lazy(() => import('../admin/pages/Products'));
const AdminOrders = lazy(() => import('../admin/pages/Orders'));
const AdminCategories = lazy(() => import('../admin/pages/Categories'));
const AdminCustomers = lazy(() => import('../admin/pages/Customers'));
const AdminLegalPages = lazy(() => import('../admin/pages/LegalPages'));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuthStore();
  if (loading) return <LoadingFallback />;
  if (!user || !isAdmin()) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Customer Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Customer Routes */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="legal" element={<AdminLegalPages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
