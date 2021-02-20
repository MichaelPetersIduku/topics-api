import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const UserSchema = new Schema(
  {
    xMobile: String,
    fName: String,
    sName: String,
    dob: String,
    email: String,
    sex: String,
    wallet: Schema.Types.Mixed,
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

const User = model("users", UserSchema);

export default User;
