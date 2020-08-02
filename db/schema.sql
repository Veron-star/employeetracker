DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE role (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  INDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);
CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  INDEX role_ind (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

USE employees_db;
INSERT INTO department(name)
VALUES
    ('Human Resources'),
    ('Engineering'),
    ('Sales Department'),
    ('Management');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Manager', 110000, 1),
    ('Career coach', 100000, 1),
    ('Principal Engineer', 150000, 2),
    ('Assistant Engineer', 80000, 2),
    ('Sales Manager', 70000, 3),
    ('Sales Specialist', 60000, 3),
    ('CEO', 200000, 4),
    ('Receptionist', 50000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Chris', 'Hempsworth', 1, NULL),
    ('Tom', 'Cruise', 2, 1),
    ('Miranda', 'Kerr', 3, NULL),
    ('Hugh', 'Jackman', 4, 3),
    ('Harry', 'Porter', 5, NULL),
    ('Jonny', 'Depp', 6, 5),
    ('Taylor', 'Swift', 7, NULL),
    ('Katie', 'Holmes', 8, 7);