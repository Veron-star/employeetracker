const mySql = require("mysql");
const inquirer = require("inquirer");
const { start } = require("repl");
const { allowedNodeEnvironmentFlags } = require("process");

var connection = mySql.createConnection({
    multipleStatements: true,
    host: "localhost",
    port: 3000,
    user: "root",
    password: "happy",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt(
        {
            type: "list",
            message: "Please select task: ",
            name: "task",
            choices: [
                "View departments",
                "View roles",
                "View employees",
                "Add department",
                "Delete department",
                "Add role",
                "Delete role",
                "Add employee",
                "Delete employee",
                "Update employee role",
                "View employees by managers",
                "Update employee managers",
                "Escape"   
            ]
        }).then(function(answer) {
            if (answer.action === "View departments") {
                viewDepartments();
            } else if (answer.action === "View roles") {
                viewRoles();
            } else if (answer.action === "View employees") {
                viewEmployees();
            } else if (answer.action === "Add department") {
                addDepartment();
            } else if (answer.action === "Delete department") {
                deleteDepartment();
            } else if (answer.action === "Add role") {
                addRole();
            } else if (answer.action === "Delete role") {
                deleteRole();
            } else if (answer.action === "Add employee") {
                addEmployee();
            } else if (answer.action === "Delete employee") {
                deleteEmployee();
            } else if (answer.action === "Update employee role") {
                updateEmployeeRole();
            } else if (answer.action === "View employee by managers") {
                viewEmployeeByManagers();
            } else if (answer.action === "Update employee by managers") {
                updateEmployeeByManagers();
            } else if (answer.action === "Escape") {
                connection.end();
            }
        });
};