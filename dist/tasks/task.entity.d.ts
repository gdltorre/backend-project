import { User } from '../users/user.entity';
export declare class Task {
    id: number;
    title: string;
    description: string;
    status: string;
    user: User;
}
