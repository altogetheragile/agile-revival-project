
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import UnderConstructionPage from './pages/UnderConstructionPage';
import AuthPage from './pages/auth/AuthPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        
        {/* Temporary redirects to UnderConstruction */}
        <Route path="about" element={<UnderConstructionPage />} />
        <Route path="contact" element={<UnderConstructionPage />} />
        <Route path="courses" element={<UnderConstructionPage />} />
        <Route path="courses/:id" element={<UnderConstructionPage />} />
        <Route path="templates" element={<UnderConstructionPage />} />
        
        {/* Auth Routes */}
        <Route path="auth" element={<AuthPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        
        {/* Admin Routes - temporarily redirected */}
        <Route path="admin/*" element={<UnderConstructionPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
