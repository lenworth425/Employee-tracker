INSERT INTO department (id, name)
    VALUES
        (01, 'Engineering'),
        (02, 'Finance'),
        (03, 'Legal'),
        (04, 'Sales'),
        (05, 'Marketing'),
        (06, 'Human Resources'),
        (07, 'Research and Development');
       
INSERT INTO role (id, title, salary, department_id)
    VALUES
        (1, 'Lead Engineer', 120000, 01),
        (2, 'Engineer', 100000, 01),
        (3, 'Accountant', 80000, 02),
        (4, 'Financial Analyst', 90000, 02),
        (5, 'Controller', 120000, 02),
        (6, 'Lawyer', 170000, 03),
        (7, 'Cheif Attorney', 210000, 03),
        (8, 'Sales Lead',  120000, 04),
        (9, 'Salesperson', 80000, 04),
        (10, 'Marketing Manager', 90000, 05),
        (11, 'Marketing Specialist', 80000, 05),
        (12, 'HR Director', 120000, 06),
        (13, 'HR Specialist', 80000, 06),
        (14, 'Research Director', 150000, 07),
        (15, 'Research Analyst', 90000, 07);
        

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
    VALUES 
        (201, 'John', 'Doe', 1, NULL),
        (202, 'Mike', 'Chan', 2, 201),
        (203, 'Ashley', 'Rodriguez', 2, 201),
        (204, 'Kevin', 'Tupik', 2, 201),
        (205, 'Kunal', 'Singh', 2, 201),
        (206, 'Malia', 'Brown', 2, 201),
        (207, 'Sarah', 'Lourd', 3, 209),
        (208, 'Tim', 'Allen', 4, 209),
        (209, 'Tina', 'Munson', 5, NULL),
        (210, 'Eric', 'Stevens', 6, 210),
        (211, 'Sam', 'Norton', 7, NULL),
        (212, 'Rick', 'Fish', 8, NULL),
        (213, 'Sammy', 'Green', 9, 212),
        (214, 'Tom', 'Hanks', 10, NULL),
        (215, 'Katie', 'Perri', 11, 214),
        (216, 'Brady', 'Pitts', 12, NULL),
        (217, 'Angelina', 'Jolie', 13, 216),
        (218, 'Gill', 'Bates', 14, NULL),
        (219, 'Elon', 'Must',  15, 218);  


