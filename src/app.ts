import express, { Request, Response, Application } from "express";

// create express server
const app: Application = express();

app.set("port", process.env.PORT || 4001);
app.set("env", "production");

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to TEST API",
  });
});

export default app;
