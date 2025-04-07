import Header from '@/components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import lottie_todo from '@/assets/lotties/lottie_todo.json';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Todo } from '@/types/todo';
import { useCallback, useRef } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LottieView from 'lottie-react-native';
import AddTodoModal from '@/components/AddTodoModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import useTodoStore from '@/stores/todos';

export default function Index() {
    const todos = useTodoStore((state) => state.todos);
    const addTodo = useTodoStore((state) => state.addTodo);
    const modalRef = useRef<BottomSheetModal>(null);

    const handleSaveTodo = (todo: Todo) => {
        if (todo) {
            addTodo(todo);
        }
        modalRef.current?.close();
    };

    const handleAddTodo = useCallback(() => {
        modalRef.current?.present();
    }, []);

    const renderEmptyList = useCallback(
        () => (
            <View className="flex-1 justify-center content-center">
                <LottieView
                    source={lottie_todo}
                    autoPlay
                    loop={true}
                    style={styles.lottie}
                />
                <Text className="text-2xl font-bold text-center text-gray-600">
                    Aun no tienes tareas
                </Text>
                <Text className="text-base font-medium text-center text-gray-400">
                    Agrega tareas tocando el boton de abajo
                </Text>
            </View>
        ),
        []
    );

    const renderItem = useCallback(
        (todo: Todo) => (
            <TouchableOpacity
                className="flex-row justify-between items-center px-3 py-3 mx-4 my-2 rounded-2xl"
                style={{ backgroundColor: todo.color ? todo.color : '#dbeafe' }}
            >
                <View className="flex-row gap-3 items-center w-[90%]">
                    <Ionicons name="paper-plane" size={28} color="black" />
                    <View className="w-[85%]">
                        <Text className="text-[#2b2c2d] italic text-sm">
                            Limite: {todo.endDate || 'Sin fecha limite'}
                        </Text>
                        <Text className="text-[#2b2c2d] font-bold text-base">
                            {todo.title || 'Sin titulo'}
                        </Text>
                        <Text className="text-[#2b2c2d] text-sm">
                            {todo.description || 'Sin descripcion'}
                        </Text>
                    </View>
                </View>
                <MaterialIcons
                    name={
                        todo.completed
                            ? 'check-circle'
                            : 'radio-button-unchecked'
                    }
                    size={28}
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
                contentContainerStyle={{ flex: 1, paddingTop: 5 }}
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderItem(item)}
                ListEmptyComponent={renderEmptyList}
            />

            <View className="absolute bottom-10 bg-transparent w-full justify-center items-center">
                <TouchableOpacity
                    className="rounded-full w-16 h-16 bg-[#3931AC] justify-center items-center"
                    onPress={handleAddTodo}
                >
                    <MaterialIcons name="add" size={38} color="white" />
                </TouchableOpacity>
            </View>

            <AddTodoModal modalRef={modalRef} onSave={handleSaveTodo} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: '100%',
        height: 300,
    },
});
