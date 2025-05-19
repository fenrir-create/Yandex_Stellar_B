import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';

interface Props {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<Props> = ({ children, onlyUnAuth = false }) => {
  const isAuthenticated = Boolean(localStorage.getItem('accessToken'));
  const location = useLocation();

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to='/' />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
