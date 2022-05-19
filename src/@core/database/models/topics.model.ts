import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ChildSchema = new Schema({
    name: String,
    children: [Object]
})

const TopicsSchema = new Schema(
  {
    name: {type: String, dropDups: true, unique: true},
    children: [ChildSchema],
  },
  { timestamps: true }
);

TopicsSchema.index({ name: 'text' }, {unique: true});

ChildSchema.index({name: 'text'});

TopicsSchema.plugin(mongoosePaginate);

const Topics = model("topics", TopicsSchema);

export default Topics;