import express from "express";
import { RegisterController } from "../controllers/register/Register";
export const router: express.Router = express.Router();

router.get("/register", RegisterController.index);
router.get("/register/:_id", RegisterController.get);
router.post("/register", RegisterController.create);
