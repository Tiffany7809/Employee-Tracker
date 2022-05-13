const express = require('express');
// Require mysql2
const mysql = require('mysql2');
// Require inquirer
const inquirer = require('inquirer')

const consoleTable = require('console.table');
const { start } = require('repl');


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

db.connect(function() {
    startMenu();
  });

//================== Initial Prompt =======================//
function startMenu() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "View All Employees", 
              "View All Roles",
              "View all Deparments", 
              "Update Employee Role",
              "Add Employee",
              "Add Role",
              "Add Department",
              "Exit"
            ]
    }
]).then(function(answers) {
    if (answers.choice === "View All Employees") {
        console.log(answers.choice)
        viewEmployees();

    } 
    if(answers.choice === "View All Roles") {
        console.log(answers.choice)
        viewRoles();
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
    if (answers.choice === "Exit")
        db.end(); // fix end function 

    })
};

//function to view all employees
function viewEmployees() {
    var query = 'SELECT * FROM employee'; //add table titles
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table('All Employees:', res); 
        startMenu();
    })
}

//function to vire all roles
function viewRoles() {
    var query = 'SELECT * FROM role';
    db.query(query, function(err, res){
        if (err) throw err;
        console.table('All Roles:', res);
        startMenu();
    })
}

// Function to view all departments
function viewAllDepartment(){
    var query = 'SELECT * FROM department';
    db.query(query, function(err, res) {
        if(err)throw err;
        console.table('All Departments:', res);
        startMenu();
    })
}
/////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function updateEmployeeRole(){
    
}
/////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//function to add a new employee
function addEmployee(){
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "What is the employee's fist name? ",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "What is the employee's last name? "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager's ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    choices: function() {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "What is this employee's role? "
                }
                ]).then(function (answer) {
                    let role_id;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == answer.role) {
                            role_id = res[a].id;
                        }                  
                    }  
                    db.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Employee has been added!');
                        startMenu();
                    })
                })
        })
}

//funtion to add a new role title
function addRole(){
    db.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What new role would you like to add?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of this role? (Enter a number)'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArry = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
    
            db.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    console.table('All Roles:', res);
                    startMenu();
                })
        })
    })
}

//function to add a new department title
function addDepartment(){
    inquirer
        .prompt([
            {
                name: 'addDepartment', 
                type: 'input', 
                message: 'Which department would you like to add?'
            }
            ]).then(function (answer) {
                db.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.addDepartment
                    });
                var query = 'SELECT * FROM department';
                db.query(query, function(err, res) {
                if(err)throw err;
                console.log('New Department has been added!');
                console.table('All Departments:', res);
               startMenu();
                })
            })
}





// Listening at PORT for requests
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));