import { Router } from "express";
import userRouter from "./user";
import accountRouter from "./account";

const router: Router = Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

export {
    router
}
