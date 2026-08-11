import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { pool } from "../db"
import { authenticate, requireAdmin } from "../middleware/auth";


const router = express.Router()


router.get('/', authenticate, async (req, res) => {

    try {
        const {name} = req.query
        const sqlQuery = name ? 
        `SELECT id, name
        FROM courses
        WHERE name = $1` :
        `SELECT id, name
        FROM courses`

        const paramQueries = name ? [name] : []


        const result = await pool.query(sqlQuery, paramQueries)

        res.json({
            success: true,
            courses: result.rows
        })

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve courses"
        })
    }
})



router.get('/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id
        const sqlQuery = `
        SELECT id, name
        FROM courses
        WHERE id = $1
        `
        const result = await pool.query(sqlQuery, [id])

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: `Course with id ${id} does not exist`
            });
        }

        res.json({
            success: true,
            course: result.rows[0]
        })
    } catch (error) {        
        res.status(500).json({
            success: false,
            message: "Failed to retrieve course"
        })
    }

})



router.post('/', requireAdmin, async (req, res) => {
    try {
        const {name} = req.body
        const sqlQuery = `
        INSERT INTO courses (name)
        VALUES ($1)
        RETURNING id, name
        `
        // validation
        if (typeof name !== "string" || name.trim() === ""){
            return res.status(400).json({
                success: false,
                message: "Name is required and must be a non empty string"
            })
        }


        const result = await pool.query(sqlQuery, [name])

        res.json({
            success: true,
            course: result.rows[0]
        })

    } catch (error) { 
        res.status(500).json({
            success: false,
            message: "Failed to create course"
        })
    }
})

export default router