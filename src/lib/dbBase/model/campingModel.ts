import mongoose from 'mongoose';
import { CampingListSchema } from '../schema/campingSchema';

export const campingListModel = mongoose.model(
  'camping',
  CampingListSchema,
  'campings',
);
