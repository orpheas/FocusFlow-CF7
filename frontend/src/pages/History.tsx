import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { FocusSession } from '../types';
import { formatDateTime, formatTime } from '../utils/date';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [list, acts] = await Promise.all([
          api<FocusSession[]>('/sessions').catch(() => []),
          api<any[]>('/activity').catch(() => []),
        ]);
        setSessions(list);
        setActivities(acts);
      } catch (e: any) {
        setError(e.message || 'Failed');
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>History</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <h3>Task completions</h3>
      <ul className="list card" style={{ padding: 12 }}>
        {activities.map(a => (
          <li key={a._id}>
            {formatDateTime(new Date(a.createdAt))} – {a.title || a.type}
          </li>
        ))}
      </ul>

      <h3>Focus sessions</h3>
      <ul className="list card" style={{ padding: 12 }}>
        {sessions.map(s => (
          <li key={s._id}>
            {formatDateTime(new Date(s.startedAt))} → {s.endedAt ? formatTime(new Date(s.endedAt)) : '—'}
            {typeof s.actualMinutes === 'number' ? ` (${s.actualMinutes} min)` : ''}
            {s.note ? ` – ${s.note}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
