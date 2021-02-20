import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const TransactionsSchema = new Schema(
  {
    amount: Number,
    beneficiary: Schema.Types.Mixed,
    narration: String,
    type: String,
    uid: String,
  },
  { timestamps: true }
);

TransactionsSchema.plugin(mongoosePaginate);

const Transactions = model("transactions", TransactionsSchema);

export default Transactions;
