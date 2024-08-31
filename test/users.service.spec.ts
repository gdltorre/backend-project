import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from "../src/users/users.service";
import { User } from '../src/users/user.entity';
import { Task } from '../src/tasks/task.entity';
import { TasksService } from '../src/tasks/tasks.service';
import { setupTestContainer } from './testcontainers-config';
import { TaskStatus } from 'src/tasks/dto/tasks.dto';

describe('UsersService', () => {
    let usersService: UsersService;
    let tasksService: TasksService;
    let moduleRef: TestingModule;

    beforeAll(async () => {
        const container = await setupTestContainer();

        moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: container.host,
                    port: container.port,
                    username: container.username,
                    password: container.password,
                    database: container.database,
                    entities: [User, Task],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([User, Task]),
            ],
            providers: [UsersService, TasksService],
        }).compile();

        usersService = moduleRef.get(UsersService);
        tasksService = moduleRef.get(TasksService);
    }, 60000);

    afterAll(async () => {
        await moduleRef.close();
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
        expect(tasksService).toBeDefined();
    });

    it('should create a user', async () => {
        const user = await usersService.create({
            username: 'testuser',
            password: 'testpass',
            name: 'Test User',
            email: 'test@example.com'
        });
        expect(user).toBeDefined();
        expect(user.id).toBeDefined();
        expect(user.username).toBe('testuser');
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
    }, 30000);

    it('should create a task for a user', async () => {
        const user = await usersService.create({
            username: 'taskuser',
            password: 'taskpass',
            name: 'Task User',
            email: 'taskuser@example.com'
        });

        const taskData = {
            title: 'Test Task',
            description: 'This is a test task',
            status: TaskStatus.TODO,
        };

        const task = await tasksService.create(taskData, user); 

        expect(task).toBeDefined();
        expect(task.id).toBeDefined();
        expect(task.title).toBe('Test Task');

        const userTasks = await tasksService.findAll(user);
        expect(userTasks).toHaveLength(1);
        expect(userTasks[0].id).toBe(task.id);
    }, 30000);

    it('should find all tasks for a user', async () => {
        const user = await usersService.create({
            username: 'multitaskuser',
            password: 'multipass',
            name: 'Multi Task User',
            email: 'multi@example.com'
        });

        await tasksService.create({
            title: 'Task 1',
            description: 'First task',
            status: TaskStatus.TODO,
        }, user);

        await tasksService.create({
            title: 'Task 2',
            description: 'Second task',
            status: TaskStatus.IN_PROGRESS,
        }, user);

        const tasks = await tasksService.findAll(user);
        expect(tasks).toHaveLength(2);
        expect(tasks[0].title).toBe('Task 1');
        expect(tasks[1].title).toBe('Task 2');
    }, 30000);

    it('should find one task for a user', async () => {
        const user = await usersService.create({
            username: 'onetaskuser',
            password: 'onepass',
            name: 'One Task User',
            email: 'one@example.com'
        });

        const createdTask = await tasksService.create({
            title: 'Find Me',
            description: 'This task should be found',
            status: TaskStatus.TODO,
        }, user);

        const foundTask = await tasksService.findOne(createdTask.id, user);
        expect(foundTask).toBeDefined();
        expect(foundTask.id).toBe(createdTask.id);
        expect(foundTask.title).toBe('Find Me');
    }, 30000);

    it('should update a task for a user', async () => {
        const user = await usersService.create({
            username: 'updateuser',
            password: 'updatepass',
            name: 'Update User',
            email: 'update@example.com'
        });

        const createdTask = await tasksService.create({
            title: 'Update Me',
            description: 'This task should be updated',
            status: TaskStatus.TODO,
        }, user);

        const updatedTask = await tasksService.update(createdTask.id, {
            title: 'Updated Task',
            status: TaskStatus.IN_PROGRESS
        }, user);

        expect(updatedTask.title).toBe('Updated Task');
        expect(updatedTask.status).toBe('IN_PROGRESS');
        expect(updatedTask.description).toBe('This task should be updated');
    }, 30000);

    it('should remove a task for a user', async () => {
        const user = await usersService.create({
            username: 'removeuser',
            password: 'removepass',
            name: 'Remove User',
            email: 'remove@example.com'
        });

        const createdTask = await tasksService.create({
            title: 'Remove Me',
            description: 'This task should be removed',
            status: TaskStatus.TODO,
        }, user);

        await tasksService.remove(createdTask.id, user);
        const tasks = await tasksService.findAll(user);
        expect(tasks).toHaveLength(0);
    }, 30000);
});