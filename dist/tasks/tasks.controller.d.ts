import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, req: any): Promise<import("./task.entity").Task>;
    findAll(req: any): Promise<import("./task.entity").Task[]>;
    findOne(id: string, req: any): Promise<import("./task.entity").Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, req: any): Promise<import("./task.entity").Task>;
    remove(id: string, req: any): Promise<void>;
}
