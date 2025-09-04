import React, { useEffect } from 'react'; // ✅ Required for JSX to work
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';
import ErrorBoundary from './components/ErrorBoundary';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-space-gradient flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
