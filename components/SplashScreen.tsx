import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import lottie_loading_2 from '@/assets/lotties/lottie_loading_2.json';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export default function SplashScreen({
    onFinish = () => {},
}: {
    onFinish?: (isCancelled: boolean) => void;
}) {
    const opacity = useSharedValue(1);

    const onAnimationFinish = (isCancelled: boolean) => {
        if (!isCancelled) {
            opacity.value = withTiming(
                0,
                {
                    duration: 400,
                },
                () => {
                    runOnJS(onFinish)(isCancelled);
                }
            );
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.safeArea, animatedStyle]}>
            <LottieView
                source={lottie_loading_2}
                autoPlay
                onAnimationFinish={onAnimationFinish}
                resizeMode="center"
                loop={false}
                style={{
                    flex: 1,
                    width: '100%',
                }}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 999,
    },
});
