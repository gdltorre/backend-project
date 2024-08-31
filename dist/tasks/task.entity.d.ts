import { User } from '../users/user.entity';
export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
export declare class Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    user: User;
}
