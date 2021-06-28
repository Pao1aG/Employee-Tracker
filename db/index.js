const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Be sure to update with your own MySQL password!
    password: "",
    database: "employees",
});


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
                ],
     }).then(function(data) {
         if(data.option === "View Departments") {
             console.log("Here are the available departments ");
             readDepartment();
         } else if (data.option ===  "View Roles") {
            console.log("Here are the available employee roles ");
            readRoles();
         } else if (data.option === "View Employees") {
            console.log("Here are the current employees ");
            readEmployees();
         } else if (data.option === "Add Department") {
            console.log("We are going to do a create for department");
         } else if (data.option === "Add Roles") {
            console.log("We are going to do a create for roles");
         } else if (data.option === "Add Employee") {
            console.log("We are going to do a create for employees");
         } else if (data.option === "Update Employee Roles") {
            console.log("We are going to do a update for employees");
         } else {
            console.log("Good bye!");
            process.exit(0);
         };
     });
  };

  function readDepartment() {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
  };

  function readRoles() {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
  };

  function readEmployees() {
    connection.query("SELECT * FROM employee", (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    });
  };

  connection.connect((err) => {
    if (err) throw err;
    init();
  });