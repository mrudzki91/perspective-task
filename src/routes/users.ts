import express, { Request, Response } from 'express';
import { ValidationSourceEnum, validate } from '../utils/middlewares';
import { userModel, userRequestSchema, userSortingQuerySchema } from '../models/user';

const router = express.Router();

router.post(
    '/users',
    validate(userRequestSchema, ValidationSourceEnum.Body),
    async (req: Request, res: Response) => {
        const userExists = await userModel.exists({ email: req.body.email });
        if (userExists) {
            return res
                .status(200)
                .json({ userId: null, error: `User with email ${req.body.email} already exist.` });
        }

        res.status(201).json({ userId: (await new userModel(req.body).save())._id });
    },
);

router.get(
    '/users',
    validate(userSortingQuerySchema, ValidationSourceEnum.Query),
    async (req: Request, res: Response) => {
        res.status(200).json(
            await userModel
                .find(
                    null,
                    Object.keys(userModel.schema.obj).filter((prop) => prop !== 'password'),
                )
                .sort(req.query.created ? { created: req.query.created as 'asc' | 'desc' } : {}),
        );
    },
);

export default router;
