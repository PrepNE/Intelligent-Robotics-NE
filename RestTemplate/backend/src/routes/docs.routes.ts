import { exportCsv, exportExcel, exportPdf } from "../controllers/export.controller";
import { Router } from "express";


const router = Router();

router.get("/export/pdf", exportPdf);
router.get("/export/csv", exportCsv);
router.get("/export/excel", exportExcel);

const docRoutes = router;

export default docRoutes