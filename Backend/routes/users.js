const { Router } = require('express');
const { search, create, getById, update } = require('../controllers/users');
const { validateToken } = require('../middlewares/authentication');
const router = Router();

try {
    router.get("", validateToken, search);
    router.post("/create", validateToken, create);
    router.get("/:id", validateToken, getById);
    router.post("/update/:id", validateToken, update);
} catch (e) {
    throw e
}

module.exports = router;
