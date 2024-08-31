import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        const task = await this.tasksRepository.findOne({ where: { id, user: { id: user.id } } });
        if (!task) {
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }

    async update(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        if (isNaN(id)) {
          throw new BadRequestException('Invalid task ID');
        }
        const task = await this.findOne(id, user);
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        // Update the Task
        Object.assign(task, updateTaskDto);

        await this.tasksRepository.save(task);
        return task;
    }

    async remove(id: number, user: User): Promise<void> {
        const task = await this.tasksRepository.findOne({ where: { id, user: { id: user.id } } });
        if (!task){
            throw new NotFoundException('Task with ID "${id}" not found');
        }
        await this.tasksRepository.remove(task);
    }
}