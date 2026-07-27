import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/landing/LandingPage';
import { GeneratorPage } from '../pages/generator/GeneratorPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { AuthPage } from '../pages/auth/AuthPage';
import { ContactPage } from '../pages/contact/ContactPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/generator',
    element: <GeneratorPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/signin',
    element: <AuthPage />,
  },
  {
    path: '/signup',
    element: <AuthPage />,
  },
]);
