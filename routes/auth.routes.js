import express from 'express'
import { login, signup } from '../controllers/auth.controller.js'
import verifytoken from '../utils/verifytoken.js'

const route = express.Router()

route.post("/signup", signup) 

route.post("/login",login)



export default route