const { Router } = require('express');
const { search, create } = require('../controllers/users');
const { validateToken } = require('../middlewares/authentication');
const router = Router();

router.get("", validateToken, search);
router.post("/create", validateToken, create);

module.exports = router;
