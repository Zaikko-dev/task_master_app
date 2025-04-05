import Header from '@/components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import lottie_todo from '@/assets/lotties/lottie_todo.json';
import { Todo } from '@/types/todo';
import { useCallback, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LottieView from 'lottie-react-native';

export default function Index() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = (todo: Todo) => {
        const updateTodos = [...todos];
        updateTodos.push(todo);

        setTodos(updateTodos);
    };

    const renderEmptyList = useCallback(
        () => (
            <View className="flex-1 justify-center content-center">
                <LottieView
                    source={lottie_todo}
                    autoPlay
                    loop={true}
                    style={styles.lottie}
                />
                <Text className="text-xl font-bold text-center text-gray-600">
                    Aun no tienes tareas
                </Text>
                <Text className="text-xs font-medium text-center text-gray-400">
                    Agrega tareas tocando el boton de abajo
                </Text>
            </View>
        ),
        []
    );

    const renderItem = useCallback(
        (todo: Todo) => (
            <TouchableOpacity className="flex-row gap-3 items-center py-3 mx-3 border-b-2 border-b-[#d3d3d3]">
                <Text className="text-[#2b2c2d]">{todo.title}</Text>
                <MaterialIcons
                    name={
                        todo.completed
                            ? 'check-circle'
                            : 'radio-button-unchecked'
                    }
                    size={24}
                    color="black"
                />
            </TouchableOpacity>
        ),
        []
    );

    return (
        <SafeAreaView className="flex-1 relative bg-white">
            <Header />

            <FlatList
                contentContainerStyle={{ flex: 1 }}
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderItem(item)}
                ListEmptyComponent={renderEmptyList}
            />

            <View className="absolute bottom-10 bg-transparent w-full justify-center items-center">
                <TouchableOpacity className="rounded-full w-16 h-16 bg-[#3931AC] justify-center items-center">
                    <MaterialIcons name="add" size={38} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: '100%',
        height: 300,
    },
});
