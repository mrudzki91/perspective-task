import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongodb = new MongoMemoryServer();

export const connect = async () => {
    await mongodb.start();
    await mongoose.connect(mongodb.getUri());
};

export const close = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
};

export const clear = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        collections[key].deleteMany();
    }
};
