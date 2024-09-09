const { Router } = require("express");
const authRouter = require("./auths");
const userRouter = require("./users");
const attendanceRouter = require("./attendances");
const salaryRouter = require("./salaries");

const router = Router();

try {
    router.use('/auths', authRouter);
    router.use('/users', userRouter);
    router.use('/attendances', attendanceRouter);
    router.use('/payrolls', salaryRouter);
} catch (e) {
    throw e
}


module.exports = router;
