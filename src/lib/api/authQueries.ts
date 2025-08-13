import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { SessionData } from '../types/authTypes.ts';

const fetchSession = async (): Promise<SessionData> => {
    return await api.get<SessionData>('/api/v1/auth/session');
};

const logoutRequest = async (): Promise<void> => {
    await api.post('/api/v1/auth/logout');
};

export function useSession() {
    const queryClient = useQueryClient();

    // Session query
    const {
        data: session,
        isLoading: loading,
        isError,
        error,
        refetch: refetchSession,
    } = useQuery<SessionData, Error>({
        queryKey: ['session'],
        queryFn: fetchSession,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        retry: false, // don't retry if not authenticated
    });

    // Logout mutation
    const { mutate: logout } = useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            // Clear session data in cache
            queryClient.setQueryData<SessionData>(['session'], {
                user: null,
                isAuthenticated: false,
            });
        },
    });

    return {
        session: session ?? { user: null, isAuthenticated: false },
        loading,
        error: isError ? (error as Error).message : null,
        refetchSession,
        logout,
    };
}
