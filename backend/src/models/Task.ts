import mongoose, { Schema, Document } from 'mongoose';

export type Lane = 'NOW' | 'NEXT' | 'LATER';
export type TaskStatus = 'TODO' | 'DOING' | 'DONE' | 'SKIPPED';
export type Energy = 'LOW' | 'MED' | 'HIGH';

export interface TaskDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  notes?: string;
  lane: Lane;
  status: TaskStatus;
  energy?: Energy;
  friction?: number; // 0-3
  estimateMin?: number;
  scheduledFor?: string; // YYYY-MM-DD
  dueAt?: Date;
  tags?: string[];
}

const TaskSchema = new Schema<TaskDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true },
  notes: { type: String },
  lane: { type: String, enum: ['NOW', 'NEXT', 'LATER'], default: 'NEXT', index: true },
  status: { type: String, enum: ['TODO', 'DOING', 'DONE', 'SKIPPED'], default: 'TODO', index: true },
  energy: { type: String, enum: ['LOW', 'MED', 'HIGH'], index: true },
  friction: { type: Number, min: 0, max: 3, index: true },
  estimateMin: { type: Number },
  scheduledFor: { type: String, index: true },
  dueAt: { type: Date },
  tags: { type: [String], default: [] },
}, { timestamps: true });

TaskSchema.index({ userId: 1, scheduledFor: 1 });

export const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);






