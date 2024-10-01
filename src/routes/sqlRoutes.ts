import express from 'express';
import { pool } from '../connections.js';
import { QueryResult } from 'pg';
// import router from './index.js';
const router = express.Router();




const opQuery = async (sql: string, params: any[] = []): Promise<any[]> => {
    try {
        const result: QueryResult = await pool.query(sql, params);
        return result.rows;
    } catch (err) {
        console.error('Database error:', err);
        return [];
    }
};

//create new employee
router.post('/api/newemployee', async (req: express.Request, res: express.Response) => {
    try {
        const {first_name, last_name, role_id, manager_id} = req.body;
        if (!first_name || !last_name || !role_id || !manager_id) {
            return res.status(400).json({error: 'Required fields are missing!'});
        }
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES ($1, $2, $3, $4) RETURNING *`;

        const result = await opQuery(sql, [first_name, last_name, role_id, manager_id]);

        res.json({
            message: 'Employee added successfully!',
            employee: result[0]
        });
    } catch (err) {
        res.status(500).json({error: (err as Error).message});
    }
});


//get all employees
router.get('/api/employees', async (_req: express.Request, res: express.Response) => {
    try {
        const sql = 'SELECT * FROM employees';
        const result = await opQuery(sql);
        res.json({
            message: 'Success!',
            data: result
        });
    } catch (err) {
        res.status(500).json({error: (err as Error).message});
    }
});

//get employee by id
router.get('/api/employee/:id', async (req: express.Request, res: express.Response) => {
    const sql = 'SELECT * FROM employees WHERE id = $1';
    const params = [req.params.id];
    pool.query(sql, params, (_err: any, result: { rows: string | any[]; }) => {
        if(result.rows.length === 0) {
            return res.status(404).json({err: 'No employees found'});
        }
        res.json({
            message: 'Success!',
            data: result.rows,
        });
    });
});

//update employee
router.put('/api/updateemployee/:id', async (req: { body: { first_name: any; last_name: any; role_id: any; manager_id: any; }; params: { id: any; }; }, res: { json: (arg0: { message: string; employee: any; }) => void; }) => {
    const sql = 'UPDATE employees SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *';
    const params = [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id, req.params.id];
        pool.query(sql, params, (_err: any, result: { rows: any[]; }) => {
        if(params === null) {
            console.log('Employee not found');
            return;
        }
        res.json({
            message: 'Employee updated successfully!',
            employee: result.rows[0]
        });
    });
});

//delete employee
router.delete('/api/deleteemployee/:id', async (req: express.Request, res: express.Response) => {
    try {
        const sql = 'DELETE FROM employees WHERE id = $1';
        const params = [req.params.id];
        pool.query(sql, params, (err: { message: any; }, result: { rows: any[]; }) => {
            if(err) {
                res.status(400).json({error: err.message});
                return;
            }
            res.json({
                message: 'Employee deleted successfully!',
                employee: result.rows[0]
            });
        });
    } catch (err) {
        res.status(500).json({error: (err as Error).message});
    }
});

// module.exports = router;
export default router;
