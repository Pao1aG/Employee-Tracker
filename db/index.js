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
     const {option} = await inquirer.prompt({
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
     });

     if(option === "View Departments") {
         console.log("We are going to do a read for department");
     } else if (option ===  "View Roles") {
        console.log("We are going to do a read for roles");
     } else if (option === "View Employees") {
        console.log("We are going to do a read for employees");
     } else if (option === "Add Department") {
        console.log("We are going to do a create for department");
     } else if (option === "Add Roles") {
        console.log("We are going to do a create for roles");
     } else if (option === "Add Employee") {
        console.log("We are going to do a create for employees");
     } else if (option === "Update Employee Roles") {
        console.log("We are going to do a update for employees");
     } else {
        console.log("Good bye!");
        process.exit(0);
     }
  };

  connection.connect((err) => {
    if (err) throw err;
    init();
  });