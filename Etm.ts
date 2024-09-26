import inquirer from 'inquirer'; 
import pg from 'pg';
import fs from 'fs';
import {connection} from './connections.js';


class EmployeeTracker {
  startEtm(): void {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'Option',
          message:
            'What would you like to do?',
          choices: [
            'View All Employees', 
            'Add An Employee',
            'Update An Employee Role',
            'View All Roles',
            'Add A Role',
            'View All Departments',
            'Add A Department',
            'Exit',
        ],
        },
      ])
      .then((answers) => {
        // check if the user wants to create a new vehicle or select an existing vehicle
        if (answers.Option === 'View All Employees') {
          this.viewAllEmp();
        } else if (answers.Option === 'Add An Employee') {
          this.addEmp(answers);
        } else if (answers.Option === 'Update An Employee Role') {
          this.updateEmpRole();
        } else if (answers.Option === 'View All Roles') {
          this.viewAllRoles();
        } else if (answers.Option === 'Add A Role') {
          this.addRole();
        } else if (answers.Option === 'View All Departments') {
          this.viewAllDept();
        } else if (answers.Option === 'Add A Department') {
          this.addDept();
        } else if (answers.Option === 'Exit') {
          this.exit();
        }
      });
  }

  addEmp(answers: any): void {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the employee first name?',
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is the employee last name?',
        },
        {
          type: 'input',
          name: 'role',
          message: 'What is the employee role?',
        },
        {
          type: 'input',
          name: 'manager',
          message: 'Who is the employee manager?',
          },])
      .then(async (answers: any): Promise<void> => {
        const {first_name, last_name, role, manager} = answers;
        //check if role exists
        const roleExists = `SELECT id FROM roles WHERE title = $1`;
        const roleValues = await this.connection.query(roleExists, [role]);
        if (roleValues.rows.length === 0) {
          console.log('Role does not exist! Please add role first.');
          this.startEtm();
          return;
        }
        //check if manager exists
        const managerExists = `SELECT id FROM employees WHERE first_name = $1 AND last_name = $2`;
        const managerNames = manager.split(' ');
        const managerValues = await this.connection.query(managerExists, [managerNames[0], managerNames[1]]);
        const manager_id = managerValues.rows.length > 0 ? managerValues.rows[0].id : null;
        
        const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
          VALUES ($1, $2, (SELECT id FROM roles WHERE title = $3), (SELECT id FROM employees WHERE first_name = $4 AND last_name = $5))`;
        const values = [first_name, last_name, role, manager_id];
        this.connection.query(query, values, (err, res) => {
          if (err) { console.error(err); 
            return; 
          }
          console.log('Employee added!');
          this.startEtm();
        });
      });
  }

  updateEmpRole(): void {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'employee',
          message: 'Which employee would you like to update?',
        },
        {
          type: 'input',
          name: 'role',
          message: 'What is the employee new role?',
        },
      ])
      .then((answers: any): void => {
        const {employee, role} = answers;
        const query = `UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = $1) WHERE first_name = $2`;
        const values = [role, employee];
        this.connection.query(query, values, (err, res) => {
          if (err) { console.error(err); 
            return; 
          }
          console.log('Employee role updated!');
          this.startEtm();
        });
      });
  }

  getDeptNames(): string[] {
    return this.departments.map((department) => department.name);
  }

  addRole(): void {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the role title?'
        },
        {
          type: 'list',
          name: 'department',
          message: 'What department is the role in?',
          choices: this.getDeptNames(),
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the role salary?',
        },
      ])
      .then((answers: any): void => {
        const {title, department, salary} = answers;
        const query = `INSERT INTO roles (title, salary, department_id) 
          VALUES ($1, $2, (SELECT id FROM departments WHERE name = $3))`;
        const values = [title, salary, department];
        this.connection.query(query, values, (err, res) => {
          if (err) { console.error(err); 
            return; 
          }
          console.log('Role added!');
          this.startEtm();
        });
      });
  }

  addDept(): void {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of the department?'
        },            
      ])
      .then((answers) => {
        const {name} = answers;
        const query = `INSERT INTO departments (name) VALUES ($1)`;
        const values = [name];
        this.connection.query(query, values, (err, res) => {
          if (err) { console.error(err); 
            return; 
          }
          console.log('Department added!');
          this.startEtm();
        });
      });

  }



  viewAllEmp(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.connection.query('SELECT * FROM employees', (err, res) => {
      if (err) throw err;
      console.table(res);
      this.startEtm();
    });
  }

  viewAllRoles(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.connection.query('SELECT * FROM roles', (err, res) => {
      if (err) throw err;
      console.table(res);
      this.startEtm();
    });
  }

  viewAllDept(): void {
    this.getDepartments();
  }

  getDepartments(): void {
    this.connection.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      console.table(res);
      this.startEtm();
    });
  }

  exit(): void {
    this.connection.end();
  }
}
