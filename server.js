const mySql = require("mysql");
const inquirer = require("inquirer");
const { start } = require("repl");
const { allowedNodeEnvironmentFlags } = require("process");

var connection = mySql.createConnection({
    multipleStatements: true,
    host: "localhost",
    port: PORT.ENV || 3000,
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

function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
        console.log(`DEPARTMENTS:`)
        res.forEach(department => {
            console.log(`ID: ${department.id} | Name: ${department.name}`)
        })
        start();
    });
};

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function(err, res) {
        console.log(`ROLES:`)
        res.forEach(role => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Department ID: ${role.department_id} | Salary: ${role.salary}`);
        })
        start();
    });
};

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        console.log(`EMPLOYEES:`)
        res.forEach(employee => {
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        })
        start();
    });
};

function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            message: "Please enter new department.",
            name: "newDepartment"
        }).then(function(answer) {
            var query = "INSERT INTO newDepartment (name) VALUES ( ? )";
            connection.query(query, answer.newDepartment, function(err, res) {
                console.log(`Successfully added new department: ${(answer.newDepartment).toUpperCase()}.`)
            })
            viewDepartments();
        });
};

function deleteDepartment() {
    inquirer.prompt(
        {
            type: "input",
            message: "Please enter department to remove from list.",
            name: "remove"
        }).then(function(answer) {
            var query = "INSERT INTO remove (name) VALUES ( ? )";
            connection.query(query, answer.remove, function(err, res) {
                console.log(`Successfully remove department: ${(answer.remove).toUpperCase()}.`)
            })
            viewDepartments();
        });
};

function addRole() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter title for the new role.",
                name: "title"
            },
            {
                type: "input",
                message: "Please enter salary for the new role.",
                name: "salary"
            },
            {
                type: "list",
                message: "Please enter the department for the new role.",
                name: "departmentName",
                choices: function() {
                    var choiceArray = [];
                    res.forEach(res => {
                        choiceArray.push(res.name);
                    })
                    return choiceArray;
                }
            }
        ]).then(function(answer) {
            const department = answer.departmentName;
            connection.query("SELECT * FROM DEPARTMENT", function(err, res) {
                if (err) throw err;
                let filterDept = res.filter(function(res) {
                    return res.name == department;
                })
                let id = filterDept[0].id;
                let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                let values = [answer.title, parseInt(answer.salary).id]
                console.log(values);
                connection.query(query, values, function(err, res, fields) {
                    console.log(`Successfully added new role: ${(values[0]).toUpperCase()}.`)
                })
                viewRoles();
            })
        })
    })
};

function deleteRole() {
    inquirer.prompt(
        {
            type: "input",
            message: "Please enter role to remove from list.",
            name: "remove"
        }).then(function(answer) {
            var query = "INSERT INTO remove (name) VALUES ( ? )";
            connection.query(query, answer.remove, function(err, res) {
                console.log(`Successfully remove role: ${(answer.remove).toUpperCase()}.`)
            })
            viewRoles();
        });
};

async function addEmployee() {
    connection.query("SELECT * FROM role", function(err, result) {
        if (err) throw err;
        inquirer.prompt([{
            type: "input",
            message: "Please enter employee's first name.",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please enter employee's last name.",
            name: "lastName"
        },
        {
            type: "list",
            message: "Please enter employee's role.",
            name: "roleName",
            choices: function() {
                roleArray = [];
                result.forEach(result => {
                    roleArray.push(
                        result.title
                    );
                })
                return roleArray;
            }
        }
    ]).then(function(answer) {
        console.log(answer);
        const role = answer.roleName;
        connection.query("SELECT * FROM role", function(err, res) {
            let filterRole = res.filter(function(res) {
                return res.title == role;
            })
            let roleId = filterRole[0].id;
            connection.query("SELECT * FROM employee", function(err,res) {
                inquirer.prompt ([
                    {
                        type: "list",
                        message: "Please enter manager's name.",
                        name: "manager",
                        choices: function() {
                            managerArray = [];
                            res.forEach(res => {
                                managerArray.push(res.last_name);
                            })
                            return managerArray;
                        }
                    }
                ]).then(function(managerAnswer) {
                    const manager = managerAnswer.manager;
                    connection.query("SELECT * FROM employee", function(err, res) {
                        if (err) throw err;
                        let filterManager = res.filter(function(res) {
                            return res.last_name == manager;
                        })
                        let managerId = filterManager[0].id;
                        console.log(managerAnswer);
                        let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        let values = [answer.firstName, answer.lastName, roleId, managerId];
                        console.log(values);
                        connection.query(query, values, function(err, res, fields) {
                            console.log(`Successfully added this employee: ${(values[0]).toUpperCase()}.`)
                        })
                        viewEmployees();
                    })
                })
            })
        })
    })
    })
}