import express from "express";
import verifytoken from "../utils/verifytoken.js";
import { findUser, getFindMessage } from "../controllers/user.controller.js";

const route = express.Router()

route.get("/:username", verifytoken, findUser)
route.get("/find/:id", verifytoken, getFindMessage)
export default route