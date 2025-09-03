import { TaskModel, TaskDocument } from '../models/Task';
import mongoose from 'mongoose';

export const taskRepository = {
  async listByDate(userId: string, date: string): Promise<TaskDocument[]> {
    return TaskModel.find({ userId: new mongoose.Types.ObjectId(userId), scheduledFor: date })
      .sort({ createdAt: 1 })
      .exec();
  },

  async create(payload: Partial<TaskDocument> & { userId: string; title: string }): Promise<TaskDocument> {
    const doc = await TaskModel.create({
      ...payload,
      userId: new mongoose.Types.ObjectId(payload.userId),
    } as any);
    return doc;
  },

  async update(id: string, userId: string, updates: Partial<TaskDocument>): Promise<TaskDocument | null> {
    return TaskModel.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(userId) },
      { $set: updates },
      { new: true }
    ).exec();
  },

  async findById(id: string, userId: string): Promise<TaskDocument | null> {
    return TaskModel.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) }).exec();
  },
};



