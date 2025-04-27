
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import TemplatesPage from './pages/courses/TemplatesPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManagement from './components/admin/CourseManagement';
import UserManagement from './components/admin/UserManagement';
import RegistrationsPage from './pages/admin/RegistrationsPage';
import CourseTemplates from './pages/admin/CourseTemplates';
import UnauthorizedPage from './pages/UnauthorizedPage';
import SettingsPage from './pages/admin/SettingsPage';
import AuthPage from './pages/auth/AuthPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AccountPage from './pages/account/AccountPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        
        {/* Account Routes */}
        <Route path="account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />
        
        {/* Auth Routes */}
        <Route path="auth" element={<AuthPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={
          <ProtectedRoute requiredRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="templates" element={<CourseTemplates />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="registrations" element={<RegistrationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
