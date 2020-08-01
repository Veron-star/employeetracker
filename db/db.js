const mySql = require("mysql");
const chalk = require("chalk");

const connection = mySql.createConnection({
    host: "localhost",
    port: 3000,
    user: "root",
    password: "happy",
    database: "employee_db",
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.log(chalk.white.bgGray(err));
        return;
}
console.log(chalk.green(`Connected to db. ThreadID: ${connection.threadId}`));
})

module.exports = connection;
