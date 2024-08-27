import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { User } from '../src/users/user.entity';
import { Task } from '../src/tasks/task.entity';

interface ContainerConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: any[]; // Add this line
}

export async function setupTestContainer(): Promise<ContainerConfig> {
    const container: StartedTestContainer = await new GenericContainer("postgres:13")
        .withExposedPorts(5432)
        .withEnvironment({
            POSTGRES_DB: 'testdb',
            POSTGRES_USER: 'testuser',
            POSTGRES_PASSWORD: 'testpass'
        })
        .start();

    return {
        host: container.getHost(),
        port: container.getMappedPort(5432),
        username: 'testuser',
        password: 'testpass',
        database: 'testdb',
        entities: [User, Task], // Add this line
    };
}