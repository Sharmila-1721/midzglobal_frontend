import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inquiries from './pages/Inquiries';
import Orders from './pages/Orders';
import Shipments from './pages/Shipments';
import PendingUsers from './pages/admin/PendingUsers';
import AllUsers from './pages/admin/AllUsers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontSize: '14px' } }} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Landing />} />
          <Route path="/register" element={<Landing />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inquiries" element={<ProtectedRoute roles={['importer','exporter']}><Inquiries /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute roles={['importer','exporter']}><Orders /></ProtectedRoute>} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/admin/pending" element={<ProtectedRoute roles={['admin']}><PendingUsers /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AllUsers /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
