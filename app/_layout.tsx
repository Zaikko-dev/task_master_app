import '../global.css';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import SplashScreen from '@/components/SplashScreen';
import { useState } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '@/providers/AuthProvider';

export default function RootLayout() {
    const [isAppReady, setIsAppReady] = useState(false);
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded || !isAppReady) {
        return (
            <SplashScreen
                onFinish={(isCancelled) => !isCancelled && setIsAppReady(true)}
            />
        );
    }

    return (
        <AuthProvider>
            <GestureHandlerRootView>
                <Stack>
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />
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
                        name="+not-found"
                        options={{ headerShown: false }}
                    />
                </Stack>
                <StatusBar backgroundColor="#000" />
            </GestureHandlerRootView>
        </AuthProvider>
    );
}
