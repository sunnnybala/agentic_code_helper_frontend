import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Solve from './pages/Solve';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Shipping from './pages/Shipping';

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const hideNav = location.pathname === '/solve';
  return (
    <div className="app">
      {!hideNav && (
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/solve">Solve</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/signup">Signup</Link>}
          {user && <button onClick={logout}>Logout</button>}
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/solve" element={<Solve />} />
        </Route>
        <Route path="*" element={<Navigate to="/solve" replace />} />
      </Routes>
    </div>
  );
}


