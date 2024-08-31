import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, ForbiddenException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
        return this.tasksService.create(createTaskDto, req.user);
    }

    @Get()
    async findAll(@Request() req) {
        try {
            return await this.tasksService.findAll(req.user);
        } 
        catch (error) {
            throw new InternalServerErrorException('Error retrieving tasks');
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        try {
        return await this.tasksService.findOne(+id, req.user);
        } 
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException('Error retrieving task');
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
        try {
            return await this.tasksService.update(+id, updateTaskDto, req.user);
        } 
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            if (error instanceof ForbiddenException) {
                throw error;
            }
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException('Error updating task');
        }
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.tasksService.remove(+id, req.user);
    }
}