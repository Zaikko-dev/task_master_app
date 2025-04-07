import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'expo-router';
import { z } from 'zod';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { zodResolver } from '@hookform/resolvers/zod';

const signUpSchema = z.object({
    name: z
        .string({ required_error: 'El nombre es obligatorio' })
        .min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z
        .string({ required_error: 'El email es obligatorio' })
        .email('Correo electrónico inválido'),
    password: z
        .string({ required_error: 'La contraseña es obligatoria' })
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(50, 'La contraseña es demasiado larga'),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpForm) => {
        try {
            setLoading(true);
            setError(null);

            const { error: signupError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                    },
                },
            });

            if (signupError) {
                throw signupError;
            }

            const { error: loginError } =
                await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });

            if (loginError) {
                throw loginError;
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Ha ocurrido un error'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f5f5f5]">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 p-6 justify-center">
                    <Text className="text-3xl font-bold text-black mb-2">
                        ¡Registra tu cuenta!
                    </Text>
                    <Text className="text-lg font-bold text-[#666] mb-8">
                        Hola, debes iniciar sesión primero para poder usar la
                        aplicación y disfrutar de todas las funciones en Taskit
                    </Text>

                    <View className="gap-5">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <View className="gap-2">
                                    <Text className="text-lg font-bold text-[#333]">
                                        Nombre
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
                                        <Ionicons
                                            name="person-outline"
                                            size={24}
                                            color="#666"
                                            style={{ marginRight: 12 }}
                                        />
                                        <TextInput
                                            placeholder="Escribe tu nombre"
                                            placeholderTextColor="#999"
                                            autoCapitalize="words"
                                            onChangeText={onChange}
                                            value={value}
                                            className="flex-1 h-full font-bold text-lg text-black"
                                        />
                                    </View>
                                    {errors.name && (
                                        <Text className="text-[#dc2626] text-sm font-bold">
                                            {errors.name.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

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
                                        <Ionicons
                                            name="mail-outline"
                                            size={24}
                                            color="#666"
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
                                        <Ionicons
                                            name="lock-closed-outline"
                                            size={20}
                                            color="#666"
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
                                {loading ? 'Registrandose...' : 'Registrarse'}
                            </Text>
                        </TouchableOpacity>

                        <View className="items-center">
                            <Text className="font-bold color-[#666]">
                                ¿Ya tienes una cuenta?{' '}
                                <Link href="/signin">
                                    <Text className="color-[#6366f1] font-bold">
                                        Iniciar sesión
                                    </Text>
                                </Link>
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
