const express = require("express");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employeeRoutes"); 
const db = require('./db')

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// const dbConfig = {
//     host: "127.0.0.1",
//     user: "root",
//     password: "12345",
//     database: "employee_management",
// };

// const pool = mysql.createPool(dbConfig);

db.getConnection()
    .then((connection) => {
        console.log("Connected to the database");
        app.locals.db = connection;
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

app.use("/employees", employeeRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
