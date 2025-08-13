import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AccountCircle, ExitToApp, Menu as MenuIcon } from '@mui/icons-material';
import { useSession } from '../lib/api/authQueries';
import { useState } from 'react';

interface GlobalTopBarProps {
    onMobileMenuToggle?: () => void;
}

export function GlobalTopBar({ onMobileMenuToggle }: GlobalTopBarProps) {
    const { session, logout } = useSession();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logout();
        handleMenuClose();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <AppBar position="sticky" elevation={1}>
            <Toolbar>
                {isMobile && session.isAuthenticated && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onMobileMenuToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 600,
                    }}
                >
                    HealthApp
                </Typography>

                {session.isAuthenticated && !isMobile && (
                    <Box sx={{ display: 'flex', gap: 2, mr: 3 }}>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/chat"
                            sx={{
                                fontWeight: isActive('/chat') ? 600 : 400,
                                textDecoration: isActive('/chat') ? 'underline' : 'none',
                            }}
                        >
                            Chat
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/patients"
                            sx={{
                                fontWeight: isActive('/patients') ? 600 : 400,
                                textDecoration: isActive('/patients') ? 'underline' : 'none',
                            }}
                        >
                            Patients
                        </Button>
                        <Button
                            color="inherit"
                            component={Link}
                            to="/recording"
                            sx={{
                                fontWeight: isActive('/recording') ? 600 : 400,
                                textDecoration: isActive('/recording') ? 'underline' : 'none',
                            }}
                        >
                            Recording
                        </Button>
                    </Box>
                )}

                {session.isAuthenticated ? (
                    <>
                        <IconButton size="large" onClick={handleMenuOpen} color="inherit">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                {session.user?.name?.charAt(0) || <AccountCircle />}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem disabled>
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        {session.user?.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {session.user?.email}
                                    </Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ExitToApp sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button
                        color="inherit"
                        component={Link}
                        to="/auth/signin"
                        variant="outlined"
                        sx={{ borderColor: 'white', color: 'white' }}
                    >
                        Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
