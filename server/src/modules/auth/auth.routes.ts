import { Router } from "express";
import * as auth from "@/modules/auth/auth.controllers";
import { isAdmin, isAuthenticated } from "@/middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", auth.registerUser);
router.post("/login", auth.loginUser);
router.get("/me", isAuthenticated, auth.getCurrentUser);
router.get("/users/:id", isAdmin, auth.getUserById);
router.get("/logout", auth.logoutUser);
router.post("/refresh-token", auth.refreshToken);
router.post("/logout-all", isAuthenticated, auth.logoutAllSessions);

export default router;
