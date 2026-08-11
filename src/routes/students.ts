import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { pool } from "../db"
import { authenticate, requireAdmin } from "../middleware/auth";

const router = express.Router()


router.get('/', async (req, res) => {
    // everyone can check 
    try {
        const {name, role} = req.query

        const paramQueries = []
        const whereCondiitons = []

        if (name !== undefined){
            paramQueries.push(name)
            whereCondiitons.push(`name = $${paramQueries.length}`)
        }

        if (role !== undefined){
            paramQueries.push(role)
            whereCondiitons.push(`role = $${paramQueries.length}`)
        }

        var sqlQuery = `
        SELECT id, name, role
        FROM students`
        if (paramQueries.length > 0){
            sqlQuery += ` WHERE ` + whereCondiitons.join(' AND ')
        }

        const resutl =  await pool.query(sqlQuery, paramQueries)


        res.json({
            success: true,
            students: resutl.rows
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve students"
        })
    }

})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const sqlQuery = `
        SELECT name, role
        FROM students
        WHERE id = $1
        `
        const result = await pool.query(sqlQuery, [id])

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `Student with id ${id} does not exist`
            });
        }

        res.json({
            success: true,
            student: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve student" // maybe i can do something like no student with id : $id
        })
    }
})


router.post('/', requireAdmin,  async (req, res) => {
    try {
        const {name,  password, role} = req.body
        var isValid = true

        // validation
        if (typeof password !== "string" || password.length < 5) isValid = false // password should consistent of at least 5 characters
        if (typeof name !== "string" || name.trim() === "") isValid = false
        if (role !== "student" && role !== "admin") isValid = false

        if (!isValid){
            return res.status(400).json({
                success: false,
                message: "Passwords must be a string containing 5 or more characters. Role must be a student or an admin. Name must be a non empty string"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const sqlQuery = `
        INSERT INTO students (name, password, role)
        VALUES ($1, $2, $3)
        RETURNING id, name, role 
        `
        const result = await pool.query(sqlQuery, [name, hashedPassword, role])

        res.json({
            success: true,
            student: result.rows[0]
        })

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create student"
        })
    }
})


router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const {name, password, role} = req.body
        const id = req.params.id

        if (!name || !password || !role){
            return res.status(400).json({
                success: false,
                message: "You must include name, password and role"
            })
        }

        var isValid = true

        if (typeof name !== "string" || name.trim() === "") isValid = false
        if (typeof password !== "string" || password.length < 5) isValid = false
        if (role !== "student" && role !== "admine") isValid = false

        if (!isValid){
            return res.status(400).json({
                success: false,
                message: "Passwords must be a string containing 5 or more characters. Role must be a student or an admin. Name must be a non empty string"
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        const sqlQuery = `
        UPDATE students
        SET name = $1, password = $2, role = $3
        WHERE id = $4
        RETURNING id, name, role
        `
        const result = await pool.query(sqlQuery, [name, hashedPassword, role, id])
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `Student with id ${id} does not exist`
            });
        }
        res.json({
            success: true,
            student: result.rows[0]
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to edit student"
        })
    }
})


router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const id = req.params.id
        const sqlQuery = `
        DELETE FROM students
        WHERE id = $1
        RETURNING id, name, role
        `
        const result = await pool.query(sqlQuery, [id])
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `Student with id ${id} does not exist`
            });
        }
        res.json({
            success: true,
            student: result.rows[0]
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete student" // or somehting like failed to delete student with id x or student with id x does not exit
        })
    }

})

export default router