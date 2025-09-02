import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (email && !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const res = await register(username, password, email || undefined);
      if (res.success) {
        navigate('/solve');
      } else {
        setError(res.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || err.response?.data?.details || 'An unexpected error occurred');
    }
  };

  return (
    <div className="page">
      <h2>Sign up</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)" />
        <button type="submit">Create account</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}


