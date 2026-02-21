import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        testTimeout: 10000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['controllers/**', 'middleware/**', 'utils/**'],
            exclude: ['node_modules', 'scripts', 'config']
        },
        // Run tests serially to avoid DB conflicts
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true
            }
        }
    }
});
