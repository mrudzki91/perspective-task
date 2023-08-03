import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'yup';

export enum ValidationSourceEnum {
    Body,
    Query,
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    let apiKey = req.header('x-api-key');
    if (!apiKey) {
        return res
            .status(400)
            .send({ error: "API key is missing. Please send API key in the 'x-api-key' header" });
    }
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).send({ error: 'Wrong API key.' });
    }
    next();
};

export const validate =
    (schema: ObjectSchema<any>, source: ValidationSourceEnum) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.validateSync(
                source === ValidationSourceEnum.Body ? req.body : req.query,
                { stripUnknown: true },
            );
            return next();
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    };
