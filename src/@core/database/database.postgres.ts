import express from "express";
import { config } from "secreta";
import { Sequelize } from "sequelize";
import logger from "../../util/logger/logger";
const { MYSQL_URL, DB_HOST, DB_USER, DB_PASSWORD, DB } = config;

export var sequelize: Sequelize = new Sequelize(MYSQL_URL);

export const connectMYSQL = async () => {
    console.log("ksis");
    
  // sequelize = new Sequelize(MYSQL_URL);
  try {
    await sequelize.authenticate();
    sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};