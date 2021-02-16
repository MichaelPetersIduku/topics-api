import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const UserSchema = new Schema(
  {
    mobileNumber: String,
    firstName: String,
    middleName: String,
    lastName: String,
    bvn: String,
    dateOfBirth: String,
    emailAddress: String,
    gender: String,
    wallet: Schema.Types.Mixed,
    pin: String,
    password: String,
  },
  { timestamps: true }
);

UserSchema.index(
  { mobileNumber: "text", firstName: "text", lastName: "text" },
  {
    weights: {
      mobileNumber: 3,
      firstName: 2,
      lastName: 2,
    },
  }
);

UserSchema.plugin(mongoosePaginate);

const User: any = model("users", UserSchema);

export default User;
