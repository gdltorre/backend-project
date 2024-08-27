import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { CreateTaskDto } from "./dto/tasks.dto";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}

    async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            user: user,
        });
        return this.tasksRepository.save(task);
    }
    async findAll(user: User): Promise<Task[]> {
        return this.tasksRepository.find({ where: { user } });
    }

    async findOne(id: number, user: User): Promise<Task> {
        return this.tasksRepository.findOne({ where: { id, user } });
    }

    async update(id: number, updateTaskDto: any, user: User): Promise<Task> {
        await this.tasksRepository.update({ id, user }, updateTaskDto);
        return this.findOne(id, user);
    }

    async remove(id: number, user: User): Promise<void> {
        await this.tasksRepository.delete({ id, user });
    }
}