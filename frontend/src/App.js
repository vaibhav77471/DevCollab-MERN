import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EditorPage from './components/EditorPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;