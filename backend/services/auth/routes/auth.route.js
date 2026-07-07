import express from "express";

import {
    login,
    logOut,
    getCurrentUser
} from "../controllers/auth.controller.js";

const router =
express.Router();

router.post("/login",login);
router.post("/logout",logOut);
router.get("/currentuser",getCurrentUser);      


export default router;