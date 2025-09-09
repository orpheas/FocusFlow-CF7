import { ActivityLogModel, ActivityLogDocument, ActivityType } from '../models/ActivityLog';
import mongoose from 'mongoose';

export const activityRepository = {
  async create(userId: string, type: ActivityType, payload: { taskId?: string; title?: string }) {
    return ActivityLogModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      taskId: payload.taskId ? new mongoose.Types.ObjectId(payload.taskId) : undefined,
      title: payload.title,
    } as any);
  },
  async list(userId: string, from?: string, to?: string): Promise<ActivityLogDocument[]> {
    const q: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }
    return ActivityLogModel.find(q).sort({ createdAt: -1 }).exec();
  },
};






