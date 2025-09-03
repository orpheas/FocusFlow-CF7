import { UserModel, UserDocument } from '../models/User';

export const userRepository = {
  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).exec();
  },
  async create(user: Pick<UserDocument, 'email' | 'passwordHash' | 'name'>): Promise<UserDocument> {
    return UserModel.create(user);
  },
};



