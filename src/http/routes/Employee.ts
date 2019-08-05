import express from "express";
export const router: express.Router = express.Router();

import { EmployeeController } from "../controllers/employee/Employee";

router.get("/employee/search/:name", EmployeeController.search);
router.get("/employee", EmployeeController.index);
router.get("/employee/:id", EmployeeController.get);
router.post("/employee/register", EmployeeController.register);
router.post("/employee/login", EmployeeController.login);
router.patch("/employee", EmployeeController.patch);
router.delete("/employee", EmployeeController.delete);

//export default (app: Express): Express => app.use("/api/v1", router);
