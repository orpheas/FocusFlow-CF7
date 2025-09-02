import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlMode = params.get('mode');
    if (urlMode === 'register') setMode('register');
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  };

  return (
    <div className="auth-card card">
      <h1 style={{ marginBottom: 4 }}>FocusFlow</h1>
      <p className="muted" style={{ marginTop: 0 }}>ADHD-friendly planner</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="btn" onClick={() => setMode('login')} disabled={mode === 'login'}>Login</button>
        <button className="btn" onClick={() => setMode('register')} disabled={mode === 'register'}>Register</button>
      </div>
      <form onSubmit={submit}>
        {mode === 'register' && (
          <div style={{ marginBottom: 8 }}>
            <label>Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>{mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>
    </div>
  );
}
