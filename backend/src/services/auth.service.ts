import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { userRepository } from '../repositories/user.repo';
import { UserDocument } from '../models/User';

export type PublicUser = Pick<UserDocument, 'id' | 'email' | 'name' | 'role'>;

export const authService = {
  async register(email: string, password: string, name?: string): Promise<PublicUser> {
    if (!email || !password) throw createError(400, 'TITLE_REQUIRED', { code: 'EMAIL_PASSWORD_REQUIRED' });
    const existing = await userRepository.findByEmail(email);
    if (existing) throw createError(409, 'EMAIL_TAKEN', { code: 'EMAIL_TAKEN' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, passwordHash, name });
    return { id: user.id, email: user.email, name: user.name, role: user.role } as PublicUser;
  },

  async login(email: string, password: string): Promise<PublicUser> {
    const user = await userRepository.findByEmail(email);
    if (!user) throw createError(401, 'UNAUTHORIZED', { code: 'UNAUTHORIZED' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw createError(401, 'UNAUTHORIZED', { code: 'UNAUTHORIZED' });
    return { id: user.id, email: user.email, name: user.name, role: user.role } as PublicUser;
  },
};


