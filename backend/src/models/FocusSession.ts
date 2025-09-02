import mongoose, { Schema, Document } from 'mongoose';

export interface FocusSessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  plannedMinutes?: number;
  actualMinutes?: number;
  note?: string;
}

const FocusSessionSchema = new Schema<FocusSessionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', index: true },
  startedAt: { type: Date, required: true, index: true },
  endedAt: { type: Date },
  plannedMinutes: { type: Number },
  actualMinutes: { type: Number },
  note: { type: String },
}, { timestamps: true });

FocusSessionSchema.index({ userId: 1, startedAt: 1 });

export const FocusSessionModel = mongoose.model<FocusSessionDocument>('FocusSession', FocusSessionSchema);


