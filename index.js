const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Covid19_2020",
  database: "employee_tracker_db"
});

connection.connect(function (err) {
  if (err) throw err;
  execute();
});

function execute() {
  inquirer
    .prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all Employees",
        "View all Employees by Department",
        "View all Employees by Manager",
        "View Departments",
        "View Roles",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee's Role",
        "Update Employee's Manager",
        "Remove Employee",
        "Remove Departments",
        "Remove Roles",
        "View Department Utilized Budget"
      ]
    })
    .then(function (answer) {
      switch (answer.menu) {
        case "View all Employees":
          viewAllEmp();
          break;

        case "View all Employees by Department":
          viewAllEmpDep();
          break;

        case "View all Employees by Manager":
          viewAllEmpMg();
          break;

        case "View Departments":
          viewDepartments()
          break;

        case "View Roles":
          viewRoles()
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmp();
          break;

        case "Remove Employee":
          removeEmp();
          break;

        case "Remove Departments":
          removeDep();
          break;

        case "Remove Roles":
          removeRoles();
          break;

        case "Update Employee's Role":
          updateEmpRole();
          break;

        case "Update Employee's Manager":
          updateEmpMg();
          break;

        case "View Department Utilized Budget":
          viewBudget();
          break;
      }
    });
}

////View all Employees

function viewAllEmp() {
  let query = `SELECT CONCAT_WS(' ', a.first_name, a.last_name) as employees, roles.title, roles.salary, departments.department, b.last_name as manager
    FROM ((employee a
    LEFT JOIN employee b ON a.manager_id = b.id
    INNER JOIN roles ON a.role_id = roles.id)
    INNER JOIN departments ON roles.department_id = departments.id)`

  connection.query(query, function (err, res) {
    var table = cTable.getTable(res)
    console.log(table)
    execute();
  });
}
////View all Employees by Department
function viewAllEmpDep() {
  let query = `SELECT departments.department, CONCAT_WS(' ', a.first_name, a.last_name) as employees, roles.title, roles.salary, b.last_name as manager
    FROM ((employee a
    LEFT JOIN employee b ON a.manager_id = b.id
    INNER JOIN roles ON a.role_id = roles.id)
    INNER JOIN departments ON roles.department_id = departments.id)
    ORDER BY departments.department`;
  connection.query(query, function (err, res) {
    var table = cTable.getTable(res)
    console.log(table)
    execute();
  });
}
///View all Employees by Manager
function viewAllEmpMg() {
  let query = `SELECT CONCAT_WS(' ', a.first_name, a.last_name) as employees, roles.title, departments.department, CONCAT_WS(', ', b.last_name, b.first_name) as manager
    FROM ((employee a
    LEFT JOIN employee b ON a.manager_id = b.id
    INNER JOIN roles ON a.role_id = roles.id)
    INNER JOIN departments ON roles.department_id = departments.id)
    ORDER BY manager`
  connection.query(query, function (err, res) {
    var table = cTable.getTable(res)
    console.log(table)
    execute();
  });
}
//// view Departments
function viewDepartments() {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    var table = cTable.getTable(res)
    console.log(table)
    execute();
  });
}
//// view Roles 
function viewRoles() {
  let query = `SELECT roles.id, roles.title, roles.salary, departments.department 
              FROM roles
              INNER JOIN departments ON roles.department_id = departments.id`
  connection.query(query, function (err, res) {
    var table = cTable.getTable(res)
    console.log(table)
    execute();
  });
}


