const { Router } = require("express");
const authRouter = require("./auths");
const userRouter = require("./users");

const router = Router();

router.use('/auths', authRouter);
router.use('/users', userRouter);


module.exports = router;
