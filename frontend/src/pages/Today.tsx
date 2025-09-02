import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth';
import { api } from '../api';
import { Task, Lane } from '../types';

function useTodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const date = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<Task[]>(`/tasks?date=${date}`);
      setTasks(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickAdd = async (title: string) => {
    const created = await api<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    setTasks(prev => [...prev, created]);
  };

  const moveTo = async (id: string, lane: Lane) => {
    const updated = await api<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ lane }) });
    setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
  };

  const markDone = async (id: string) => {
    const updated = await api<Task>(`/tasks/${id}/done`, { method: 'POST' });
    setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
  };

  return { tasks, loading, error, quickAdd, moveTo, markDone };
}

export default function TodayPage() {
  const { user, logout } = useAuth();
  const { tasks, loading, error, quickAdd, moveTo, markDone } = useTodayTasks();
  const [title, setTitle] = useState('');

  const grouped = useMemo(() => ({
    NOW: tasks.filter(t => t.lane === 'NOW' && t.status !== 'DONE'),
    NEXT: tasks.filter(t => t.lane === 'NEXT' && t.status !== 'DONE'),
    LATER: tasks.filter(t => t.lane === 'LATER' && t.status !== 'DONE'),
  }), [tasks]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await quickAdd(title.trim());
    setTitle('');
  };

  return (
    <div className="container">
      <header className="page-header">
        <h2>Today</h2>
        <div>
          <span className="muted" style={{ marginRight: 12 }}>{user?.email}</span>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <form onSubmit={add} style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <input className="input" placeholder="Quick add task" value={title} onChange={e => setTitle(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div className="grid-3">
        {(['NOW','NEXT','LATER'] as Lane[]).map(lane => (
          <section key={lane} className="card">
            <h3>{lane === 'NOW' ? 'Now' : lane === 'NEXT' ? 'Next' : 'Later'}</h3>
            <div style={{ minHeight: 120 }}>
              {grouped[lane].length === 0 ? (
                <p className="muted">No tasks</p>
              ) : (
                grouped[lane].map(t => (
                  <div key={t._id} className="task-row">
                    <span className="title">{t.title}</span>
                    <div className="actions">
                      {lane !== 'NOW' && <button className="btn btn-ghost" onClick={() => moveTo(t._id, 'NOW')}>Now</button>}
                      {lane !== 'NEXT' && <button className="btn btn-ghost" onClick={() => moveTo(t._id, 'NEXT')}>Next</button>}
                      {lane !== 'LATER' && <button className="btn btn-ghost" onClick={() => moveTo(t._id, 'LATER')}>Later</button>}
                      <button className="btn btn-success" onClick={() => markDone(t._id)}>Done</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
