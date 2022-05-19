import express from "express";
import mongoose from "mongoose";
import { config } from "secreta";
import { loadQuestionsData, loadTopicsData } from "../../util/util";

const { MONGODB_URL } = config;
const { connection } = mongoose;
const app = express();

export const connectMongo = () => {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: true,
  });
};

connection.on("error", (error: any) => {
  console.log(`MongoDB database connection error: ${error}`);
  throw error;
});

connection.once("open", async function () {
  // app.locals.db = connection.db.collection("agendaJobs");

  // fetch data from google sheet
  await loadTopicsData();
  await loadQuestionsData();
  console.log("MongoDB database connection opened successfully.");
});
