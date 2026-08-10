import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { pool } from "../db"

const router = express.Router()



router.post('/signup', async (req, res) => {
    const {name, password, role} = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(`
    INSERT INTO students (name, password, role)
    VALUES ($1, $2, $3)
    RETURNING id, name, role`,
    [name, hashedPassword, role]
    )
    

    res.status(201).json({
        success: true,
        message: "Student registered successfully",
        user: result.rows[0]
    })  
})


router.post('/login', async (req, res) => {
    const {name, password} = req.body

    const result = await pool.query('SELECT id, name, role, password FROM students WHERE name = $1', [name])

    if (result.rows.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Invaid credentiasls'
        })
    }

    const isMatch = await bcrypt.compare(password, result.rows[0].password)
    if (!isMatch){
        return res.status(400).json({
            success: false,
            message: 'Invaid credentiasls'
        })

    }

    const token = jwt.sign({
        id: result.rows[0].id,
        role: result.rows[0].role, 
        name: result.rows[0].name,
    },
        process.env.JWT_SECRET!,
        {expiresIn: '1h'}
        
    )

    res.json({token})  
})



router.get('/protected', (req, res) => {
    const token = req.headers['authorization']


    if (!token){
        return res.status(401).json({
            success: false,
            message: 'No token provided'
        })
    }

    try {
        const decoded = jwt.verify(token, 'secretKey')
        res.json({
            sucess: true,
            message: 'Protected route', 
            user: decoded
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
        })
        
    }
})

export default router