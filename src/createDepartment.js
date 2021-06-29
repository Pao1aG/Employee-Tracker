const inquirer = require("inquirer");
const connection = require("../db/connection");

module.exports = function createDepartment () {
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

