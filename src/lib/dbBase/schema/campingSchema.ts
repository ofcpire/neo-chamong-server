import mongoose from 'mongoose';

export const CampingListSchema = new mongoose.Schema({
  totalRating: Number,
  contentId: Number,
  facltNm: String,
  lineIntro: String,
  intro: String,
  themaEnvrnCl: String,
  mapX: Number,
  mapY: Number,
  addr1: String,
  tel: String,
  homepage: String,
  resveCl: String,
  doNm: String,
  manageSttus: String,
  induty: String,
  firstImageUrl: String,
  createdtime: String,
  modifiedtime: String,
  featureNm: String,
  brazierCl: String,
  glampInnerFclty: String,
  caravInnerFclty: String,
  sbrsCl: String,
  animalCmgCl: String,
  exprnProgrmAt: String,
  exprnProgrm: String,
  posblFcltyCl: String,
  lctCl: String,
});

export const CampingReviewSchema = new mongoose.Schema({
  author: String,
  createdAt: Date,
  updatedAt: Date,
  reviewId: Number,
  content: String,
  rating: Number,
});
