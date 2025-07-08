
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1, // Reduced from 2 to prevent infinite loops
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Reduced max delay
      throwOnError: false,
      // Add networkMode to prevent issues with network connectivity
      networkMode: 'online',
    },
    mutations: {
      retry: 0, // No retry on mutations to prevent loops
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      throwOnError: false,
      networkMode: 'online',
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
