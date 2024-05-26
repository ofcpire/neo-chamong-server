import mongoose from 'mongoose';
import { CampingListSchema } from './schema';

export const campingModel = mongoose.model(
  'camping',
  CampingListSchema,
  'campings',
);
