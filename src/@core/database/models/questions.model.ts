import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const QuestionsSchema = new Schema(
  {
    questionNumber: { type: String, unique: true, dropDups: true },
    topic_ids: [String],
  },
  { timestamps: true }
);

QuestionsSchema.index({ questionNumber: 1 }, { unique: true });

QuestionsSchema.plugin(mongoosePaginate);

const Question = model("questions", QuestionsSchema);

export default Question;
