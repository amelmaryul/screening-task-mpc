import express from "express";
import { pool } from "../db"
import { authenticate, requireAdmin } from "../middleware/auth";

const router = express.Router()



router.get('/', authenticate, async (req, res) => {
    try {
        const sqlQuery = `
        SELECT id, name, course_id
        FROM assignments
        `
        const result = await pool.query(sqlQuery)

        if (result.rowCount === 0){
            return res.status(404).json({
                success: false,
                message: "No assignments"
            });
        }

        res.json({
            success: true,
            assignments: result.rows
        })

    } catch (error) { 
        res.status(500).json({
            success: false,
            message: "Failed to retrieve assignments"
        })
    }
})



router.post('/', requireAdmin, async (req, res) => {
    try {
        const {name, course_id} = req.body
        const sqlQuery = `
        INSERT INTO assignments (name, course_id)
        VALUES ($1, $2)
        RETURNING id, name, course_id
        `
        const result = await pool.query(sqlQuery, [name, course_id])

        res.json({
            success: true,
            assignment: result.rows[0]
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create assignment"
        })
    }
})


router.patch('/:id', requireAdmin, async (req, res) => {
    try {
        const id = req.params.id
        const {name, course_id} = req.body

        if (name && course_id){
            const sqlQuery = `
            UPDATE  assignments
            SET name = $1, course_id = $2
            WHERE id = $3
            RETURNING id, name, course_id
            `
            const result = await pool.query(sqlQuery, [name, course_id, id])

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Assignment with id ${id} does not exist`
                });
            }
            return res.json({
                success: true,
                assignment: result.rows[0]
            })
        }


        else if (name){
            const sqlQuery = `
            UPDATE  assignments
            SET name = $1
            WHERE id = $2
            RETURNING id, name, course_id
            `
            const result = await pool.query(sqlQuery, [name, id])

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Assignment with id ${id} does not exist`
                });
            }
            return res.json({
                success: true,
                assignment: result.rows[0]
            })

        }

        else if (course_id){
            const sqlQuery = `
            UPDATE  assignments
            SET course_id = $1
            WHERE id = $2
            RETURNING id, name, course_id
            `
            const result = await pool.query(sqlQuery, [course_id, id])

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Assignment with id ${id} does not exist`
                });
            }
            return res.json({
                success: true,
                assignment: result.rows[0]
            })

        }

        return res.status(400).json({
            success: false,
            message: "You must add a param to edit something"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to edit assignment"
        })
    }
})

export default router



