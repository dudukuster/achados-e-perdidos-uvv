import { Navigate, Route, Routes } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { FeedPage } from '@/pages/FeedPage';
import { CreateItemPage } from '@/pages/CreateItemPage';
import { ItemDetailPage } from '@/pages/ItemDetailPage';
import { MyItemsPage } from '@/pages/MyItemsPage';
import { EditItemPage } from '@/pages/EditItemPage';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminCategoriesPage } from '@/pages/AdminCategoriesPage';
import { AdminLocationsPage } from '@/pages/AdminLocationsPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdminPostsPage } from '@/pages/AdminPostsPage';
import { AdminRoute } from '@/components/AdminRoute';
import { NotFoundPage } from '@/pages/NotFoundPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
      <Route path="/create" element={<PrivateRoute><CreateItemPage /></PrivateRoute>} />
      <Route path="/items/:id" element={<PrivateRoute><ItemDetailPage /></PrivateRoute>} />
      <Route path="/items/:id/edit" element={<PrivateRoute><EditItemPage /></PrivateRoute>} />
      <Route path="/my-items" element={<PrivateRoute><MyItemsPage /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
      <Route path="/admin/locations" element={<AdminRoute><AdminLocationsPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/posts" element={<AdminRoute><AdminPostsPage /></AdminRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
