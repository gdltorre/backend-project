import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto, UpdateTaskDto } from "./dto/tasks.dto";
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: Repository<Task>);
    create(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    findAll(user: User): Promise<Task[]>;
    findOne(id: number, user: User): Promise<Task>;
    update(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task>;
    remove(id: number, user: User): Promise<void>;
}
