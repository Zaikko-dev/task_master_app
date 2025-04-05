import LottieView from 'lottie-react-native';
import lottie_loading_2 from '@/assets/lotties/lottie_loading_2.json';

export default function SplashScreen({
    onFinish = (isCancelled) => {},
}: {
    onFinish?: (isCancelled: boolean) => void;
}) {
    return (
        <LottieView
            source={lottie_loading_2}
            autoPlay
            onAnimationFinish={onFinish}
            resizeMode="center"
            loop={false}
            style={{
                flex: 1,
                width: '100%',
            }}
        />
    );
}
