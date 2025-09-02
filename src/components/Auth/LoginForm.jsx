import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) return setError('Username is required');
    if (!password) return setError('Password is required');
    try {
      const res = await login(username, password);
      if (!res.success) setError(res.error || 'Login failed');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}


