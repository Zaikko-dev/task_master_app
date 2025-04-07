import { Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function Header() {
    const logout = () => {
        supabase.auth.signOut();
    };

    const handleCompletedPress = () => {
        router.replace('/completed');
    };

    return (
        <View className="flex-row justify-between items-center p-3 bg-blue-100">
            <Text className="text-2xl font-bold">Mis tareas</Text>
            <View className="flex-row items-center gap-5">
                <TouchableOpacity onPress={handleCompletedPress}>
                    <MaterialIcons name="check-box" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={logout}>
                    <MaterialIcons name="exit-to-app" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
