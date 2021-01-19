import express, { Request, Response, Application } from "express";
import { billsRouter } from "./api/bills/bills.route";

// create express server
const app: Application = express();

app.set("port", process.env.PORT || 4001);
app.set("env", "production");

app.use("/api/v1/bills", billsRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to TEST API, Stella is a good girl, she is 18years old",
  });
});

export default app;
