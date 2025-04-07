import { Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { supabase } from '@/lib/supabase';

export default function Header() {
    const logout = () => {
        supabase.auth.signOut();
    };

    return (
        <View className="flex-row justify-between items-center p-3 bg-blue-100">
            <Text className="text-2xl font-bold">Mis tareas</Text>
            <View className="flex-row items-center gap-4">
                <MaterialIcons name="search" size={24} color="black" />
                <MaterialIcons
                    name="notifications-none"
                    size={24}
                    color="black"
                />
                <TouchableOpacity onPress={logout}>
                    <MaterialIcons name="exit-to-app" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
