/*export type Todo = {
    id: string;
    title: string;
    description?: string;
    endDate?: string;
    completed: boolean;
    completedAt?: string;
    color?: string;
};*/

import { Database } from './database.types';

export type Todo = Database['public']['Tables']['todos']['Row'];
