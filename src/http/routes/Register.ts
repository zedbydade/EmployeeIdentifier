import express from "express";
export const router: express.Router = express.Router();

import { TokenValidator } from "../middlewares/Auth";
import { RegisterController } from "../controllers/register/Register";

router.get("/register", RegisterController.index);
router.get("/register/:_id", RegisterController.get);
router.get(
  "/register/employee/:_id",
  TokenValidator,
  RegisterController.get_employee_registers
);
router.post("/register", TokenValidator, RegisterController.create);
