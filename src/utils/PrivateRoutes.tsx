import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PrivateRoutes = () => {
  const { currentUser } = useAuth();
  const isAuthenticated = currentUser !== null;

  return isAuthenticated ? <Outlet /> : <Navigate to='/signin' />;
};

export default PrivateRoutes;
