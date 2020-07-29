const mySql = require("mysql");
const inquirer = require("inquirer");
const { start } = require("repl");

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

