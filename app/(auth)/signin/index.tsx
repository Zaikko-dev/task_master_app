import {
    SafeAreaView,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'expo-router';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const signInSchema = z.object({
    email: z
        .string({ required_error: 'El email es obligatorio' })
        .email({ message: 'Correo electronico invalido' }),
    password: z
        .string({ required_error: 'La contraseña es obligatoria' })
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(30, 'La contraseña es demasiado larga'),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function Signin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInForm) => {
        try {
            setLoading(true);
            setError(null);

            const { error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });

            if (loginError) {
                throw loginError;
            }
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Ha ocurrido un error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f5f5]">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center p-6">
                    <Text className="text-4xl font-bold text-black mb-2">
                        Hola de nuevo!
                    </Text>
                    <Text className="text-lg font-bold text-[#666] mb-8 ">
                        Inicia sesion para continuar usando la aplicacion y
                        gestionar tus tareas
                    </Text>

                    <View className="gap-5">
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <View className="gap-2">
                                    <Text className="text-lg font-bold text-[#333]">
                                        Correo electronico
                                    </Text>
                                    <View
                                        className="flex-row items-center bg-white rounded-xl px-4 h-14"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: errors.email
                                                ? '#dc2626'
                                                : 'transparent',
                                        }}
                                    >
                                        <MaterialIcons
                                            name="mail-outline"
                                            size={24}
                                            color="black"
                                            style={{ marginRight: 12 }}
                                        />
                                        <TextInput
                                            placeholder="example@gmail.com"
                                            placeholderTextColor="#999"
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            onChangeText={onChange}
                                            value={value}
                                            className="flex-1 h-full font-bold text-lg text-black"
                                        />
                                    </View>
                                    {errors.email && (
                                        <Text className="text-[#dc2626] text-sm font-bold">
                                            {errors.email.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <View className="gap-2">
                                    <Text className="text-lg font-bold text-[#333]">
                                        Contraseña
                                    </Text>
                                    <View
                                        className="flex-row items-center bg-white rounded-xl px-4 h-14"
                                        style={{
                                            borderWidth: 2,
                                            borderColor: errors.password
                                                ? '#dc2626'
                                                : 'transparent',
                                        }}
                                    >
                                        <MaterialIcons
                                            name="lock-outline"
                                            size={24}
                                            color="black"
                                            style={{ marginRight: 12 }}
                                        />
                                        <TextInput
                                            placeholder="***************"
                                            placeholderTextColor="#999"
                                            secureTextEntry
                                            onChangeText={onChange}
                                            value={value}
                                            className="flex-1 h-full font-bold text-lg text-black"
                                        />
                                    </View>
                                    {errors.password && (
                                        <Text className="text-[#dc2626] text-sm font-bold">
                                            {errors.password.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        {error && (
                            <Text className="text-[#d62626] text-center font-bold">
                                {error}
                            </Text>
                        )}

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={loading}
                            className="bg-black rounded-xl h-14 justify-center items-center mt-6"
                        >
                            <Text
                                className={`${loading ? 'opacity-50' : 'opacity-100'} text-lg font-bold text-white`}
                            >
                                {loading
                                    ? 'Iniciando sesion...'
                                    : 'Iniciar sesion'}
                            </Text>
                        </TouchableOpacity>

                        <View className="items-center">
                            <Text className="font-bold color-[#666]">
                                ¿No tienes una cuenta?
                            </Text>
                            <Link href="/signup">
                                <Text className="color-[#6366f1] font-bold">
                                    Registrate
                                </Text>
                            </Link>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
