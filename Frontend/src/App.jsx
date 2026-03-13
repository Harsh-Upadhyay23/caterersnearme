import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CatererAuthProvider } from './context/CatererAuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedCatererRoute from './components/ProtectedCatererRoute';

import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Caterers from './pages/Caterers';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Caterer Pages
import CatererLogin from './pages/caterer/CatererLogin';
import CatererRegister from './pages/caterer/CatererRegister';
import CatererDashboard from './pages/caterer/CatererDashboard';
import CatererProfile from './pages/caterer/CatererProfile';

function App() {
  return (
    <AuthProvider>
      <CatererAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
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
          </BrowserRouter>
        </CartProvider>
      </CatererAuthProvider>
    </AuthProvider>
  );
}

export default App;
