const { Router } = require('express');
const { login } = require("../controllers/auths");

const router = Router();

try {
    router.post("/login", login);
} catch (e) {
    throw e
}

module.exports = router;
