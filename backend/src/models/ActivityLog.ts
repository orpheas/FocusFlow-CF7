import mongoose, { Schema, Document } from 'mongoose';

export type ActivityType = 'TASK_DONE';

export interface ActivityLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: ActivityType;
  taskId?: mongoose.Types.ObjectId;
  title?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<ActivityLogDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['TASK_DONE'], required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
  title: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export const ActivityLogModel = mongoose.model<ActivityLogDocument>('ActivityLog', ActivityLogSchema);


