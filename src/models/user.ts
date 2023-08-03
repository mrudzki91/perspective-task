import { string, date, object } from 'yup';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const userRequestSchema = object({
    email: string().required().email(),
    fullName: string().required().trim().min(2).max(50),
    password: string().required().trim().min(8),
    created: date().default(() => new Date()),
}).required();

export const userSortingQuerySchema = object({
    created: string().oneOf(['asc', 'desc']),
}).required();

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
    },
    fullName: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    created: {
        required: true,
        type: Date,
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

export const userModel = mongoose.model('User', userSchema);
