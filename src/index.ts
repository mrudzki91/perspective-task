import express, { Express, NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { authenticate } from './utils/middlewares';
import routes from './routes/users';
import { connect } from './utils/db';

dotenv.config();
connect();

const app: Express = express();

app.use(cors()).use(express.json()).options('*', cors());

app.use(authenticate);
app.use('/', routes);

// Handle unsupported routes
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route does not exist.' });
});

// Handle errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        next(err);
        return;
    }
    res.status(500).json({ error: 'Something went wrong.' });
});

const port = process.env.PORT || 3111;
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
