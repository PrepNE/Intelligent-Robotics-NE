import PlateLogController from "../controllers/platelog.controller";
import { restrictTo } from "../middleware/admin.middleware";
import { isAuthenticated } from "../middleware/auth.middleware";
import { Router } from "express";




const router = Router();

router.get("/", isAuthenticated, restrictTo("ADMIN") ,PlateLogController.findAllPlateLogs);


const plateLogRoutes = router;

export default plateLogRoutes;