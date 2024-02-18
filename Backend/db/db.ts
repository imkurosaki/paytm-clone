import { Schema, connect, model } from "mongoose";
import IUser from "../routes/IUser";

const MONGO_URI: string = process.env.MONGO_URI as string;
const connectToDb = async (): Promise<void> => {
    try {
        await connect(MONGO_URI);
    } catch (error) {
        console.error(error);
    }
}
connectToDb();

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    password: {
        type: String,
        required: true,
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

interface IAccount {
    userId: object,
    balance: number
}

const AccountSchema = new Schema<IAccount>({
    userId: {
        type: Schema.Types.ObjectId, // Reference to User Model
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: {
            createdAt: 'created_at'
        }
    }
)

const User = model("User", UserSchema);
const Account = model("Account", AccountSchema)

export {
    User,
    Account
}