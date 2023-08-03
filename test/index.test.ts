import { describe, expect, test, beforeAll, afterEach, afterAll } from '@jest/globals';
import request from 'supertest';
import app, { server } from '../src/index';
import * as db from './db';

jest.mock('../src/utils/db.ts');

beforeAll(async () => await db.connect());

afterEach(async () => await db.clear());

afterAll(async () => {
    await db.close();
    server.close();
});

describe('POST endpoint', () => {
    test('returns error when not authenticated', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                email: 'test@gmail.com',
                fullName: 'John Doe',
                password: '12345678',
            })
            .set('x-api-key', 'wrong-key');
        expect(res.statusCode).toBe(401);
        expect(res.body?.userId).not.toBeNull();
    });

    test('creates user and returns its ID', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                email: 'test@gmail.com',
                fullName: 'John Doe',
                password: '12345678',
            })
            .set('x-api-key', process.env.API_KEY);
        expect(res.statusCode).toBe(201);
        expect(res.body?.userId).not.toBeNull();
    });

    test('does not add user when email already exists', async () => {
        await request(app)
            .post('/users')
            .send({
                email: 'test@gmail.com',
                fullName: 'John Doe',
                password: '12345678',
            })
            .set('x-api-key', process.env.API_KEY);

        const res = await request(app)
            .post('/users')
            .send({
                email: 'test@gmail.com',
                fullName: 'John Doe',
                password: '12345678',
            })
            .set('x-api-key', process.env.API_KEY);
        expect(res.statusCode).toBe(200);
        expect(res.body?.userId).toBeNull();
    });

    test('returns error when email is invalid', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                email: 'inwavild-email',
                fullName: 'John Doe',
                password: '12345678',
            })
            .set('x-api-key', process.env.API_KEY);
        expect(res.statusCode).toBe(400);
        expect(res.body?.error).toEqual('email must be a valid email');
    });

    test('returns error when name is missing', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                email: 'inwavild-email',
                password: '12345678',
            })
            .set('x-api-key', process.env.API_KEY);
        expect(res.statusCode).toBe(400);
        expect(res.body?.error).toEqual('fullName is a required field');
    });

    test('returns error when password is too short', async () => {
        const res = await request(app)
            .post('/users')
            .send({
                email: 'inwavild-email',
                fullName: 'John Doe',
                password: '123',
            })
            .set('x-api-key', process.env.API_KEY);
        expect(res.statusCode).toBe(400);
        expect(res.body?.error).toEqual('password must be at least 8 characters');
    });
});

describe('GET endpoint', () => {
    const createUser = async (email: string) =>
        await request(app)
            .post('/users')
            .send({
                email,
                fullName: 'John Doe',
                password: '12345678',
            })
            .set('x-api-key', process.env.API_KEY);

    test('returns error when not authenticated', async () => {
        const res = await request(app).get('/users').set('x-api-key', 'wrong-key');
        expect(res.statusCode).toBe(401);
        expect(res.body?.userId).not.toBeNull();
    });

    test('returns list of users', async () => {
        await createUser('user@gmail.com');
        const res = await request(app).get('/users').set('x-api-key', process.env.API_KEY);
        expect(res.statusCode).toBe(200);
        expect(res.body[0]).toEqual(
            expect.objectContaining({
                email: 'user@gmail.com',
                fullName: 'John Doe',
            }),
        );
    });

    test('returns users sorted by created date', async () => {
        await createUser('user@gmail.com');
        await createUser('user2@gmail.com');

        const resASC = await request(app)
            .get('/users?created=asc')
            .set('x-api-key', process.env.API_KEY);
        expect(resASC.statusCode).toBe(200);

        expect(resASC.body[0]).toEqual(
            expect.objectContaining({
                email: 'user@gmail.com',
                fullName: 'John Doe',
            }),
        );

        expect(resASC.body[1]).toEqual(
            expect.objectContaining({
                email: 'user2@gmail.com',
                fullName: 'John Doe',
            }),
        );

        const resDESC = await request(app)
            .get('/users?created=desc')
            .set('x-api-key', process.env.API_KEY);
        expect(resASC.statusCode).toBe(200);

        expect(resDESC.body[0]).toEqual(
            expect.objectContaining({
                email: 'user2@gmail.com',
                fullName: 'John Doe',
            }),
        );

        expect(resDESC.body[1]).toEqual(
            expect.objectContaining({
                email: 'user@gmail.com',
                fullName: 'John Doe',
            }),
        );
    });

    test('returns error when created param has wrong value', async () => {
        const res = await request(app)
            .get('/users?created=wrong')
            .set('x-api-key', process.env.API_KEY);
        expect(res.statusCode).toBe(400);
    });
});
