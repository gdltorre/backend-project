"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./task.entity");
let TasksService = class TasksService {
    constructor(tasksRepository) {
        Object.defineProperty(this, "tasksRepository", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: tasksRepository
        });
    }
    async create(createTaskDto, user) {
        if (!createTaskDto.title || createTaskDto.title.trim() === '') {
            throw new common_1.BadRequestException('Title cannot be empty');
        }
        const { title, description, status } = createTaskDto;
        const task = this.tasksRepository.create({
            title,
            description,
            status: status || task_entity_1.TaskStatus.TODO,
            user,
        });
        const result = await this.tasksRepository.insert(task);
        return this.tasksRepository.findOne({ where: { id: result.identifiers[0].id } });
    }
    async findAll(user) {
        return this.tasksRepository.find({ where: { user: { id: user.id } } });
    }
    async findOne(id, user) {
        if (isNaN(id)) {
            throw new common_1.BadRequestException('Invalid task ID');
        }
        const task = await this.tasksRepository.findOne({ where: { id }, relations: ['user'] });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID "${id}" not found`);
        }
        if (task.user && task.user.id !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to access this task');
        }
        return task;
    }
    async update(id, updateTaskDto, user) {
        const task = await this.findOne(id, user);
        if (updateTaskDto.status && !Object.values(task_entity_1.TaskStatus).includes(updateTaskDto.status)) {
            throw new common_1.BadRequestException('Invalid task status');
        }
        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }
    async remove(id, user) {
        const task = await this.tasksRepository.findOne({ where: { id, user: { id: user.id } } });
        if (!task) {
            throw new common_1.NotFoundException('Task with ID "${id}" not found');
        }
        await this.tasksRepository.remove(task);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TasksService);
//# sourceMappingURL=tasks.service.js.map