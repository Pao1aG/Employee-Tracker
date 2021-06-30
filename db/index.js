const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require("./connection");

  function init() {
     inquirer.prompt({
         type: "list",
         name: "option",
         message: "What would you like to do?",
         choices: [
                "View Departments",
                "View Roles",
                "View Employees",
                "View Employees by Manager",        
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
         } else if (data.option === "View Employees by Manager") {
            readEmployeesMng();
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

//   Need to do a join here, look at books.sql
  function readEmployeesMng() {
    connection.query("SELECT * FROM employee",(err, data) => {
        if (err) throw err;

        // console.table(data);
        //DATA FROM TABLE EMPLOYEE
        if(data.manager_id !== null) {
            const managers = data.filter((manager) => manager.manager_id !== null);
            // console.log(managers);

            const choices = managers.map((name) => (`${name.last_name}`));
            //, ${name.id}
            console.log(choices);

            inquirer.prompt({
                type:"list",
                name:"managers",
                message:"Which manager's employees would you like to see?",
                choices: choices
            }).then(function(data) {
                console.log(data);
                //Last name of employee
                const lastName = data.managers;
                console.log(lastName);

                //Grabbing the manager id based on last name
                connection.query(`SELECT manager_id FROM employee WHERE last_name = "${lastName}"`,(err, managerID) => {
                    if (err) throw err;
                    console.log(managerID);
                });

                connection.query(
                    // SELECT employee.id, employee.first_name, employee.last_name, department.name 
                    //AS department, role.title FROM employee 
                    //LEFT JOIN role on role.id = employee.role_id 
                    //LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?
                    `SELECT * FROM employee WHERE last_name = "${lastName}" OR manager_id = role_id`,
                    (err, res) => {
                    if(err) throw err;
                    console.log(`I am selecting the table info for ${lastName}`);
                    const managerTable = res;
                    console.table(managerTable);
                    // connection.query(
                    //     `SELECT * FROM ${managerTable} 
                    //     INNER JOIN employee ON ${managerTable.manager_id} = role_id`,
                    // (err,res) => {
                    //     if(err) throw err;
                    //     console.log("I am making table with employees-----");
                    //     console.table(res);
                    // });
                    connection.end();
                });
               
               
            });
        } else {
            console.log("No managers have been added");
        };
    });
    // init();
  };

  function createDepartment () {
    inquirer.prompt({
        type:"input",
        name:"deptName",
        message:"What is the department name?"
    }).then(function(data) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: data.deptName
            }
            );
        console.log("Updating department list-------");
        readDepartment();
    });
  };

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