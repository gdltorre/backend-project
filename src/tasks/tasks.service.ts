import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto, UpdateTaskDto } from "./dto/tasks.dto";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}

    async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = this.tasksRepository.create({
          ...createTaskDto,
          user,
        });
        return this.tasksRepository.save(task);
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
        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }

    async remove(id: number, user: User): Promise<void> {
        const result = await this.tasksRepository.delete({ id, user: { id: user.id } });
        if (result.affected === 0) {
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}