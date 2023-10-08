const express = require("express");
const router = express.Router();
const pool = require("../db"); 

//create an employee
router.post("/", async (req, res) => {
    try {
        const data = req.body;
        const connection = await pool.getConnection();
        const result = await connection.query(
            "INSERT INTO employees SET ?",
            data
        );
        connection.release();
        res.status(201).json({
            message: "Employee created successfully",
            id: result[0].insertId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// liist Employees with Pagination
router.get("/", async (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit; 
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query(
            "SELECT * FROM employees LIMIT ? OFFSET ?",
            [parseInt(limit), offset]
        );
        connection.release();
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// update Employee
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.query("UPDATE employees SET ? WHERE id = ?", [
            data,
            id,
        ]);
        connection.release();
        res.json({ message: "Employee updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// delete Employee
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        await connection.query("DELETE FROM employees WHERE id = ?", [id]);
        connection.release();
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// get Employee by id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.query(
            "SELECT * FROM employees WHERE id = ?",
            [id]
        );
        connection.release();
        if (results.length === 0) {
            res.status(404).json({ error: "Employee not found" });
        } else {
            res.json(results[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
