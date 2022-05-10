const express = require('express');
// Require mysql2
const mysql = require('mysql2');
// Require inquirer
const inquirer = require('inquirer')


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password1',
    database: 'employees_db'
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
              "View All Employees?", 
              "View All Employee's By Roles?",
              "View all Emplyees By Deparments", 
              "Update Employee",
              "Add Employee?",
              "Add Role?",
              "Add Department?"
            ]
    }
]).then(function(val) {
    if (answers.choice === "View All Employees?") {
        console.log(answers.choice)
    }else {
        console.log("other")
    }

    })
}



// Listening at PORT for requests
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));