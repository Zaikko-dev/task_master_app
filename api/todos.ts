import { supabase } from '@/lib/supabase';
import { Todo } from '@/types/todo';

export default async function getTodos() {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('completed', false);

    if (error) {
        throw error;
    }

    return data;
}

export async function getTodosCompleted() {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('completed', true);

    if (error) {
        throw error;
    }

    return data;
}

export async function createTodo(todo: Todo) {
    const { data: userSession } = await supabase.auth.getSession();
    const { data, error } = await supabase.from('todos').insert({
        ...todo,
        user_id: userSession.session?.user.id,
    });

    if (error) {
        throw error;
    }

    return data;
}

// logica de esta funcion generada con ayuda de la IA
export async function updateTodo(todo: Todo) {
    const { data: userSession } = await supabase.auth.getSession();
    const { data, error } = await supabase
        .from('todos')
        .update({
            title: todo.title,
            description: todo.description,
            end_date: todo.end_date,
            color: todo.color,
            completed: todo.completed,
        })
        .eq('id', todo.id)
        .eq('user_id', userSession.session?.user.id);

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteTodo(todoId: string) {
    const { data: userSession } = await supabase.auth.getSession();
    const { data, error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId)
        .eq('user_id', userSession.session?.user.id);

    if (error) {
        throw error;
    }

    return data;
}
