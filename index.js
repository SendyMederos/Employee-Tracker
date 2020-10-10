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

connection.connect(function(err) {
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
        "Add Department",
        "Add Role",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager"
      ]
    })
    .then(function(answer) {
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

      case "Update Employee Role":
        updateEmpRole();
        break;

      case "Update Employee Manager":
        updateEmpMg();
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

    connection.query(query,  function(err, res) {
      var table = cTable.getTable(res)
      console.log(table) 
      console.log("test")
     execute();
  });
}
////View all Employees by Department
function viewAllEmpDep() {
    let query = `SELECT CONCAT_WS(' ', a.first_name, a.last_name) as employees, roles.title, roles.salary, departments.department, b.last_name as manager
    FROM ((employee a
    LEFT JOIN employee b ON a.manager_id = b.id
    INNER JOIN roles ON a.role_id = roles.id)
    INNER JOIN departments ON roles.department_id = departments.id)
    ORDER BY departments.department`;
    connection.query(query,  function(err, res) {
      var table = cTable.getTable(res)
      console.log(table) 
      console.log("test")
      execute();
  });
}
///View all Employees by Manager
function viewAllEmpMg() {
    let query = `SELECT CONCAT_WS(' ', a.first_name, a.last_name) as employees, roles.title, roles.salary, departments.department, b.last_name as manager
    FROM ((employee a
    LEFT JOIN employee b ON a.manager_id = b.id
    INNER JOIN roles ON a.role_id = roles.id)
    INNER JOIN departments ON roles.department_id = departments.id)
    ORDER BY manager`
    connection.query(query,  function(err, res) {
      var table = cTable.getTable(res)
      console.log(table) 
      console.log("test")
    execute();
  });
}
//// add department
function addDepartment () {
  inquirer.prompt([
    {
      name: "depName",
      type: "input",
      message: "Enter the new Department: "
    }
    ]).then(function(answer) {
       var query= "INSERT INTO departments SET ? "
       connection.query(query, {department: answer.depName}, function (err, res){
         if(err)  return console.log(err)
         console.log(`${answer.depName} was added to Departments`)
         execute();
        })
    })
    
}
//// add roles
function addRole () {
  connection.query("SELECT * FROM departments", function(err, res) {
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
      name:"department",
      type: "list",
      message:"Select a department for the new role",
      choices: function(){
        var depArray = [];  
        for(let i =0; i < res.length; i++){
          depArray.push(res[i].department)
        }
        return depArray
      }
    }

    ]).then(function(answer) {
      var depID;
      var promise = new Promise(function (resolve, reject){ 
                              connection.query("SELECT id FROM departments WHERE department = ?", [answer.department], function(err, res) {
                              if (err) console.log(err)
                              depID = res[0].id
                              resolve()
                               })})
                               promise.then(function(){
       connection.query("INSERT INTO roles SET ? ", 
        {
          title: answer.title,
          salary: answer.salary,                 
          department_id: depID
        },
         function (err, res){
         if(err)  return console.log(err)
         console.log(`${answer.title} was added to Roles`)
         execute();
        })
     })
  })
})
}
/// Add Employee
function addEmp() {

  connection.query( `SELECT * FROM (employee 
                INNER JOIN roles ON employee.role_id = roles.id
                INNER JOIN departments ON roles.department_id = departments.id)`, 
  function(err, res) {
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
          name:"role",
          type:"list", 
          message:"What is this employee role?",
          choices: function(){
            var roleArray = [];  
            for(let i =0; i < res.length; i++){
              roleArray.push(res[i].title)
            }
            return roleArray
          }
        },
        {
          name:"manager",
          type:"list", 
          message:"Who is this employee's manager?",
          choices: function(){
            var managerArray = [];  
            for(let i =0; i < res.length; i++){
              managerArray.push(res[i].first_name)
            }
            return managerArray
          }
        }
      ]).then(function(answer) {
        var empID;
        var roleID
        var promise = new Promise(function (resolve, reject){ 
                                connection.query("SELECT id FROM roles WHERE title = ?", [answer.role], function(err, res) {
                                 if (err) console.log(err)
                                 roleID = res[0].id
                                 connection.query("SELECT id FROM employee WHERE first_name = ?", [answer.manager], function(err, res) {
                                  if (err) console.log(err)
                                  empID = res[0].id
                                 resolve()
                                })})})
                                 promise.then(function(){
                                   console.log(empID)
                                   console.log(roleID)
        var query= "INSERT INTO employee SET ? "
        connection.query(query,
           {
             first_name: answer.firstName,
             last_name: answer.lastName,
             role_id: roleID,
             manager_id: empID
            }, function (err, res){
          if(err)  return console.log(err)
          console.log(`${answer.firstName} was added to Employee`)
          execute(); 
         })
      })
    })
  });
      
     
 }

