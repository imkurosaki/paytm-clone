import { Router, Request, Response } from "express";
import { z } from "zod";
import { User, Account } from "../db/db";
import { JWT_SECRET } from "../lib/config";
import IUser from "./IUser";
import { authMiddleware } from "../middleware/middleware";

const bcrypt: any = require("bcryptjs")
const jwt: any = require("jsonwebtoken")
const router: Router = Router();

const signupSchema = z.object({
    username: z.string().email().trim(),
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    password: z.string().trim().min(5).max(10)
});

router.post('/signup', async (req: Request, res: Response) => {
    const body: IUser = req.body;
    const { success } = signupSchema.safeParse(body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: body.username
    })

    if (existingUser?._id) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const hash_password: string = await bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));
    const newUser = await User.create({
        username: body.username.toLowerCase(),
        firstName: body.firstName.toLowerCase(),
        lastName: body.lastName.toLowerCase(),
        password: hash_password
    });

    // Create new account 
    const randomBalance: number = (Math.ceil((1 + Math.random() * 10000) * 100) / 100) * 100
    await Account.create({
        userId: newUser._id,
        balance: randomBalance
    })

    // const newUserId: object = newUser._id;
    // const token: string = jwt.sign({
    //     userId: newUserId
    // }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully"
    })
})

router.post('/signin', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({
            message: "User doesn't exist"
        })
    }

    const result: boolean = await bcrypt.compare(password, user.password);
    if (!result) {
        return res.status(411).json({
            message: "Password is incorrect!"
        })
    }

    const token: string = jwt.sign({
        userId: user._id
    }, JWT_SECRET)

    res.status(200).json({
        token: `Bearer ${token}`
    })
})

router.put('/', authMiddleware, async (req: any, res: Response) => {
    const user = await User.findById({ _id: req.userId });
    const userInput = {
        username: user?.username,
        firstName: req.body.firstName.toLowerCase() || user?.firstName,
        lastName: req.body.lastName.toLowerCase() || user?.lastName,
        password: req.body.password || user?.password
    }

    const { success } = signupSchema.safeParse(userInput);
    if (!success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }

    const hash_password: string = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    userInput.password = hash_password;

    await User.updateOne({ _id: req.userId }, { $set: userInput });

    res.status(200).json({
        message: "Updated successfully"
    })
})

router.get('/bulk', authMiddleware, async (req: any, res: Response) => {
    const filter: string = req.query.filter || "";
    const users: Array<object> = await User.find({
        $or: [
            {
                firstName: {
                    "$regex": filter
                }
            },
            {
                lastName: {
                    "$regex": filter
                }
            }
        ]
    }, 'username firstName lastName').exec();

    if (!users.length) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.status(200).json({
        users
    })
})

export default router;