const { Router } = require('express');
const { validateToken } = require('../middlewares/authentication');
const { exportExcel, importExcel, search, createSummary, getSummary } = require('../controllers/attendances');

const router = Router();

try {
    router.get("", validateToken, search);
    router.post("/export-excel", validateToken, exportExcel);
    router.post("/import-excel", validateToken, importExcel);
    router.post("/create-summary", validateToken, createSummary);
    router.get("/get-summary", validateToken, getSummary);
    // router.get("/view-report", validateToken, getSummary);
} catch (e) {
    throw e
}

module.exports = router;
