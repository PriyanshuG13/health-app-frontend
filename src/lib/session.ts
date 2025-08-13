import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export interface User {
    id: string;
    email: string;
    name: string;
    hasDrchrono: boolean;
}

export interface SessionData {
    user: User | null;
    isAuthenticated: boolean;
}

export function useSession() {
    const [session, setSession] = useState<SessionData>({
        user: null,
        isAuthenticated: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkSession = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get<SessionData>('/api/v1/auth/session');
            setSession(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to check session');
            setSession({ user: null, isAuthenticated: false });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const logout = useCallback(async () => {
        try {
            await api.post('/api/v1/auth/logout');
            setSession({ user: null, isAuthenticated: false });
        } catch (err) {
            console.error('Logout error:', err);
        }
    }, []);

    return {
        session,
        loading,
        error,
        refetchSession: checkSession,
        logout,
    };
}