///Remove Employee
function removeEmp() {
    var query = "SELECT * FROM employee INNER JOIN roles ON (employee.role_id = role.id INNER JOIN ()";
    connection.query(query,  function(err, res) {
    
    execute();
  });
}

/// roles array
function rolesList () {
  var queryRole = "SELECT title FROM roles";
  connection.query(queryRole,  function(err, res) {
      if (err) throw err;
      var rolesArray = []; 
      res.forEach( x => rolesArray.push(x));
  });
  return rolesArray;
}

/// department array
function departmentList () {
  var queryDep = "SELECT name FROM departments";
  connection.query(queryDep,  function(err, res) {
      if (err) throw err;
      var departmentArray = []; 
      res.forEach( x => departmentArray.push(x));
  });
  return departmentArray;
}

//// employee list
function employeeList () {
    var queryEmp = "SELECT first_name FROM employee";
    connection.query(queryEmp,  function(err, res) {
        if (err) throw err;
        //var empArray = []; 
        res.forEach( x => empArray.push(x));
    });
    return empArray;
}

var empArray = []; 

///Update Employee Role
function updateEmpRole() {
    var queryRoles = "SELECT title FROM roles";
    connection.query(queryRoles,  function(err, res) {
        if (err) throw err;
        var rolesArray = []; 
        res.forEach( x => rolesArray.push(x));
    });
    employeeList()
        .then(function () {
        inquirer.prompt([
            {
                name: "emp",
                type: "rawlist",
                message: "Who are you updatting? : ",
                choices: empArray
            },
            {
                name: "empRole",
                type: "rawlist",
                message: "Select new role: ",
                choices: rolesArray
            }  
            //// uppdating db
        ]).then( function(answer) {
            connection.query("SELECT id FROM role WHERE ?", {title: answer.emplRole},  function(err, res) {
                var newId = res;
        })
            }).then( function(answer) {
                connection.query("UPDATE employee SET ? WHERE ?",
                    [
                        {
                            role_id: newId
                        },
                        {
                            first_name: answer.emp
                        }
                    ],function(err) { 
                        if (err) throw err;
                })
            })  
            execute();  
    })
}



/////////////////////////////////////

//  function employeeList() {
//   var queryEmp = "SELECT * FROM employee";
//     connection.query(queryEmp, function(err, res) {
//     //  if (err) throw err;
//     var empArray = []; 
//   () => { 
//       for(let i =0; i < res.length; i++){
//         empArray.push(res[i].first_name)
//       }
//     }
//   });
//  return empArray
// };

// // var queryRoles = "SELECT title FROM roles";
// //     connection.query(queryRoles,  function(err, res) {
// //         if (err) throw err;
// //         var rolesArray = []; 
// //         res.forEach( x => rolesArray.push(x));
// //     });
////////////////////////////////////////////////////////////////////////
// function init() {
//     //prints the items for sale and info 
//     connection.query('SELECT * FROM Products', function (err, res) {
//       for (var i = 0; i < res.length; i++) {
//         console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name
//           + " | " + "Price: " + res[i].price + " | " + "QTY: " + res[i].stock_quantity);
//         console.log('--------------------------------------------------------------------------------------------------')
//         if (err) throw err;
//       }
///////////////////////////////////////////////////////////////////////
// function songSearch() {
//   inquirer
//     .prompt({
//       name: "song",
//       type: "input",
//       message: "What song would you like to look for?"
//     })
//     .then(function(answer) {
//       console.log(answer.song);
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || Artist: " +
//             res[0].artist +
//             " || Year: " +
//             res[0].year
//         );
//         runSearch();
//       });
//     });
// }

// function songAndAlbumSearch() {
//   inquirer
//     .prompt({
//       name: "artist",
//       type: "input",
//       message: "What artist would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
//       query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
//       query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

//       connection.query(query, [answer.artist, answer.artist], function(err, res) {
//         console.log(res.length + " matches found!");
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             i+1 + ".) " +
//               "Year: " +
//               res[i].year +
//               " Album Position: " +
//               res[i].position +
//               " || Artist: " +
//               res[i].artist +
//               " || Song: " +
//               res[i].song +
//               " || Album: " +
//               res[i].album
//           );
//         }

//         runSearch();
//       });
//     });
// }
