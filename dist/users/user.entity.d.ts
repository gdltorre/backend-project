import { Task } from '../tasks/task.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    tasks: Task[];
}
