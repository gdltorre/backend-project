import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    register(registerDto: any): Promise<{
        id: number;
        username: string;
        name: string;
        email: string;
        tasks: import("../tasks/task.entity").Task[];
    }>;
    getUser(id: string): Promise<import("../users/user.entity").User>;
    getUsers(): Promise<import("../users/user.entity").User[]>;
}
