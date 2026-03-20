import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-get-random-values';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStore } from '@/store/mockDataStore';
import { ClerkProvider } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { tokenCache } from '../utils/tokenCache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  console.warn(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Please set it in your .env'
  );
}

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || 'https://example.convex.cloud';
const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

export const unstable_settings = {
  anchor: '(tabs)',
};

function InitialLayout() {
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const currentRole = useAppStore(state => state.currentRole);

  useEffect(() => {
    const inWorkerGroup = segments[0] === '(worker)';
    const inInsurerGroup = segments[0] === '(insurer)';
    const inPartnerGroup = segments[0] === '(partner)';
    
    // Simple role-based guard for the demo
    if (currentRole === 'worker' && !inWorkerGroup) {
      router.replace('/(worker)/dashboard' as any);
    } else if (currentRole === 'insurer' && !inInsurerGroup) {
      router.replace('/(insurer)' as any);
    } else if (currentRole === 'partner' && !inPartnerGroup) {
      router.replace('/(partner)' as any);
    } else if (!currentRole && (inWorkerGroup || inInsurerGroup || inPartnerGroup)) {
      router.replace('/' as any);
    }
  }, [currentRole, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(worker)" options={{ headerShown: false }} />
        <Stack.Screen name="(insurer)" options={{ headerShown: false }} />
        <Stack.Screen name="(partner)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="signup" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey || ""} tokenCache={tokenCache}>
      <ConvexReactClientProvider>
        <InitialLayout />
      </ConvexReactClientProvider>
    </ClerkProvider>
  );
}

// Temporary wrapper to avoid useAuth hook dependency inside InitialLayout before initialization
function ConvexReactClientProvider({ children }: { children: React.ReactNode }) {
  // Bypassing Clerk integration for Convex entirely during our demo flow since we use mockDataStore
  const mockAuth = () => ({
    getToken: () => Promise.resolve(null),
    isAuthenticated: false,
    isLoading: false,
    isLoaded: true,
    isSignedIn: false,
    orgId: undefined,
    orgRole: undefined,
    sessionClaims: undefined,
    orgSlug: undefined,
    has: () => false,
  } as any);

  return <ConvexProviderWithClerk client={convex} useAuth={mockAuth}>{children}</ConvexProviderWithClerk>;
}
