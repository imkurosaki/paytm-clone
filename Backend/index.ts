import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes";

const app: Application = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200
}));

app.use("/api/v1", router);

const PORT:any = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at localhost ${PORT}`)
});