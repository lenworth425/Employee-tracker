import pkg, {Pool as PoolType} from 'pg';
// import fs from 'fs';
import inquirer from 'inquirer'; 
let { Pool } =pkg;

class EmployeeTracker {
  connection: PoolType;

  constructor() {
    this.connection = new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: 'localhost',
      database: process.env.DB_NAME,
      port: 5432,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.connection.connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database: ', error);
    }
  }

  async disconnect() {
    await this.connection.end();
    console.log('Disconnected from the database');
  }

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
      .then((answers: { Option: string; }) => {
        // check if the user wants to create a new vehicle or select an existing vehicle
        if (answers.Option === 'View All Employees') {
          this.viewAllEmp();
        } else if (answers.Option === 'Add An Employee') {
          this.addEmp(answers);
        } else if (answers.Option === 'Update An Employee Role') {
          this.updateEmpRole();
        } else if (answers.Option === 'View All Roles') {
          this.viewAllRole();
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

  //function for generating a new employee ID
  async generateEmployeeId(): Promise<number> {
    const result = await this.connection.query('SELECT MAX(id) + 1 AS new_id FROM employee');
    return result.rows[0].new_id || 1;
  }

  //function for adding employee
  async addEmp(_answers: any): Promise<void> {
    try {
      const answers = await inquirer.prompt([
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
          type: 'list',
          name: 'role',
          message: 'What is the employee role?',
          choices: await this.getRoleNames(),
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is the employee manager?',
          choices: await this.getEmployeeNames(), 
          },
        ]);
        const {first_name, last_name, role, manager} = answers;
        //check if role exists
        const roleExists = `SELECT id FROM role WHERE title = $1`;
        const roleValues = await this.connection.query(roleExists, [role]);
        if (roleValues.rows.length === 0) {
          console.log('Role does not exist! Please add role first.');
          this.startEtm();
          return;
        }
        //check if manager exists
        let manager_id = null;
        if (manager) {
          const managerExists = `SELECT id FROM employee WHERE first_name = $1 AND last_name = $2`;
          const managerNames = manager.split(' ');
          const managerValues = await this.connection.query(managerExists, [managerNames[0], managerNames[1]]);
          manager_id = managerValues.rows.length > 0 ? managerValues.rows[0].id : null;
        }
        const id = await this.generateEmployeeId();
        const query = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
          VALUES ($1, $2, $3, (SELECT id FROM role WHERE title = $4), $5)`;
        const values = [id, first_name, last_name, role, manager_id];

        await this.connection.query(query, values);
        console.log('Employee added!');
        this.startEtm();
      } catch (error) {
        console.error('Error adding employee: ', error);
      }
  }

//function for updating employee role
  async updateEmpRole(): Promise<void> {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'employee',
          message: 'Which employee would you like to update?',
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is the employee new role?',
          choices: await this.getRoleNames(),
        },
      ])
      const {employee, role} = answers;
      const query = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = $4) WHERE first_name = $2`;
      const values = [role, employee];
      this.connection.query(query, values, (err: any, _res: any) => {
        if (err) { console.error(err); 
          return; 
        }
        console.log('Employee role updated!');
        this.startEtm();
      });
    }
    catch (error) {
      console.error('Error updating employee role: ', error);
    }
  }

//function for getting department
  async getDept(): Promise<any[]> {
    try {
      const res = await this.connection.query('SELECT * FROM department');
      return res.rows;
    } catch (error) {
      console.error('Error getting department: ', error);
      return [];
    }
  }

  //function for getting department names
  async getDeptNames(): Promise<any[]> {
    try {
      const department = await this.getDept();
      const departmentNames = department.map((department: { name: any; }) => department.name);
      return departmentNames;
    } catch (error) {
      console.error('Error getting department names: ', error);
      return [];
    }
  }

  //function for getting role
  async addRole(): Promise<void> {
    try {
      const answers = await inquirer.prompt([
       {
          type: 'input',
          name: 'title',
          message: 'What is the role title?'
        },
        {
          type: 'list',
          name: 'department',
          message: 'What department is the role in?',
          choices: await this.getDeptNames(),
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the role salary?',
        },
      ])
        const {title, department, salary} = answers;
        const id = await this.generateEmployeeId();
        const query = `INSERT INTO role (id, title, salary, department_id) 
          VALUES ($1, $2, $3, (SELECT id FROM department WHERE name = $4))`;
        const values = [id, title, salary, department];
        this.connection.query(query, values, (err: any, _res: any) => {
          if (err) { console.error(err); 
            return; 
          }
          console.log('Role added!');
          this.startEtm();
        });
      } catch (error) {
        console.error('Error adding role: ', error);
      }
  }

  //function for adding department
  async addDept(): Promise<void> {
    try {
      const answers = await inquirer.prompt([
       {
          type: 'input',
          name: 'name',
          message: 'What is the name of the department?'
        },            
      ])
        const {name} = answers;
        const id = await this.generateEmployeeId();
        const query = `INSERT INTO department (id, name) VALUES ($1, $2)`;
        const values = [id, name];
        this.connection.query(query, values, (err: any, _res: any) => {
          if (err) { console.error(err); 
            return; 
          }
          console.log('Department added!');
          this.startEtm();
        });
      } catch (error) {
        console.error('Error adding department: ', error);
      }
  }

  //function for viewing all employees
  viewAllEmp(): void {
    this.getEmployee();
  }

  async getEmployee(): Promise<void> {
    await this.connection.query(
        `SELECT 
            employee.first_name, 
            employee.last_name, 
            role.title, 
            department.name AS department_name, 
            role.salary, 
            manager.first_name || ' ' || manager.last_name AS manager_name
        FROM 
            employee 
        JOIN 
            role ON employee.role_id = role.id
        JOIN 
            department ON role.department_id = department.id
        LEFT JOIN 
            employee AS manager ON employee.manager_id = manager.id;`, 
        (err: any, res: any) => {
            if (err) throw err;
            console.table(res.rows);   
            this.startEtm();
        });
  }

  // function for viewing all roles
  viewAllRole(): void {
    this.getRole();
  }

  async getRole(): Promise<void> {
    await this.connection.query(
      `SELECT 
        role.id,
        role.title,
        department.name AS department_name,  
        role.salary      
      FROM 
        role
      JOIN 
        department ON role.department_id = department.id`, 
      (err: any, res: any) => {
      if (err) throw err;
      console.table(res.rows);
      this.startEtm();
    });
  }


  async getRoleNames(): Promise<any[]> {
    try {
      const roles = await this.connection.query('SELECT title FROM role');
      return roles.rows.map(role => ({name: role.title, value: role.title}));
    } catch (error) {
      console.error('Error getting role names: ', error);
      return [];
    }
  }

  async getEmployeeNames(): Promise<any[]> {
    try {
      const managers = await this.connection.query(
        `SELECT 
          manager.first_name || ' ' || manager.last_name AS manager_name 
        FROM 
          employee AS manager 
        WHERE 
          manager.id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL);`
      );
      return managers.rows.map(manager => ({ name: manager.manager_name, value: manager.manager_name }));
    } catch (error) {
      console.error('Error getting manager names: ', error);
      return [];
    }
  }
  

  viewAllDept(): void {
    this.getDepartment();
  }
  async getDepartment(): Promise<void> {
    await this.connection.query( 
      `SELECT 
        department.id, 
        department.name 
      FROM department`, 
      (err: any, res: any) => {
      if (err) throw err;
      console.table(res.rows);
      this.startEtm();
    });
  }
   
  
  exit(): void {
    this.connection.end();
    console.log('Database connection closed. Goodbye!');
    process.exit(0);
  }

  }
  
  const tracker = new EmployeeTracker();
  tracker.connect().then(() => {
    tracker.startEtm();
  });

export default EmployeeTracker;