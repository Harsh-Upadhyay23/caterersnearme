import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CatererAuthProvider } from './context/CatererAuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedCatererRoute from './components/ProtectedCatererRoute';

import Navbar from './components/Navbar';

const CartSidebar = lazy(() => import('./components/CartSidebar'));
const Caterers = lazy(() => import('./pages/Caterers'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Caterer Pages
const CatererLogin = lazy(() => import('./pages/caterer/CatererLogin'));
const CatererRegister = lazy(() => import('./pages/caterer/CatererRegister'));
const CatererDashboard = lazy(() => import('./pages/caterer/CatererDashboard'));
const CatererProfile = lazy(() => import('./pages/caterer/CatererProfile'));

function App() {
  return (
    <AuthProvider>
      <CatererAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <Suspense
              fallback={
                <div className="min-h-[60vh] flex items-center justify-center bg-[#0a0a0f]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500">Loading experience…</p>
                  </div>
                </div>
              }
            >
              <CartSidebar />
              <Routes>
                {/* User Routes */}
                <Route path="/" element={<Navigate to="/caterers" replace />} />
                <Route path="/caterers" element={<Caterers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />

                {/* Caterer Routes */}
                <Route path="/caterer/login" element={<CatererLogin />} />
                <Route path="/caterer/register" element={<CatererRegister />} />
                <Route path="/caterer/:slug" element={<CatererProfile />} />
                <Route 
                  path="/caterer/dashboard" 
                  element={
                    <ProtectedCatererRoute>
                      <CatererDashboard />
                    </ProtectedCatererRoute>
                  } 
                />

                {/* 404 Not Found */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-6xl font-black text-white/[0.06] mb-4">404</p>
                        <p className="text-sm text-gray-500 mb-4">Page not found</p>
                        <a href="/caterers" className="text-amber-400 text-sm hover:underline">← Back to caterers</a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </CatererAuthProvider>
    </AuthProvider>
  );
}

export default App;