//// add department
function addDepartment() {
  inquirer.prompt([
    {
      name: "depName",
      type: "input",
      message: "Enter the new Department: "
    }
  ]).then(function (answer) {
    var query = "INSERT INTO departments SET ? "
    connection.query(query, { department: answer.depName }, function (err, res) {
      if (err) return console.log(err)
      console.log(`${answer.depName} was added to Departments`)
      execute();
    })
  })

}
//// add roles
function addRole() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "Enter the new Role's Title: "
      },
      {
        name: "salary",
        type: "input",
        message: "Enter the new Role's Salaray: "
      },
      {
        name: "department",
        type: "list",
        message: "Select a department for the new role",
        choices: function () {
          var depArray = [];
          for (let i = 0; i < res.length; i++) {
            depArray.push(res[i].department)
          }
          return depArray
        }
      }

    ]).then(function (answer) {
      var depID;
      var promise = new Promise(function (resolve, reject) {
        connection.query("SELECT id FROM departments WHERE department = ?", [answer.department], function (err, res) {
          if (err) console.log(err)
          depID = res[0].id
          resolve()
        })
      })
      promise.then(function () {
        connection.query("INSERT INTO roles SET ? ",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: depID
          },
          function (err, res) {
            if (err) return console.log(err)
            console.log(`${answer.title} was added to Roles`)
            execute();
          })
      })
    })
  })
}
/// Add Employee
function addEmp() {

  connection.query(`SELECT * FROM (employee 
                INNER JOIN roles ON employee.role_id = roles.id
                INNER JOIN departments ON roles.department_id = departments.id)`,
    function (err, res) {
      if (err) throw err;
      inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter the New employee first name: "
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter the New employee last name: "
        },
        {
          name: "role",
          type: "list",
          message: "What is this employee role?",
          choices: function () {
            var roleArray = [];
            for (let i = 0; i < res.length; i++) {
              roleArray.push(res[i].title)
            }
            return [...new Set(roleArray)];
          }
        },
        {
          name: "manager",
          type: "list",
          message: "Who is this employee's manager?",
          choices: function () {
            var managerArray = [];
            for (let i = 0; i < res.length; i++) {
              managerArray.push(res[i].first_name)
            }
            return managerArray
          }
        }
      ]).then(function (answer) {
        var empID;
        var roleID
        var promise = new Promise(function (resolve, reject) {
          connection.query("SELECT id FROM roles WHERE title = ?", [answer.role], function (err, res) {
            if (err) console.log(err)
            roleID = res[0].id
            connection.query("SELECT id FROM employee WHERE first_name = ?", [answer.manager], function (err, res) {
              if (err) console.log(err)
              empID = res[0].id
              resolve()
            })
          })
        })
        promise.then(function () {
          var query = "INSERT INTO employee SET ? "
          connection.query(query,
            {
              first_name: answer.firstName,
              last_name: answer.lastName,
              role_id: roleID,
              manager_id: empID
            }, function (err, res) {
              if (err) return console.log(err)
              console.log(`${answer.firstName} was added to Employee`)
              execute();
            })
        })
      })
    });
}


///Update Employee Role
function updateEmpRole() {
  var query = `SELECT employee.first_name, employee.last_name, roles.title
                  FROM employee 
                  RIGHT JOIN roles ON employee.role_id = roles.id`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "emp",
        type: "list",
        message: "Whose role are you updating?",
        choices: function () {
          var empArray = [];
          for (let i = 0; i < res.length; i++) {
            empArray.push(res[i].first_name + ' ' + res[i].last_name)
          }
          return empArray.filter((val) => val !== null)
        }
      },
      {
        name: "role",
        type: "list",
        message: "Select a new role",
        choices: function () {
          var roleArray = [];
          for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title)
          }
          return [...new Set(roleArray)]
        }
      }
    ]).then(function (answer) {
      var roleID
      var employeeToUpdate = answer.emp.substring(0, answer.emp.indexOf(' '))
      var promise = new Promise(function (resolve, reject) {
        connection.query("SELECT id FROM roles WHERE title = ?", [answer.role], function (err, res) {
          if (err) console.log(err)
          roleID = res[0].id
          resolve()
        })
      })
      promise.then(function () {
        connection.query("UPDATE employee SET ? WHERE ?",
          [
            {
              role_id: roleID
            },
            {
              first_name: employeeToUpdate
            }
          ], function (err, res) {
            if (err) throw err;
            console.log(`${answer.emp} is now a ${answer.role}.`)
            execute();
          })
      })
    })
  })
}
////// update employee manager
function updateEmpMg() {
  var query = `SELECT first_name, last_name FROM employee`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "emp",
        type: "list",
        message: "Whose manager are you updating?",
        choices: function () {
          var empArray = [];
          for (let i = 0; i < res.length; i++) {
            empArray.push(res[i].first_name + ' ' + res[i].last_name)
          }
          return empArray
        }
      },
      {
        name: "manager",
        type: "list",
        message: "Who is this employee's new manager?",
        choices: function () {
          var managerArray = [];
          for (let i = 0; i < res.length; i++) {
            managerArray.push(res[i].first_name + ' ' + res[i].last_name)
          }
          return managerArray
        }
      }
    ]).then(function (answer) {
      var managerID
      var employeeToUpdate = answer.emp.substring(0, answer.emp.indexOf(' '))
      var promise = new Promise(function (resolve, reject) {
        connection.query("SELECT id FROM employee WHERE first_name = ?", [answer.manager.substring(0, answer.manager.indexOf(' '))], function (err, res) {
          if (err) console.log(err)
          managerID = res[0].id
          resolve()
        })
      })
      promise.then(function () {
        console.log(managerID)
        console.log(employeeToUpdate)
        connection.query("UPDATE employee SET ? WHERE ?",
          [
            {
              manager_id: managerID
            },
            {
              first_name: employeeToUpdate
            }
          ], function (err, res) {
            if (err) throw err;
            console.log(`${answer.emp}'s manager is now ${answer.manager}.`)
            execute();
          })
      })
    })
  })
}

