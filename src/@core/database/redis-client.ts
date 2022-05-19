import { config } from "secreta";
import { loadQuestionsData, loadTopicsData, storeQuestionsToDB, storeTopicsToDB } from "../../util/util";
import { createClient } from "redis";
import { promisify } from "util";
import { ErrorCodes, ICacheVariable } from "../interfaces/interface";
import CustomError from "../common/error.service";

const { REDIS_HOSTNAME, REDIS_PORT, REDIS_PASSWORD } = config;

export const RedisClient = createClient({
  url: `redis://${REDIS_HOSTNAME}:${REDIS_PORT}`,
  password: REDIS_PASSWORD,
});

let reloadData;

export const connectRedis = async () => {
  console.log("REDIS", RedisClient);
  await RedisClient.connect();
};

RedisClient.on("ready", async () => {
  console.log(`${new Date()} - redis.connection.ready`);
});

RedisClient.on("connect", async () => {
  console.log(`${new Date()} - redis.connection.connected`);
  const topics = await getVariable("Topics");
  const questions = await getVariable("Questions");
  if (!topics?.success && !questions?.success) {
      console.log("Gotten from sheet");
    // fetch data from google sheet
    reloadData = setInterval(async () => {
        await loadTopicsData();
        await loadQuestionsData();
    }, 1800)
  } else {
      console.log("Gotten from redis");
      await storeQuestionsToDB(questions?.value);
      await storeTopicsToDB(topics?.value)
  }
  console.log(topics, questions);
});

RedisClient.on("error", (err: any) => {
  console.error(`${new Date()} - redis.connection.failed :::: ${err.message}`);
  clearInterval(reloadData);
  RedisClient.del("Topics")
  RedisClient.del("Questions");
});

export const cacheData = async (cacheVariables: ICacheVariable) => {
  const { varName, varValue } = cacheVariables;
  const setAsync = promisify(RedisClient.set).bind(RedisClient);
  if (!varName) {
    console.error(
      `${new Date()} :::: cacheVariable function :::: varName is missing`
    );
    throw new CustomError(
      "Could not save to cache - varName is missing.",
      ErrorCodes.INTERNAL_SERVER_ERORR
    );
  }
  if (!varValue) {
    console.error(
      `${new Date()} :::: cacheVariable function :::: varValue is missing`
    );
    throw new CustomError(
      "Could not save to cache - varValue is missing.",
      ErrorCodes.INTERNAL_SERVER_ERORR
    );
  }
  const cached = await RedisClient.set(varName, varValue);
  console.log(
    `${new Date()} :::: cacheVariable function :::: varName: ${varName} :::: varValue: ${varValue} ${cached}`
  );
  if (cached === "OK") {
    console.log(
      `${new Date()} :::: cacheVariable function :::: caching was succesfull`
    );
    return {
      action: "caching",
      success: true,
      message: "caching was succesfull",
    };
  }
  console.log(
    `${new Date()} :::: cacheVariable function :::: caching was not succesfull`
  );
  return {
    action: "caching",
    success: false,
    message: "caching was not succesfull",
  };
};

export const getVariable = async (varName: string) => {
  try {
    // const getAsync = promisify(RedisClient.get).bind(RedisClient);
    if (!varName) {
      console.error(
        `${new Date()} :::: getVariable method :::: varName is missing`
      );
      throw new CustomError(
        "Could not save to cache - varName is missing.",
        ErrorCodes.INTERNAL_SERVER_ERORR
      );
    }
    console.log(
      `${new Date()} :::: getVariable method :::: client.get method :::: varName :::: ${varName}`
    );
    const getResponse = await RedisClient.get(varName);
    console.log(getResponse, "LSLSKSKSKSLS")
    if (getResponse) {
      console.log(
        `${new Date()} :::: getVariable method :::: client.get method :::: response exist`
      );
      return {
        action: "get_cache",
        success: true,
        message: "cached value exist",
        value: JSON.parse(getResponse),
      };
    }
    console.log(
      `${new Date()} :::: getVariable method :::: client.get method :::: response do not exist`
    );
    return {
      action: "get_cache",
      success: false,
      message: "cached value does not exist",
    };
  } catch (error) {
    console.log("dddd", error);
  }
};
