import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSession } from '../lib/session';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireDrchrono?: boolean;
}

export function RouteGuard({ 
  children, 
  requireAuth = false, 
  requireDrchrono = false 
}: RouteGuardProps) {
  const { session, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (requireAuth && !session.isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (requireDrchrono && session.user && !session.user.hasDrchrono) {
    // Redirect to backend endpoint for DrChrono OAuth
    window.location.href = '/api/v1/auth/drchrono/login';
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Connecting to DrChrono...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}