/// delete empoyee
function removeEmp() {
  connection.query(`SELECT employee.first_name, employee.last_name FROM employee`, function (err, res) {
    if (err) throw err
    inquirer.prompt(
      {
        name: "emp",
        type: "list",
        message: "Who are you deleting?",
        choices: function () {
          var empArray = [];
          for (let i = 0; i < res.length; i++) {
            empArray.push(res[i].first_name + ' ' + res[i].last_name)
          }
          return empArray.filter((val) => val !== null)
        }
      },
    ).then(function (answer) {
      employeeToDelete = answer.emp.split(' ')
      connection.query(`DELETE FROM employee WHERE first_name = "${employeeToDelete[0]}" AND last_name = "${employeeToDelete[1]}"`, function (err) {
        if (err) throw err
        execute()
      })
    })
  })
}

/// delete depatment 
function removeDep() {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err
    inquirer.prompt(
      {
        name: "dep",
        type: "list",
        message: "What department are you deleting?",
        choices: function () {
          var depArray = [];
          for (let i = 0; i < res.length; i++) {
            depArray.push(res[i].department)
          }
          return depArray
        }
      },
    ).then(function (answer) {
      connection.query(`DELETE FROM departments WHERE department = "${answer.dep}"`, function (err) {
        if (err) throw err
        execute()
      })
    })
  })
}

/// delete roles 
function removeRoles() {
  connection.query(`SELECT * FROM roles`, function (err, res) {
    if (err) throw err
    inquirer.prompt(
      {
        name: "role",
        type: "list",
        message: "What role are you deleting?",
        choices: function () {
          var roleArray = [];
          for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title)
          }
          return roleArray
        }
      },
    ).then(function (answer) {
      connection.query(`DELETE FROM roles WHERE title = "${answer.role}"`, function (err) {
        if (err) throw err
        execute()
      })
    })
  })
}
//// view total budeget of a department
function viewBudget() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    inquirer.prompt(
      {
        name: "department",
        type: "list",
        message: "Select a department for the new role",
        choices: function () {
          var depArray = [];
          for (let i = 0; i < res.length; i++) {
            depArray.push(res[i].department)
          }
          return depArray
        }
      }
    ).then(function (answer) {
      var depID;
      var promise = new Promise(function (resolve, reject) {
        connection.query("SELECT id FROM departments WHERE department = ?", [answer.department], function (err, res) {
          if (err) console.log(err)
          depID = res[0].id
          resolve()
        })
      })
      promise.then(function () {
        connection.query(`SELECT  salary FROM (employee 
          INNER JOIN roles ON employee.role_id = roles.id
          INNER JOIN departments ON roles.department_id = departments.id)
          WHERE roles.department_id = "${depID}" `, function (err, res) {
          console.log(` The total budget expenditure for the ${answer.department} department is $${res.map(x => x.salary).reduce((a, b) => a + b)}`)
          }
        )
        connection.query(`SELECT employee.id, roles.title, roles.salary, departments.department FROM employee
                          INNER JOIN roles ON employee.role_id = roles.id
                          JOIN departments ON roles.department_id = departments.id
                          WHERE roles.department_id =${depID}`, function(err, res) {
                            var table = cTable.getTable(res)
                            console.log(table)
                            execute(); 
                          })
      })
    })
  })
}