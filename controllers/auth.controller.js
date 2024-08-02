import User from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const signup = async (req, res) => {
    try {
        const { username, password, confirmpassword, gender } = req.body
        const user = await User.findOne({ username })
        if (password !== confirmpassword) {
            return res.status(400).json({ msg: "Password Don't match" })
        }
        if (user) {
            return res.status(400).json({ msg: "Username Already Exists" })
        } else {
            const maleprofile = "https://avatar.iran.liara.run/public/boy"
            const femaleprofile = "https://avatar.iran.liara.run/public/girl"
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            const newUser = new User({
                username,
                password: hashedPassword,
                gender,
                profilepic: gender === "male" ? maleprofile : femaleprofile
            })
            await newUser.save().then(res.status(200).json({ msg: newUser }))
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user)  return res.status(400).json({ msg: "Invalid username" })
    const passwordcorrect = await bcrypt.compare(password, user.password)
    if (!passwordcorrect) return res.status(400).json({ msg: "Invalid password" })
    const tokens = jwt.sign({ id: user.id }, 'SecretAbis')
    res.status(200).json({ token: tokens, data: user })
}

