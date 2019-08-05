import express from "express";
export const router: express.Router = express.Router();

import { CompanyController } from "../controllers/company/Company";

router.get("/company", CompanyController.index);
router.get("/company/:_id", CompanyController.get);
router.get("/company/search/:name", CompanyController.search);
router.post("/company/register", CompanyController.register);
