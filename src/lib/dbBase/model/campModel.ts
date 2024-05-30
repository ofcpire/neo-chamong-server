import mongoose from 'mongoose';
import { CampListSchema, CampKeywordSchema } from '../schema/campSchema';

export const campListModel = mongoose.model('camp', CampListSchema, 'camps');

export const campKeywordModel = mongoose.model(
  'keyword',
  CampKeywordSchema,
  'keywords',
);
