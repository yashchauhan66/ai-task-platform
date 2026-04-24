import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/authModel.js"
import dotenv from "dotenv"
dotenv.config()
export const Signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "User already exists. Please login." })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await User.create({
            email,
            name,
            password: hashPassword
        })
        return res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.log(error)
        if (error?.code === 11000) {
            return res.status(409).json({ message: "User already exists. Please login." })
        }
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = jwt.sign({ id: user._id }, process.env.Secret_Key, { expiresIn: "1h" })

        return res.status(200).json(
            {
                message: "User logged in successfully",
                token
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}