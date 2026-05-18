import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import leadRoutes from "@/modules/lead/lead.routes";
import { isAuthenticated } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/lead", isAuthenticated, leadRoutes);

export default router;
