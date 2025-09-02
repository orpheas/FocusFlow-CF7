import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { FocusSession } from '../types';

export default function FocusPage() {
  const [planned, setPlanned] = useState(25);
  const [note, setNote] = useState('');
  const [current, setCurrent] = useState<FocusSession | null>(null);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (current && !current.endedAt) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }
  }, [current]);

  const start = async () => {
    const s = await api<FocusSession>('/sessions', { method: 'POST', body: JSON.stringify({ plannedMinutes: planned, note }) });
    setCurrent(s);
    setSeconds(0);
  };

  const stop = async () => {
    if (!current) return;
    const s = await api<FocusSession>(`/sessions/${current._id}/stop`, { method: 'PATCH' });
    setCurrent(s);
    if (timerRef.current) window.clearInterval(timerRef.current);
  };

  return (
    <div className="container">
      <h2>Focus</h2>
      {!current || current.endedAt ? (
        <div className="card" style={{ maxWidth: 420, padding: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <label>Planned minutes</label>
            <input className="input" type="number" min={1} max={600} value={planned} onChange={e => setPlanned(parseInt(e.target.value || '0', 10))} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Note</label>
            <input className="input" value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={start}>Start</button>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: 420, padding: 16 }}>
          <h3>In session</h3>
          <p>Elapsed: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>
          <button className="btn btn-danger" onClick={stop}>Stop</button>
        </div>
      )}
    </div>
  );
}
