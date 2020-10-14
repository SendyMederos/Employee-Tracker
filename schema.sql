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