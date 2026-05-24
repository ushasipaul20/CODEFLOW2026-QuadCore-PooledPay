import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Auth type="login" />} />
        <Route path="/signup"   element={<Auth type="signup" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*"         element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
