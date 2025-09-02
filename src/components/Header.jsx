import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from './Auth/GoogleSignInButton';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide header on the main Solve page to avoid duplicate nav and auth UI
  if (location.pathname === '/solve') return null;

  return (
    <header className="site-header">
      <div className="nav">
        <div className="nav-left">
          <h1>Code Turtle</h1>
        </div>

        <div className="nav-right">
          {!user ? (
            <div className="auth-links">
              <Link to="/login" className="btn-link">Login</Link>
              <Link to="/signup" className="btn-link btn-secondary">Sign up</Link>
              <GoogleSignInButton />
            </div>
          ) : (
            <div className="auth-links">
              <GoogleSignInButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


