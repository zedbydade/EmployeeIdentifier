import express from "express";
export const router: express.Router = express.Router();

import { CompanyController } from "../controllers/company/Company";
import { TokenValidator } from "../middlewares/Auth";

router.get("/company", CompanyController.index);
router.get("/company/:_id", CompanyController.get);
router.get("/company/search/:name", CompanyController.search);
router.post("/company/register", TokenValidator, CompanyController.register);
router.patch("/company/admin/add", TokenValidator, CompanyController.add_admin);
router.patch(
  "/company/admin/remove",
  TokenValidator,
  CompanyController.remove_admin
);
