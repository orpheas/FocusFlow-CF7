import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  passwordHash: string;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);


