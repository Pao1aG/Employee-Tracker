const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require("./connection");
const createDepartment = require("../src/createDepartment");

// const connection = mysql.createConnection({
//     host: "localhost",
  
//     // Your port; if not 3306
//     port: 3306,
  
//     // Your username
//     user: "root",
  
//     // Be sure to update with your own MySQL password!
//     password: "",
//     database: "employees",
// });


  function init() {
     inquirer.prompt({
         type: "list",
         name: "option",
         message: "What would you like to do?",
         choices: [
                "View Departments",
                "View Roles",
                "View Employees",        
                "Add Department",
                "Add Roles",
                "Add Employee",
                "Update Employee Roles",
                "EXIT"
                ],
     }).then(function(data) {
         if(data.option === "View Departments") {
            readDepartment();
         } else if (data.option ===  "View Roles") {
            readRoles();
         } else if (data.option === "View Employees") {
            readEmployees();
         } else if (data.option === "Add Department") {
            createDepartment();
         } else if (data.option === "Add Roles") {
            createRole();
         } else if (data.option === "Add Employee") {
            createEmployee();
         } else if (data.option === "Update Employee Roles") {
            updateRole();
         } else {
            console.log("Good bye!");
            process.exit(0);
         };
     });
  };

  function readDepartment() {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.log("Here are the current departments-------");
        console.table(data);
        init();
    });
  };

  function readRoles() {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
        console.log("Here are the current employee roles-------");
        console.table(data);
        init();
    });
  };

  function readEmployees() {
    connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
        console.log("Here are the current employees-------");
        console.table(data);
        init();
    });
  };

//   function createDepartment () {
//     inquirer.prompt({
//         type:"input",
//         name:"deptName",
//         message:"What is the department name?"
//     }).then(function(data) {
//         connection.query(
//             "INSERT INTO department SET ?",
//             {
//                 name: data.deptName
//             }
//             );
//         console.log("Updating department list-------");
//         readDepartment();
//     });
//   };

  function createRole () {
    inquirer.prompt([
        {
        type:"input",
        name:"title",
        message:"What is the role title?"
        },
        {
        type:"input",
        name:"salary",
        message:"What is the role salary?"
        },
        {
        type:"input",
        name:"departmentID",
        message:"What is the department id for this role?"
        }
    ]).then(function(data) {
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: data.title,
                salary: data.salary,
                department_id: data.departmentID
            }
            );
        console.log("Updating roles list-------");
        readRoles();
    });
  };

  function createEmployee () {
    inquirer.prompt([
        {
        type:"input",
        name:"firstName",
        message:"What is the employee's first name?"
        },
        {
        type:"input",
        name:"lastName",
        message:"What is the employee's last name?"
        },
        {
        type:"input",
        name:"roleID",
        message:"What is the employee's role id?"
        },
        {
        type:"input",
        name:"managerID",
        message:"What is the employee's manager id?"
        }
    ]).then(function(data) {
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: data.firstName,
                last_name: data.lastName,
                role_id: data.roleID,
                manager_id: data.managerID || null 
            }
            );
        console.log("Updating employee list-------");
        readEmployees();
    });
  };

  function updateRole() {
    connection.query("SELECT * FROM role", (err, data) => {
        if(err) throw err;
        // console.log(data);
        const choices = data.map((role) => (role.title));
        console.log(choices);

        inquirer.prompt([
              {
                  type:"list",
                  name:"update",
                  message:"Which role would you like to update?",
                  choices: choices
              },
              {
                  type:"input",
                  name:"newRole",
                  message:"What would you like to rename this role?"
              },
          ])
          .then(function(data){
            console.log(data.newRole);
            connection.query(`UPDATE role SET ? WHERE ?`, 
                [
                    {title: `${data.newRole}`}, 
                    {title: `${data.update}`}
                ], 
                (err, res) => {
                    if (err) throw err;
                    console.log(res);
                readRoles();
            }); 
          });
    });
  };


  connection.connect((err) => {
    if (err) throw err;
    init();
  });