// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

import 'antd/dist/reset.css'; // Ant Design's base styles

function App() {
  return (
    <Router>
      {/* Optional: A simple navigation bar for testing */}
      <nav className="p-4 bg-gray-800 text-white flex justify-center space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/admin" className="hover:underline">Admin (Direct Link for Testing)</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;