import { google } from "googleapis";
import Question from "../@core/database/models/questions.model";
import Topics from "../@core/database/models/topics.model";
import { cacheData } from "../@core/database/redis-client";
const { config } = require("secreta");

const { SPREADSHEET_DOC } = config;

console.log(SPREADSHEET_DOC, "KSKKSKS");

export const loadTopicsData = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "src/@core/creds/client_secret.json", // the key file
      // url to spreadsheets API
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });
    const readData = await googleSheetsInstance.spreadsheets.values.get({
      auth, // auth object
      spreadsheetId: SPREADSHEET_DOC, // spreadsheet id
      range: "Topics", // range of cells to read from.
    });

    const data = readData.data.values?.map((data) => ({
      ...data.filter((i) => i.trim()),
    }));
    // console.log(data);
    data?.splice(0, 1);
    const topics = new Set();
    const subtopics = new Set();
    data?.forEach((item) => {
      topics.add(item["0"]);
      subtopics.add(item["1"]);
    });

    const children = Array.from(subtopics).map((topic: any) => {
      const topicname = data?.find((item) => item["1"] === topic);
      return {
        name: topic.trim(),
        topicname: !!topicname ? topicname["0"] : "",
        children: data
          ?.filter((item) => item["1"] === topic)
          .map((i) => {
            if (!!i["2"]) return { name: i["2"].trim(), children: [] };
          })
          .filter((x) => x),
      };
    });
    const parent = Array.from(topics).map((topic) => {
      return {
        name: topic,
        children: children.filter((child) => child.topicname === topic),
      };
    });

    const cacheRes = await cacheData({varName: 'Topics', varValue:JSON.stringify(parent)});
    console.log(cacheRes);
    await storeTopicsToDB(parent);
  } catch (error) {
    return error;
  }
};

export const loadQuestionsData = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "src/@core/creds/client_secret.json", // the key file
      // url to spreadsheets API
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    const authClientObject = await auth.getClient();
    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });
    const readData = await googleSheetsInstance.spreadsheets.values.get({
      auth, // auth object
      spreadsheetId: SPREADSHEET_DOC, // spreadsheet id
      range: "Questions", // range of cells to read from.
    });

    // Remove all empty strings from inner array
    const data: any = readData.data.values?.map((item) => item.filter((i) => i));
    data?.splice(0, 1);
    // console.log(data);

    let questionNumber;

    const d = data.flat().map((question) => {
      question = question.trim();
      if (isNaN(question.trim())) {
        return {
          questionNumber: questionNumber,
          question: question
        }
      } else {
          questionNumber = question;
      }
    }).filter(i => i);
    const questions = await Promise.all(d.map(async (questn) => {
      const topicData = await Topics.find({
      $or: [
      {"children.children.name": questn.question},
      {"children.name": questn.question}
      ]
    });
      return {
        questionNumber: questn.questionNumber,
        topic_ids: topicData.map(topic => topic._id)
      }
    }))

    // console.log(questions, "Questions");

    let cleanedQuestions = questions.map(question => {
      const all = questions.filter(q => q.questionNumber === question.questionNumber);
      return {
        questionNumber: question.questionNumber,
        topic_ids: all.flatMap(question => question.topic_ids)
      }
    })
    cleanedQuestions = [...Array.from(new Map(cleanedQuestions.map(item => [item['questionNumber'], item])).values())]

    // console.log("Cleaned Questions", cleanedQuestions);
    const cacheRes = await cacheData({varName: 'Questions', varValue: JSON.stringify(cleanedQuestions)});
    console.log(cacheRes);
    await storeQuestionsToDB(cleanedQuestions);
  } catch (error) {
    return error;
  }
};

export const storeQuestionsToDB = async (questions) => {
  try {
    await Question.insertMany(questions);
  } catch (error) {
    return error;
  }
}

export const storeTopicsToDB = async (topics) => {
  try {
    await Topics.insertMany(topics);
  } catch (error) {
    return error;
  }
}