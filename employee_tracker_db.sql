DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE departments (
  id int AUTO_INCREMENT,
  department varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE roles (
  id int AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  salary DECIMAL,
  department_id int NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE employee (
  id int AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id int NOT NULL,
  manager_id int,
  PRIMARY KEY(id)
);


INSERT INTO departments (department)
VALUES ("Sales");
INSERT INTO departments (department)
VALUES ("Engineering");
INSERT INTO departments (department)
VALUES ("Finance");
INSERT INTO departments (department)
VALUES ("Legal");


INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 125000, 3);	
INSERT INTO roles (title, salary, department_id)
VALUES ("Bookkeeper", 80000, 3);	
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Rep", 80000, 1);	
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 10000, 1);	
INSERT INTO roles (title, salary, department_id)
VALUES ("Engineer", 120000, 2);	
INSERT INTO roles (title, salary, department_id)
VALUES ("Head Engineer",15000, 2);	
INSERT INTO roles (title, salary, department_id)
VALUES ("Lawyer", 200000, 4);
INSERT INTO roles (title, salary, department_id)
VALUES ("Paralegal", 100000, 4);	


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Katherine", "Johnson", 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Neri", "Oxman", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Federico", "Lorca", 8, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Yma", "Sumac", 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Maya", "Angelou", 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Victoria", "Woodhull", 5, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lang", "Lang", 5, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Konstantin", "Stanislavski", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Frederic", "Chopin", 2, 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Juan", "Fangio", 2, 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Edgar", "Poe", 2, 8);

