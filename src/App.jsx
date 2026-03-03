import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import FullCalendar from './pages/FullCalendar';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar/:id" element={<Detail />} />
        <Route path="/flip-calendar" element={<FullCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;
