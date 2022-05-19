import express from "express";
import { config } from "secreta";
import { Sequelize, DataType } from "sequelize";
import logger from "../../util/logger/logger";
const { POSTGRES_URL, DB_HOST, DB_USER, DB_PASSWORD, DB } = config;

const DATABASE_URL = process.env.DATABASE_URL || POSTGRES_URL;

console.log(DATABASE_URL);

export const sequelize: Sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});

export const connectPostgres = async () => {
  console.log("ksis");

  try {
    await sequelize.authenticate();
    sequelize.sync();

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
