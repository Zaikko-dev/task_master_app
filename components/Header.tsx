import { Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Header() {
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
                <MaterialIcons name="menu" size={24} color="black" />
            </View>
        </View>
    );
}
