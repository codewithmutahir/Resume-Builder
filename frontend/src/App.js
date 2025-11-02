import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResumeBuilder from './pages/ResumeBuilder';
import '@/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ResumeBuilder />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;