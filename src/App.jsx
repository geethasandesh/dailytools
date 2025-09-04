import React from 'react'; // ✅ Required for JSX to work
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/Routes';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-space-gradient flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
};

export default App;
