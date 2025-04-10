import Header from '@/components/Header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import lottie_todo from '@/assets/lotties/lottie_todo.json';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Todo } from '@/types/todo';
import { useCallback, useRef, useState } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getTodos, { updateTodo } from '@/api/todos';

export default function Index() {
    const queryClient = useQueryClient();
    const { data: todos } = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos,
    });
    const modalRef = useRef<BottomSheetModal>(null);
    const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(
        undefined
    );

    const { mutate: toggleTodo } = useMutation({
        mutationFn: (todo: Todo) =>
            updateTodo({
                ...todo,
                completed: !todo.completed,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const handleSaveTodo = () => {
        modalRef.current?.close();
        setSelectedTodo(undefined);
    };

    const handleAddTodo = useCallback(() => {
        setSelectedTodo(undefined);
        modalRef.current?.present();
    }, []);

    const handleEditTodo = useCallback((todo: Todo) => {
        setSelectedTodo(todo);
        modalRef.current?.present();
    }, []);

    const handleToggleComplete = useCallback(
        (todo: Todo) => {
            toggleTodo(todo);
        },
        [toggleTodo]
    );

    const renderEmptyList = useCallback(
        () => (
            <View className="flex-1 pt-40 justify-center content-center">
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
                onPress={() => handleEditTodo(todo)}
            >
                <View className="flex-row gap-3 items-center w-[90%]">
                    <Ionicons name="paper-plane" size={28} color="black" />
                    <View className="w-[85%]">
                        <Text className="text-[#2b2c2d] italic text-sm">
                            Limite:{' '}
                            {todo.end_date?.slice(0, 10) || 'Sin fecha limite'}
                        </Text>
                        <Text className="text-[#2b2c2d] font-bold text-base">
                            {todo.title || 'Sin titulo'}
                        </Text>
                        <Text className="text-[#2b2c2d] text-sm">
                            {todo.description || 'Sin descripcion'}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(todo);
                    }}
                >
                    <MaterialIcons
                        name={
                            todo.completed
                                ? 'check-circle'
                                : 'radio-button-unchecked'
                        }
                        size={30}
                        color="black"
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        ),
        [handleEditTodo, handleToggleComplete]
    );

    return (
        <SafeAreaView className="flex-1 relative bg-white">
            <Header />

            <FlatList
                contentContainerStyle={{
                    paddingTop: 5,
                    paddingBottom: 100,
                }}
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

            <AddTodoModal
                modalRef={modalRef}
                onSave={handleSaveTodo}
                todoToEdit={selectedTodo}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    lottie: {
        width: '100%',
        height: 300,
    },
});
