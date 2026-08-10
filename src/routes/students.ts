import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { pool } from "../db"
import { authenticate, requireAdmin } from "../middleware/auth";

const router = express.Router()


router.get('/', async (req, res) => {
    // everyone can check 
    try {
        const sqlQuery = `
        SELECT name, role
        FROM students
        `
        const resutl =  await pool.query(sqlQuery)

        if (resutl.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No students"
            });
        }


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
            message: "Failed to retrieve student"
        })
    }
})


// for now this can only really change either password or name
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const {name, password} = req.body
        const id = req.params.id
        var hashedPassword = ""
        if (password){
            hashedPassword = await bcrypt.hash(password, 10)
        }
        if (name && password){
            const sqlQuery = `
            UPDATE students
            SET name = $1, password = $2
            WHERE id = $3
            RETURNING id, name, role
            `
            const result = await pool.query(sqlQuery, [name, hashedPassword, id])
            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Student with id ${id} does not exist`
                });
            }
            return res.json({
                success: true,
                student: result.rows[0]
            })
        }
        else if (name){
            const sqlQuery = `
            UPDATE students
            SET name = $1
            WHERE id = $2
            RETURNING id, name, role
            `
            const result = await pool.query(sqlQuery, [name, id])
            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Student with id ${id} does not exist`
                });
            }
            return res.json({
                success: true,
                student: result.rows[0]
            })

        }

        else if (password){
            const sqlQuery = `
            UPDATE students
            SET password = $1
            WHERE id = $2
            RETURNING id, name, role
            `
            const result = await pool.query(sqlQuery, [hashedPassword, id])
            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Student with id ${id} does not exist`
                });
            }
            return res.json({
                success: true,
                student: result.rows[0]
            })
        }

        return res.status(400).json({
            success: false,
            message: "You can edit the students name or password!"
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
            succes: true,
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