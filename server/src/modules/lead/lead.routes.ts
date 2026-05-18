import { Router } from "express";
import * as lead from "./lead.controllers";

const router: Router = Router();

router.post("/create", lead.createLead);
router.put("/update/:id", lead.updateLead);
router.delete("/delete/:id", lead.deleteLead);
router.get("/get/:id", lead.getLeadByID);
router.get("/get", lead.getLeads);

export default router;
