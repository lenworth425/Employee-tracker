import express from 'express';
import {QueryResult} from 'pg';
import {pool ,connectiontoDb} from './connections.js';

await connectiontoDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create new employee
app.post('/api/newemployee', async (req, res) => {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
     VALUES ($1, $2, $3, $4) RETURNING *`;
     const params = [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id];

     pool.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Employee added successfully!',
            employee: result.rows[0]
        });
    });
});

//get all employees
app.get('/api/employees', async (req, res) => {
    const sql = 'SELECT * FROM employees';
    pool.query(sql, (err, result) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success!',
            data: result.rows[0],
        });
    });
});

//get employee by id
app.get('/api/employee/:id', async (req, res) => {
    const sql = 'SELECT * FROM employees WHERE id = $1';
    const params = [req.params.id];
    pool.query(sql, params, (err, result) => {
        if(params === null) {
            console.log('Employee not found');
            return;
        } 
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
app.put('/api/updateemployee/:id', async (req, res) => {
    const sql = 'UPDATE employees SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *';
    const params = [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id, req.params.id];
        pool.query(sql, params, (err, result) => {
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
app.delete('/api/deleteemployee/:id', async (req, res) => {
    const sql = 'DELETE FROM employees WHERE id = $1';
    const params = [req.params.id];
    pool.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Employee deleted successfully!',
        });
    });
});

// Default response for any other request
app.use((req, res) => {
    res.status(404).end();
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
