import '../global.css';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import SplashScreen from '@/components/SplashScreen';
import { useState } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
        <>
            <GestureHandlerRootView>
                <Stack>
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />
                </Stack>
                <StatusBar backgroundColor="#000" />
            </GestureHandlerRootView>
        </>
    );
}
