import mongoose from 'mongoose';
import { MemberSchema } from '../schema/memberSchema';

export const memberModel = mongoose.model('member', MemberSchema, 'members');
