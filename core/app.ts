import express, { Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "../routes/userRoutes";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use("/user", UserRoutes);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
