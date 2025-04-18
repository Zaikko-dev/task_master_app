import { Todo } from '@/types/todo';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { ForwardedRef, useCallback, useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import uuid from 'react-native-uuid';
import { createTodo, updateTodo, deleteTodo } from '@/api/todos';

// logica de cambio de colores generada con ayuda de la IA
const COLORS = [
    '#FFB3BA', // Rosa pastel
    '#B4D8E7', // Melocotón pastel
    '#C8E6C9', // Amarillo pastel
    '#FFF9C4', // Verde lima pastel
    '#D8BFD8', // Menta pastel
    '#FFE0B2', // Celeste pastel
];

const AddTodoSchema = z.object({
    title: z
        .string({ required_error: 'Campo obligatorio' })
        .min(2, { message: 'Debe tener al menos 2 caracteres' })
        .max(35, { message: 'Debe tener menos de 35 caracteres' }),
    description: z
        .string()
        .max(50, { message: 'Debe tener menos de 50 caracteres' })
        .optional()
        .nullable(),
    end_date: z
        .string({ required_error: 'Debes seleccionar una fecha' })
        .nullable(),
});

type AddTodoForm = z.infer<typeof AddTodoSchema>;

export default function AddTodoModal({
    modalRef,
    onSave,
    todoToEdit,
}: {
    modalRef: ForwardedRef<BottomSheetModal>;
    onSave: () => void;
    todoToEdit?: Todo;
}) {
    const queryClient = useQueryClient();
    const { mutate: saveTodo, isPending: isCreating } = useMutation({
        mutationFn: (todo: Todo) => createTodo(todo),
        onSuccess: () => {
            onSave();
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const { mutate: editTodo, isPending: isUpdating } = useMutation({
        mutationFn: (todo: Todo) => updateTodo(todo),
        onSuccess: () => {
            onSave();
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const { mutate: removeTodo, isPending: isDeleting } = useMutation({
        mutationFn: (todoId: string) => deleteTodo(todoId),
        onSuccess: () => {
            onSave();
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const [selectedColor, setSelectedColor] = useState<string>(
        todoToEdit?.color || '#FFB3BA'
    );

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddTodoForm>({
        resolver: zodResolver(AddTodoSchema),
        defaultValues: {
            title: todoToEdit?.title || '',
            description: todoToEdit?.description || null,
            end_date:
                todoToEdit?.end_date || new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        if (todoToEdit) {
            reset({
                title: todoToEdit.title,
                description: todoToEdit.description,
                end_date: todoToEdit.end_date,
            });
            setSelectedColor(todoToEdit.color || '#FFB3BA');
        }
    }, [todoToEdit, reset]);

    const onSubmit = async (data: AddTodoForm) => {
        Keyboard.dismiss();
        if (todoToEdit) {
            editTodo({
                ...todoToEdit,
                ...data,
                description: data.description || null,
                color: selectedColor,
            });
        } else {
            saveTodo({
                ...data,
                description: data.description || null,
                color: selectedColor,
                completed: false,
                id: uuid.v4().toString(),
                user_id: null,
            });
        }
    };

    const handleDelete = () => {
        if (!todoToEdit) return;

        Alert.alert(
            'Eliminar tarea',
            '¿Estás seguro de que quieres eliminar esta tarea?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        removeTodo(todoToEdit.id);
                    },
                },
            ]
        );
    };

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                pressBehavior="close"
                appearsOnIndex={0}
                disappearsOnIndex={-1}
            />
        ),
        []
    );

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={modalRef}
                snapPoints={['95%']}
                enableDynamicSizing={false}
                enablePanDownToClose
                enableDismissOnClose
                onDismiss={() => {
                    reset();
                    setSelectedColor('#FFB3BA');
                }}
                backdropComponent={renderBackdrop}
                animateOnMount={false}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <BottomSheetView
                        className="flex-1 gap-6 pt-2 px-6 pb-8"
                        style={{ backgroundColor: selectedColor }}
                    >
                        <View className="flex-row justify-between items-center">
                            <Text className="font-bold text-2xl text-black">
                                {todoToEdit ? 'Editar tarea' : 'Agregar tarea'}
                            </Text>

                            <View className="flex-row gap-3">
                                {todoToEdit && (
                                    <TouchableOpacity
                                        className="justify-center items-center h-12 w-12 rounded-lg bg-red-600"
                                        onPress={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        <MaterialIcons
                                            name="delete"
                                            size={24}
                                            color="white"
                                        />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    disabled={isCreating || isUpdating}
                                    className="flex-row gap-2 h-12 justify-center items-center rounded-lg bg-gray-500 px-3"
                                    onPress={handleSubmit(onSubmit)}
                                >
                                    <MaterialIcons
                                        name="save"
                                        size={24}
                                        color="white"
                                    />
                                    <Text className="font-bold text-xl text-white">
                                        {todoToEdit ? 'Actualizar' : 'Crear'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, value } }) => (
                                <View className="relative">
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        placeholder="Titulo de la tarea *"
                                        placeholderTextColor="#9c9c9c"
                                        className="bg-gray-100 rounded-xl h-14 p-2 text-lg"
                                        editable={!isCreating && !isUpdating}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: errors.title
                                                ? '#a61414'
                                                : 'transparent',
                                        }}
                                    />
                                    {!!errors.title && (
                                        <Text className="text-[#9e0606] text-sm absolute left-2 -top-5 bg-transparent">
                                            {errors.title?.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, value } }) => (
                                <View className="relative">
                                    <TextInput
                                        value={value || ''}
                                        onChangeText={onChange}
                                        placeholder="Descripcion de la tarea"
                                        placeholderTextColor="#9c9c9c"
                                        className="bg-gray-100 rounded-xl h-14 p-2 text-lg"
                                        editable={!isCreating && !isUpdating}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: errors.description
                                                ? '#a61414'
                                                : 'transparent',
                                        }}
                                    />
                                    {!!errors.description && (
                                        <Text className="text-[#9e0606] text-sm absolute left-2 -top-5 bg-transparent">
                                            {errors.description?.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <View className="flex-row gap-4 justify-center items-center rounded-2xl p-4 bg-gray-100">
                            {COLORS.map((color) => (
                                <TouchableOpacity
                                    disabled={isCreating || isUpdating}
                                    key={color}
                                    onPress={() => setSelectedColor(color)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 22,
                                        backgroundColor: color,
                                        borderWidth:
                                            selectedColor === color ? 3 : 0,
                                        borderColor: '#666',
                                        shadowColor: '#000',
                                    }}
                                />
                            ))}
                        </View>

                        <Controller
                            control={control}
                            name="end_date"
                            render={({ field: { onChange, value } }) => (
                                <View className="bg-gray-100 rounded-2xl p-4">
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row justify-center items-center gap-3">
                                            <MaterialIcons
                                                name="calendar-month"
                                                size={24}
                                                color="#666"
                                            />
                                            <Text className="font-bold text-lg text-[#666]">
                                                Fecha limite :
                                            </Text>
                                        </View>
                                        <Text className="font-semibold text-lg text-[#666] italic">
                                            {value?.slice(0, 10)}
                                        </Text>
                                    </View>
                                    <Calendar
                                        editable={!isCreating && !isUpdating}
                                        onDayPress={(day: {
                                            dateString: string;
                                        }) => {
                                            onChange(day.dateString);
                                        }}
                                        markedDates={{
                                            [value || '']: {
                                                selected: true,
                                                selectedColor: selectedColor,
                                            },
                                        }}
                                        minDate={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        style={{
                                            borderRadius: 16,
                                            height: 350,
                                        }}
                                        theme={{
                                            backgroundColor: 'transparent',
                                            calendarBackground: 'transparent',
                                            textSectionTitleColor: '#666',
                                            selectedDayBackgroundColor:
                                                selectedColor,
                                            selectedDayTextColor: '#666',
                                            todayTextColor: '#666',
                                            dayTextColor: '#444',
                                            textDisabledColor: '#d9e1e8',
                                            dotColor: selectedColor,
                                            selectedDotColor: '#666',
                                            arrowColor: '#666',
                                            monthTextColor: '#666',
                                            textMonthFontWeight: 'bold',
                                            textDayFontSize: 16,
                                            textMonthFontSize: 18,
                                        }}
                                    />
                                </View>
                            )}
                        />
                    </BottomSheetView>
                </TouchableWithoutFeedback>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
}
