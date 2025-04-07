import '../global.css';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import SplashScreen from '@/components/SplashScreen';
import { useState } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

function InitialLayout() {
    const [isAppReady, setIsAppReady] = useState(false);
    const { loading } = useAuth();
    useReactQueryDevTools(queryClient);

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                    name="(auth)/signin/index"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="(auth)/signup/index"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="completed/index"
                    options={{
                        gestureEnabled: false,
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="+not-found"
                    options={{ headerShown: false }}
                />
            </Stack>

            {(loading || !isAppReady) && (
                <SplashScreen
                    onFinish={(isCancelled) =>
                        !isCancelled && setIsAppReady(true)
                    }
                />
            )}
        </>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <GestureHandlerRootView>
                    <StatusBar backgroundColor="#000" />
                    <InitialLayout />
                </GestureHandlerRootView>
            </QueryClientProvider>
        </AuthProvider>
    );
}
