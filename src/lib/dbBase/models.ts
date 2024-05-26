import mongoose from 'mongoose';
import { CampingListSchema } from './schema';

export const campingListModel = mongoose.model(
  'camping',
  CampingListSchema,
  'campings',
);
