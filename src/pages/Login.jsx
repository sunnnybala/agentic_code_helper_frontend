import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/Auth/GoogleSignInButton';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const res = await login(username, password);
      if (res && res.success) {
        navigate('/solve');
      } else {
        setError(res?.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="page">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <GoogleSignInButton />
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}


