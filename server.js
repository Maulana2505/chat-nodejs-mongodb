import express from 'express';
import dotenv from "dotenv";
import connectMongodb from './db/mongodb.js';
import authRouth  from './routes/auth.routes.js'
import messageRouth  from './routes/message.routes.js'
import userRouth  from './routes/user.routes.js'
import bodyParser from 'body-parser';
import { server,app } from './socket/socket.js';
import cors from 'cors'

dotenv.config();

const PORT = process.env.PORT || 4000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use("/",authRouth)
app.use("/messages",messageRouth)
app.use("/user",userRouth)


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectMongodb()
})

