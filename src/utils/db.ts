import mongoose from 'mongoose';

export const connect = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    const database = mongoose.connection;

    database.on('error', (error) => {
        console.log(error);
    });

    database.once('connected', () => {
        console.log('Database Connected');
    });
};
