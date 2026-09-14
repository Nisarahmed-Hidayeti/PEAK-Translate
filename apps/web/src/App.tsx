import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VocabularyProvider } from './context/VocabularyContext';
import Dashboard from './pages/dashboard/Dashboard';
import VocabularyList from './pages/vocabulary/VocabularyList';
import VocabularyDetail from './pages/vocabulary/VocabularyDetail';
import Settings from './pages/settings/Settings';
import Privacy from './pages/privacy/Privacy';
import './index.css';

function App() {
  return (
    <VocabularyProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>Peak Translation</h1>
            <p>Understand. Learn. Remember.</p>
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vocabulary" element={<VocabularyList />} />
              <Route path="/vocabulary/:id" element={<VocabularyDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} Peak Translation. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </VocabularyProvider>
  );
}

export default App;
