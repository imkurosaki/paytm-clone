import { Response, Router } from "express";
import { authMiddleware } from "../middleware/middleware";
import { Account } from "../db/db";
import mongoose from "mongoose";
import {z} from "zod";

const router: Router = Router();

const transferValidation = z.object({
    to: z.string().trim(),
    amount: z.number()
})

router.get('/balance', authMiddleware, async (req: any, res: Response) => {
    const account: any = await Account.findOne({
        userId: req.userId
    });

    res.status(200).json({
        message: (account?.balance || 0) / 100
    })
})

router.post('/transfer', authMiddleware, async (req: any, res: Response) => {
    const session: any = await mongoose.startSession();

    const {success} = transferValidation.safeParse(req.body);
    if(!success) {
        return res.status(400).json({
            message: "Invalid input"
        })
    }

    session.startTransaction();
    let { to, amount } = req.body;

    const toAccount: any = await Account.findOne({ userId: to }).session(session)

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    const account: any = await Account.findOne({ userId: req.userId }).session(session);

    if ((account?.balance || 0) / 100 < amount || !account) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    // Perform the transfer
    amount = amount.toFixed(2) * 100;
    await Account.findByIdAndUpdate({ _id: account?._id }, { $inc: { balance: -amount } }).session(session);
    await Account.findByIdAndUpdate({ _id: toAccount?._id }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    res.status(200).json({
        message: "Transfer successful"
    })
})

export default router;