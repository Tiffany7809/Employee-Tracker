const express = require('express');
// Require mysql2
const mysql = require('mysql2');
// Require inquirer
const inquirer = require('inquirer')
// Require console.table
const consoleTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting up a way to Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password1',
    database: 'employeeInfo_db'
  },
  console.log(`Connected to the employeeInfo_db database.`)
);

//Initiating connection to database
db.connect(function() {
    startMenu();
  });

// Start Up Menu Prompt
function startMenu() {
    inquirer.prompt([
    {
    type: "list",
    message: "What do you want to do?",
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
        console.log("Viewing all Employees..")
        viewEmployees();

    } 
    if(answers.choice === "View All Roles") {
        console.log("Viewing all Roles..")
        viewRoles();
    }
    if(answers.choice ===  "View all Deparments"){
        console.log("Viewing all Departments..")
        viewAllDepartment();
    }
    if (answers.choice === "Update Employee Role") {
        console.log("Updating Employees Role..")
        updateEmployeeRole();
    }
    if(answers.choice === "Add Employee") {
        console.log("Adding a New Employee..")
        addEmployee();
    }
    if(answers.choice === "Add Role") {
        console.log("Adding a New Role..")
        addRole();
    }
    if (answers.choice === "Add Department") {
        console.log("Adding a New Department..")
        addDepartment();
    }
    if (answers.choice === "Exit") {
        console.log("Exiting the Application...")
        exitApp(); // fix end function 
    }
    })
};

//function to view all employees
function viewEmployees() { 
    //selecting what parts of the tables to display on request and as what titles
    var query = 'SELECT employee.id AS ID, employee.first_name, employee.last_name, employee.manager_id AS ManagerID, role.title AS Title,  department.name AS Department, role.salary AS Salary FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;'
    
    db.query(query, function(err, res) {
        if (err) throw err;
        console.table(res); 
        startMenu();
    })
}

//function to vire all roles
function viewRoles() {
    //selecting what parts of the tables to display on request and as what titles
    var query = 'SELECT role.id AS ID, role.title AS Title, department.name AS Department, role.salary AS Salary FROM role INNER JOIN department ON role.department_id = department.id'
    db.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        startMenu();
    })
}

// Function to view all departments
function viewAllDepartment(){
    //selecting what parts of the tables to display on request and as what titles
    var query = 'SELECT department.id AS ID, department.name AS Department FROM department';
    db.query(query, function(err, res) {
        if(err)throw err;
        console.table(res);
        startMenu();
    })
}

// function to update the employee role
function updateEmployeeRole(){
 // show list of all employees to pick from 
  db.query("SELECT * FROM EMPLOYEE", (err, emplRes) => {
    if (err) throw err;
    const updateEmployee = [];
    emplRes.forEach(({ first_name, last_name, id }) => {
      updateEmployee.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
    //get the roles list for selection of new role
    db.query("SELECT * FROM ROLE", (err, rolRes) => {
      if (err) throw err;
      const roleUpdate = [];
      rolRes.forEach(({ title, id }) => {
        roleUpdate.push({
          name: title,
          value: id
          });
        });

        //prompt for what employee to add
      inquirer.prompt([
        {
          type: "list",
          name: "id",
          choices: updateEmployee,
          message: "What employee do you want to update?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roleUpdate,
          message: "Employee's new role?"
        }
      ])
        .then(response => {
          const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          db.query(query, [
            {role_id: response.role_id},
            "id",
            response.id
          ], (err, res) => {
            if (err) throw err;
            
            console.log("Employees role has been updated.");
            startMenu();
          });
        })
        .catch(err => {
          console.error(err);
        });
      })
  });
    
}

//function to add a new employee
function addEmployee(){
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'firstName',
                    type: 'input', 
                    message: "What is the employee's fist name? ",
                },
                {
                    name: 'lastName',
                    type: 'input', 
                    message: "What is the employee's last name? "
                },
                {
                    name: 'managerId',
                    type: 'input', 
                    message: "What is the managers ID for this employee? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    choices: function() {
                    var roleArr = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArr.push(res[i].title);
                    }
                    return roleArr;
                    },
                    message: "What is this employee's role? "
                }
                ]).then(function (answer) {
                    let roleId;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == answer.role) {
                            roleId = res[a].id;
                        }                  
                    }  
                    db.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        manager_id: answer.managerId,
                        role_id: roleId,
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
                name: 'newRole',
                type: 'input', 
                message: "Enter the title of the role you would like to add:"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the annual salary of this role?'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArr = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArr.push(res[i].name);
                    }
                    return deptArr;
                },
            }
        ]).then(function (answer) {
            let departmentId;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    departmentId = res[a].id;
                }
            }
    
            db.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.newRole,
                    salary: answer.salary,
                    department_id: departmentId
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
                console.log('You have added a new Department.');
                console.table('All Departments:', res);
               startMenu();
                })
            })
}


//function to remove an employee from table 
function  removeEmployee() {}

//function to remove role from table
function removeRole(){}

//function to remove Department from table
function removeDepartment(){}

//fucntion to end connection 
function exitApp () {
    db.end();
}

// Listening at PORT for requests
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));