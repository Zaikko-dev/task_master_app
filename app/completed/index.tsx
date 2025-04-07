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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateTodo, getTodosCompleted } from '@/api/todos';
import { router } from 'expo-router';

// logica de esta vista generada con ayuda de la IA
export default function Completed() {
    const queryClient = useQueryClient();
    const { data: todos } = useQuery({
        queryKey: ['completed-todos'],
        queryFn: getTodosCompleted,
    });
    const modalRef = useRef<BottomSheetModal>(null);
    const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>(
        undefined
    );

    const handleGoBack = useCallback(() => {
        router.replace('/');
    }, []);

    const { mutate: toggleTodo } = useMutation({
        mutationFn: (todo: Todo) =>
            updateTodo({
                ...todo,
                completed: !todo.completed,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['completed-todos'] });
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });

    const handleSaveTodo = () => {
        modalRef.current?.close();
        setSelectedTodo(undefined);
    };

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
                    No hay tareas completadas
                </Text>
                <Text className="text-base font-medium text-center text-gray-400">
                    Las tareas que completes aparecerán aquí
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
                        name="check-circle"
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
            <View className="flex-row items-center justify-between px-5 py-4 bg-blue-100">
                <TouchableOpacity onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold">Tareas Completadas</Text>
                <View style={{ width: 24 }} />
            </View>

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
