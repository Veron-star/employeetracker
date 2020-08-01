USE employee_db;

INSERT INTO department(department_name) 
VALUES 
("Human Resources"),
("Marketing"),
("Information Technology"),
("Corporate");

INSERT INTO role (title, salary, department_id) 
VALUES 
("Analyst", 70000, 3),
("Communications Associate", 50000, 2),
("Social Media Manager", 50000, 2),
("Director", 100000, 1),
("Director", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id) 
VALUES 
("Tom", "Cruise", 2),
("Katie", "Perry", 1),
("Ben", "Sherman", 3),
("Harry", "Porter", 4),
("Roger", "Federer", 5);