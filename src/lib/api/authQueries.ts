import {useQuery} from '@tanstack/react-query';
import {api} from './client';

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return await api.get('/users');
        },
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
}
