import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, Alert } from '@mui/material';
import { Microsoft, LocalHospital } from '@mui/icons-material';
import { useSession } from '../lib/session';
import { useNavigate, useLocation } from 'react-router-dom';

export function SignIn() {
    const { session } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    useEffect(() => {
        if (session.isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [session.isAuthenticated, navigate, from]);

    const handleSignIn = () => {
        // Redirect to backend Microsoft OAuth endpoint
        window.location.href = '/api/v1/auth/ms/login';
    };

    if (session.isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <LocalHospital sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign In to HealthApp
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Access your healthcare management platform
                </Typography>
            </Box>

            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    Please sign in with your Microsoft account to continue
                </Alert>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Microsoft />}
                    onClick={handleSignIn}
                    sx={{ px: 4, py: 1.5 }}
                    fullWidth
                >
                    Sign in with Microsoft
                </Button>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </Typography>
            </Paper>
        </Container>
    );
}
