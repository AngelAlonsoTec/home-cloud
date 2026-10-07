import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router';
import api, { setUnauthorizedHandler } from './api.js';
import { normalizePath } from './paths.js';
import Header from './components/Header.jsx';
import Loading from './components/Loading.jsx';
import Login from './components/Login.jsx';
import Browser from './components/Browser.jsx';

// Remounts the browser on every directory, so no state (notices, forms...)
// leaks from one directory to another
const BrowserPage = () => {
  const path = normalizePath(useParams()['*']);
  return <Browser key={path} path={path} />;
};

const App = () => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    setUnauthorizedHandler(() => setAuthenticated(false));
    api.checkSession().then((result) => setAuthenticated(result.success));
  }, []);

  const logout = async () => {
    await api.logout();
    setAuthenticated(false);
  };

  if (authenticated === null) {
    return <Loading text="Loading..." />;
  }

  return (
    <BrowserRouter>
      <Header onLogout={authenticated ? logout : null} />
      <main className="page">
        {authenticated ? (
          <Routes>
            <Route path="/content/*" element={<BrowserPage />} />
            <Route path="*" element={<Navigate to="/content/" replace />} />
          </Routes>
        ) : (
          <Login onLogin={() => setAuthenticated(true)} />
        )}
      </main>
    </BrowserRouter>
  );
};

export default App;
