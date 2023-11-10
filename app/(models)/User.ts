import mongoose, { Schema } from 'mongoose';

mongoose.connect(process?.env?.MONGODB_URI as string);
mongoose.Promise = global.Promise;

export interface UserAttrs {
  name?: string;
  email: string;
  password: string;
}

// User collection properties and methods.
// User model interface
export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// What properties a single User has.
// User DOC interface
export interface UserDoc extends mongoose.Document {
  name?: string;
  email: string;
  password: string;
}

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const User =
  (mongoose.models.User as UserModel) || mongoose.model('User', userSchema);

export default User;
