INSERT INTO departments (id, name)
    VALUES
        (1, 'Engineering'),
        (2, 'Finance'),
        (3, 'Legal'),
        (4, 'Sales');
        (5, 'Marketing');
        (6, 'Human Resources');
        (7, 'Research and Development');
       
INSERT INTO roles (id, title, salary, department_id)
    VALUES
        (1, 'Lead Engineer', 120000, 1),
        (2, 'Engineer', 100000, 1),
        (3, 'Accountant', 80000, 2),
        (4, 'Financial Analyst', 90000, 2),
        (5, 'Controller', 120000, 2),
        (6, 'Legal Team Lead', 'Legal', 270000, 3),
        (7, 'Attorney', 'Legal', 190000, 3),
        (8, 'Sales Lead', 'Sales', 120000, 4),
        (9, 'Salesperson', 'Sales', 80000, 4),
        (10, 'Marketing Manager', 'Marketing', 90000, 5),
        (11, 'Marketing Specialist', 'Marketing', 80000, 5),
        (12, 'HR Director', 'Human Resources', 120000, 6),
        (13, 'HR Specialist', 'Human Resources', 80000, 6),
        (14, 'Research Director', 'Research and Development', 150000, 7),
        (15, 'Research Analyst', 'Research and Development', 90000, 7);
        

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
    VALUES 
        (1, 'John', 'Doe', 1, NULL),
        (2, 'Mike', 'Chan', 2, 1),
        (3, 'Ashley', 'Rodriguez', 2, 1),
        (4, 'Kevin', 'Tupik', 2, 1),
        (5, 'Kunal', 'Singh', 2, 1),
        (6, 'Malia', 'Brown', 2, 1),
        (7, 'Sarah', 'Lourd', 3, 9),
        (8, 'Tim', 'Allen', 4, 9),
        (9, 'Tina', 'Munson', 5, NULL),
        (10, 'Eric', 'Stevens', 6, NULL),
        (11, 'Sam', 'Norton', 6, 10),
        (12, 'Rick', 'Fish', 8, NULL),
        (13, 'Sammy', 'Green', 9, 12),
        (14, 'Tom', 'Hanks', 10, NULL),
        (15, 'Katie', 'Perri', 11, 14),
        (16, 'Brady', 'Pitts', 12, NULL),
        (17, 'Angelina', 'Jolie', 13, 16),
        (18, 'Gill', 'Bates', 14, NULL),
        (19, 'Elon', 'Must',  15, 18);  
    