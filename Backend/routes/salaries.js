const { Router } = require('express');
const { validateToken } = require('../middlewares/authentication');
const { runSalaryReport, search, downloadSalaryReport } = require('../controllers/salaries');

const router = Router();

try {
    router.get("", validateToken, search);
    router.post("/run", validateToken, runSalaryReport);
    router.post("/download-report", validateToken, downloadSalaryReport);
} catch (e) {
    throw e
}

module.exports = router;
