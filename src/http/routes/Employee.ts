import express from "express";
export const router: express.Router = express.Router();

import { EmployeeController } from "../controllers/employee/Employee";

router.get("/employee", EmployeeController.index);
router.get("/employee/:_id", EmployeeController.get);
router.post("/employee/register", EmployeeController.register);
router.post("/employee/login", EmployeeController.login);
router.get("/employee/search/:name", EmployeeController.search);
