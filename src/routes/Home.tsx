import { Box, Container, Typography, Card, CardContent, Button, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { Chat, People, Mic, LocalHospital } from '@mui/icons-material';
import { useSession } from '../lib/session';

export function Home() {
    const { session } = useSession();

    const features = [
        {
            icon: <Chat sx={{ fontSize: 40 }} />,
            title: 'AI Chat Assistant',
            description: 'Get instant help with medical questions and patient care guidance.',
            link: '/chat',
            requireAuth: true,
        },
        {
            icon: <People sx={{ fontSize: 40 }} />,
            title: 'Patient Management',
            description: 'View and manage your patient records with DrChrono integration.',
            link: '/patients',
            requireAuth: true,
        },
        {
            icon: <Mic sx={{ fontSize: 40 }} />,
            title: 'Voice Recording',
            description: 'Record and transcribe patient notes with AI-powered transcription.',
            link: '/recording',
            requireAuth: true,
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <LocalHospital sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to HealthApp
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Your comprehensive healthcare management platform
                </Typography>

                {!session.isAuthenticated && (
                    <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        to="/auth/signin"
                        sx={{ px: 4, py: 1.5 }}
                    >
                        Get Started
                    </Button>
                )}
            </Box>

            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <CardContent sx={{ flex: 1, textAlign: 'center', p: 3 }}>
                                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                                <Typography variant="h5" component="h3" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    {feature.description}
                                </Typography>
                                {session.isAuthenticated ? (
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to={feature.link}
                                        fullWidth
                                    >
                                        Access Feature
                                    </Button>
                                ) : feature.requireAuth ? (
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to="/auth/signin"
                                        fullWidth
                                    >
                                        Sign In to Access
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        component={Link}
                                        to={feature.link}
                                        fullWidth
                                    >
                                        Try Now
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {session.isAuthenticated && (
                <Paper sx={{ mt: 6, p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Welcome back, {session.user?.name}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Ready to manage your healthcare practice with AI-powered tools.
                    </Typography>
                    <Box
                        sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Button variant="contained" component={Link} to="/chat">
                            Start Chat
                        </Button>
                        <Button variant="outlined" component={Link} to="/patients">
                            View Patients
                        </Button>
                        <Button variant="outlined" component={Link} to="/recording">
                            New Recording
                        </Button>
                    </Box>
                </Paper>
            )}
        </Container>
    );
}
