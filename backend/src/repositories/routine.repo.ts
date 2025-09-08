import { RoutineModel, RoutineDocument } from '../models/Routine';
import mongoose from 'mongoose';

export const routineRepository = {
  async list(userId: string): Promise<RoutineDocument[]> {
    return RoutineModel.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  },
  async create(userId: string, body: any): Promise<RoutineDocument> {
    return RoutineModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: body.title,
      rrule: body.rrule,
      energy: body.energy,
      friction: body.friction,
      estimateMin: body.estimateMin,
      preferredWindow: body.preferredWindow,
    } as any);
  },
};





