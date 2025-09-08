import mongoose, { Schema, Document } from 'mongoose';

export type RRule = 'DAILY' | 'WEEKLY';

export interface RoutineDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  rrule: RRule;
  energy?: 'LOW' | 'MED' | 'HIGH';
  friction?: number; // 0-3
  estimateMin?: number;
  preferredWindow?: string;
}

const RoutineSchema = new Schema<RoutineDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, required: true },
  rrule: { type: String, enum: ['DAILY', 'WEEKLY'], required: true },
  energy: { type: String, enum: ['LOW', 'MED', 'HIGH'] },
  friction: { type: Number, min: 0, max: 3 },
  estimateMin: { type: Number },
  preferredWindow: { type: String },
}, { timestamps: true });

RoutineSchema.index({ userId: 1 });

export const RoutineModel = mongoose.model<RoutineDocument>('Routine', RoutineSchema);





