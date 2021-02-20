import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const CardsSchema = new Schema(
  {
    uid: String,
    bank_code: String,
    account_no: String,
    authorization_code: String,
    bin: String,
    last4: String,
    exp_month: String,
    exp_year: String,
    channel: String,
    card_type: String,
    bank: String,
    country_code: String,
    brand: String,
    default: Boolean,
  },
  { timestamps: true }
);

CardsSchema.plugin(mongoosePaginate);

const Cards = model("cards", CardsSchema);

export default Cards;
