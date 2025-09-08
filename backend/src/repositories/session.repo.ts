import { FocusSessionModel, FocusSessionDocument } from '../models/FocusSession';
import mongoose from 'mongoose';

export const sessionRepository = {
  async start(userId: string, payload: { taskId?: string; plannedMinutes?: number; note?: string }): Promise<FocusSessionDocument> {
    return FocusSessionModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      taskId: payload.taskId ? new mongoose.Types.ObjectId(payload.taskId) : undefined,
      plannedMinutes: payload.plannedMinutes,
      note: payload.note,
      startedAt: new Date(),
    } as any);
  },

  async stop(userId: string, id: string): Promise<FocusSessionDocument | null> {
    const session = await FocusSessionModel.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) }).exec();
    if (!session) return null;
    if (!session.endedAt) {
      session.endedAt = new Date();
      session.actualMinutes = Math.max(0, Math.round((session.endedAt.getTime() - session.startedAt.getTime()) / 60000));
      await session.save();
    }
    return session;
  },

  async list(userId: string, from?: string, to?: string): Promise<FocusSessionDocument[]> {
    const q: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (from || to) {
      q.startedAt = {};
      if (from) q.startedAt.$gte = new Date(from);
      if (to) q.startedAt.$lte = new Date(to);
    }
    return FocusSessionModel.find(q).sort({ startedAt: -1 }).exec();
  },
};





