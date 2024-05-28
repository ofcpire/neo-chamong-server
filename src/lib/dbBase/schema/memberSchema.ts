import mongoose from 'mongoose';

export const MemberSchema = new mongoose.Schema({
  id: Number,
  email: String,
  nickname: String,
  password: String,
  profileImg: String,
  about: String,
  car_name: String,
  oil_info: String,
});
