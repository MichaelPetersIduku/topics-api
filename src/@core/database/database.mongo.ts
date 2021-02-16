import express from "express";
import mongoose from "mongoose";
import { config } from "secreta";

const { MONGODB_URL } = config;
const { connection } = mongoose;
const app = express();

export const connectMongo = () => {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
  });
};

connection.on("error", (error: any) => {
  console.log(`MongoDB database connection error: ${error}`);
  throw error;
});

connection.once("open", function () {
  app.locals.db = connection.db.collection("agendaJobs");
  console.log("MongoDB database connection opened successfully.");
});
