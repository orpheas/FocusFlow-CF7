import React from 'react';
import { BrowserRouter, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthProvider, Protected, useAuth } from './auth';
import LoginPage from './pages/Login';
import TodayPage from './pages/Today';
import FocusPage from './pages/Focus';
import HistoryPage from './pages/History';
import './App.css';

function Nav() {
  const { user } = useAuth();
  return (
    <nav className="app-nav">
      <div className="nav-left">
        <img src="/cf-logo.png" alt="Coding Factory" />
        <Link to="/">Today</Link>
        <Link to="/focus">Focus</Link>
        <Link to="/history">History</Link>
      </div>
      <div className="nav-center">FocusFlow</div>
      <div className="nav-right">
        <span className="nav-user">{user?.email ?? ''}</span>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <Protected>
                <Nav />
                <TodayPage />
              </Protected>
            }
          />
          <Route
            path="/focus"
            element={
              <Protected>
                <Nav />
                <FocusPage />
              </Protected>
            }
          />
          <Route
            path="/history"
            element={
              <Protected>
                <Nav />
                <HistoryPage />
              </Protected>
            }
          />
          {/* Plan route removed */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
