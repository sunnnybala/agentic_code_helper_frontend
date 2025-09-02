import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SignupForm() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) return setError('Username is required');
    if (username.length < 3) return setError('Username must be at least 3 characters');
    if (!password) return setError('Password is required');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    try {
      const res = await register(username, password, email || undefined);
      if (!res.success) setError(res.error || 'Signup failed');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)" />
      <button type="submit">Sign up</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}


