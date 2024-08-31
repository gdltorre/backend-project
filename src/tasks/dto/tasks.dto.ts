// src/tasks/dto/task.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status?: TaskStatus = TaskStatus.TODO;
}

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;
}