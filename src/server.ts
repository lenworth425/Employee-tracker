import express from 'express';
// import { QueryResult } from 'pg';
import { connectiontoDb } from './connections.js';
import logMethod from './middleware/logMethod.js';
import startEtm from './Etm.js';

await connectiontoDb();

// Import routes
import routes from './routes/index.js';

// Create an instance of express
const app = express();
const PORT = process.env.PORT || 3001;


// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMethod);
app.use(routes);

// pool.query('SELECT NOW()', (err: Error, res: QueryResult) => {
const startServer = async () => {
    try { 
        await connectiontoDb();
        console.log('Connected to the database');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            new startEtm();
        });
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        process.exit(1);
    }
};

startServer();
