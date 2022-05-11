const express = require('express');
// Require mysql2
const mysql = require('mysql2');
// Require inquirer
const inquirer = require('inquirer')


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password1',
    database: 'employeeInfo_db'
  },
  console.log(`Connected to the employeeInfo_db database.`)
);

//================== Initial Prompt =======================//
function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "View All Employees", 
              "View All Roles",
              "View all Deparments", 
              "View all employees by Department",
              "Update Employee Role",
              "Add Employee",
              "Add Role",
              "Add Department",
              "Remove employee",
              "Remove department",
              "Remove role",
              "Exit"
            ]
    }
]).then(function(val) {
    if (answers.choice === "View All Employees") {
        console.log(answers.choice)
        viewEmployees();

    } 
    if(answers.choice === "View All Roles") {
        console.log(answers.choice)
        viewEmployeesByRole();
    }
    if(answers.choice === "View all employees by Department") {
        console.log(answers.choice)
        viewEmployeesByDepartment();
    }
    if(answers.choice ===  "View all Deparments"){
        console.log(answers.choice)
        viewAllDepartment();
    }
    if (answers.choice === "Update Employee Role") {
        console.log(answers.choice)
        updateEmployeeRole();
    }
    if(answers.choice === "Add Employee") {
        console.log(answers.choice)
        addEmployee();
    }
    if(answers.choice === "Add Role") {
        console.log(answers.choice)
        addRole();
    }
    if (answers.choice === "Add Department") {
        console.log(answers.choice)
        addDepartment();
    }
    if (answers.choice ===  "Remove employee") {
        console.log(answers.choice)
        removeEmployee();
    }
    if (answers.choice ===  "Remove department") {
        console.log(answers.choice)
        removeDepartment();
    }
    if (answers.choice ===  "Remove role") {
        console.log(answers.choice)
        removeRole();
    } 
    if (answers.choice === "Exit")
        connection.end();

    })
}


function viewEmployees() {}

function viewEmployeesByRole() {}

function viewEmployeesByDepartment(){}

function viewAllDepartment(){}

function updateEmployeeRole(){}

function addEmployee(){}

function addRole(){}

function addDepartment(){}

function removeEmployee(){}

function removeDepartment(){}

function removeRole(){}




// Listening at PORT for requests
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));