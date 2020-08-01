const connection = require("./db/db.js");
const inquirer = require("inquirer");
// const consoleTable = require("console.table");

const startApp = () => {
    inquirer.prompt(
        {
            type: "list",
            message: "Please select option: ",
            name: "option",
            choices: startScreen
               
        }).then((answer) => {
            console.log(answer);
            switch (answer.option) {
                case "View departments":
                    viewDepartments();
                    break;

                case "View roles":
                    viewRoles();
                    break;
                
                case "View employees":
                    viewEmployees();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Delete department":
                    deleteDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Delete role":
                    deleteRole();
                    break;
                    
                case "Add employee":
                    addEmployee();
                    break; 

                case "Delete employee":
                    deleteEmployee();
                    break;

                case "Update employee role":
                    updateEmployeeRole();
                    break;
                    
                case "Exit":
                   connection.end();
                    break;    
            }
        });
};


const viewDepartments = () => {
    const query = "SELECT * FROM department";
    connection.query(query, (err, results) => {
        if (err) throw err;
            inquirer.prompt([
                {
                    type: "list",
                    message: "Please select department.",
                    name: "deptList",
                    choices: function () {
                        let choiceArray = results.map(choice => choice.department_name)
                        return choiceArray;
                    },
                }
            ]).then((answer) => {
                let chosenDept;
                for (let i = 0; i < results.length; i++) {
                    if (results[i].department_name === answer.deptList) {
                        chosenDept = results[i];
                    }
                }

                const query = "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id";
                connection.query(query, { department_name: chosenDept.department_name }, (err,res) => {
                    if (err) throw err;
                    console.log(' ');
                    console.table(chalk.yellow(`All Employees by Department: ${chosenDept.department_name}`), res);
                    startApp();
                })
            })
        })
};

function viewRoles() {
    connection.query("SELECT * FROM department", function(err, answer) {
        console.log("\n Roles retrieve from database \n");
            console.table(answer);
        })
        tracker();
};

function viewEmployees() {
    console.log("Retriving employee from database");
    var query = "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id";
    connection.query(query, function(err, answer) {
        console.log("\n Employee retrieve from database \n");
            console.table(answer);
        })
        tracker();
};

function addDepartment() {
    inquirer.prompt(
        {
            type: "input",
            message: "Please enter new department.",
            name: "department"
        }).then(function(answer) {
            connection.query("INSERT INTO department SET ?", 
            {
                name: answer.department
            },
            function(err, answer) {
                if (err) throw err;
            }    
        ),    
            console.table(answer);
            tracker();
        });
};

const deleteDepartment = () => {
    const query = `SELECT * FROM departments`;
    connection.query(query, (err, results) => {
        if (err) throw err;
    inquirer.prompt([
        {
            type: "list",
            message: "Please enter department to remove from list.",
            name: "removeDept",
            choices: function () {
                let choiceArray = results.map(choice => choice.department_name);
                return choiceArray;
            }
        }
    ]).then((answer) => {
            connection.query(`DELETE FROM departments WHERE ?`, { department_name: answer.dept })
            startApp();
            })
        });
};

const addRole = () => {
    const addRoleQuery = `SELECT * FROM roles; SELECT * FROM departments`
    connection.query(addRoleQuery, (err, results) => {
        if (err) throw err;

        console.log('');
        console.log(chalk.yellow("List of current roles:"), results[0]);

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
                name: "department_name",
                choices: function() {
                    let choiceArray = results[1].map(choice => choice.department_name);
                    return choiceArray;
                }
            }
        ]).then((answer) => {
            connection.query(`INSERT INTO roles(title, salary, department_id) VALUES ("${answer.newTitle}", "${answer.newSalary}", (SELECT id FROM departments WHERE department_name = "${answer.dept}"))`)                
                startApp();
            })
        })
};

const deleteRole = () => {
    const query = `SELECT * FROM roles`;
    connection.query(query, (err, results) => {
        if (err) throw err;
    inquirer.prompt([
        {
            type: "list",
            message: "Please enter role to remove from list.",
            name: "removeRole",
            choices: function () {
                let choiceArray = results.map(choice => choice.title);
                return choiceArray;
            }
        }
    ]).then((answer) => {
            connection.query(`DELETE FROM roles WHERE ? `, { title: answer.removeRole });
                startApp();
            })
        });
};

const addEmployee = () => {
    connection.query(roleQuery, (err, result) => {
        if (err) throw err;
        inquirer.prompt([
            {
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
            choices: function () {
                let choiceArray = results[1].map(choice => choice.full_name);
                return choiceArray;
            }
        }
    ]).then((answer) => {
        connection.query(`INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES(?, ?, (SELECT id FROM roles WHERE title = ?), (SELECT id FROM (SELECT id FROM employees WHERE CONCAT(first_name," ", last_name) = ? ) AS template))`, [answer.firstName, answer.lastName, answer.role, answer.managerId])
            startApp();
    })
})
}

const deleteEmployee = () => {
    connection.query(allEmployeeQuery, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.yellow("All Employees"), results)
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the employee ID to remove.",
                name: "removeId"
            }
        ]).then((answer) => {
            connection.query(`DELETE FROM employees WHERE ?`, { id: answer.removeId })
            startApp();
        })
    })
}
                
const updateEmployeeRole = () => {
    const query = `SELECT CONCAT (first_name," ", last_name) AS full_name FROM employees; SELECT title FROM roles`
    connection.query(query, (err, results) => {
        if (err) throw err;
        inquirer.prompt ([
            {
                type: "list",
                message: "Please enter employee's name for the new role.",
                name: "employeeName",
                choice: function() {
                   let choiceArray = results[0].map(choice => choice.full_name);
                    return choiceArray;
                }
            }
        ]).then((answer) => {
            connection.query(`UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = ? ) WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?) AS template)`, [answer.addRole,answer.employeeName], (err, results) => {
                if (err) throw err;
                startApp();
            })
        })
    })
}
                
startApp();               
                
                
                
                
               