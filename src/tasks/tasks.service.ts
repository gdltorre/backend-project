import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto, UpdateTaskDto } from "./dto/tasks.dto";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}

    async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        if (!createTaskDto.title || createTaskDto.title.trim() === '') {
            throw new BadRequestException('Title cannot be empty');
        }
        const { title, description, status } = createTaskDto;
        const task = this.tasksRepository.create({
          title,
          description,
          status: status || TaskStatus.TODO,
          user,
        });
        const result = await this.tasksRepository.insert(task);
        return this.tasksRepository.findOne({ where: { id: result.identifiers[0].id } });
    }
    
    async findAll(user: User): Promise<Task[]> {
        return this.tasksRepository.find({ where: { user: { id: user.id } } });
    }

    async findOne(id: number, user: User): Promise<Task> {
        if (isNaN(id)) {
          throw new BadRequestException('Invalid task ID');
        }
        const task = await this.tasksRepository.findOne({ where: { id }, relations: ['user'] });
        if (!task) {
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        if (task.user && task.user.id !== user.id) {
          throw new ForbiddenException('You do not have permission to access this task');
        }
        return task;
    }

    async update(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        const task = await this.findOne(id, user);
        
        if (updateTaskDto.status && !Object.values(TaskStatus).includes(updateTaskDto.status)) {
          throw new BadRequestException('Invalid task status');
        }
    
        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }

    async remove(id: number, user: User): Promise<void> {
        const task = await this.tasksRepository.findOne({ where: { id, user: { id: user.id } } });
        if (!task){
            throw new NotFoundException('Task with ID "${id}" not found');
        }
        await this.tasksRepository.remove(task);
    }
}