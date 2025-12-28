import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { EnglishTutor } from './pages/EnglishTutor';
import { KidsEnglish } from './pages/KidsEnglish';
import { CuriosityPal } from './pages/CuriosityPal';

function App() {
  return (
    <ApiKeyProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/english-tutor" element={<EnglishTutor />} />
            <Route path="/kids-english" element={<KidsEnglish />} />
            <Route path="/curiosity-pal" element={<CuriosityPal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ApiKeyProvider>
  );
}

export default App;