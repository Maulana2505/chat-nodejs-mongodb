import express from "express";
import verifytoken from "../utils/verifytoken.js";
import { deleteMessages, getMessages, getMessageswithparams, sendMessage } from "../controllers/message.controller.js";

const route = express.Router()

route.post("/send/:id",verifytoken,sendMessage)
route.get("/",verifytoken,getMessages)
route.get("/:id",verifytoken,getMessageswithparams)
route.delete("/:id",verifytoken,deleteMessages)

export default route