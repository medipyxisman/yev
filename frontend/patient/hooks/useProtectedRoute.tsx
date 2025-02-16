import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

// Groups that require authentication
const PROTECTED_GROUPS = ['(tabs)', '(modals)'];

export function useProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inProtectedGroup = PROTECTED_GROUPS.some(group => 
      segments[0] === group
    );

    if (!isAuthenticated && inProtectedGroup) {
      // Redirect to login if trying to access protected route while not authenticated
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === '(auth)') {
      // Redirect to home if trying to access auth routes while authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, router]);
}