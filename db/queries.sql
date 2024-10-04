SELECT  * 
FROM department_id;

SELECT 
    department.name, 
    role.title, 
    role.salary
FROM 
    department
JOIN 
    role ON department.id = role.department_id
JOIN 
    employee ON role.id = employee.role_id;

SELECT 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name, 
    role.salary, 
    manager.first_name AS manager_first_name,
    manager.last_name AS manager_last_name
from 
    department 
JOIN 
    role ON department.id = role.department_id
JOIN 
    employee ON role.id = employee.role_id;
LEFT JOIN 
    employee AS manager ON employee.manager_id = manager.id;


