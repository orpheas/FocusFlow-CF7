import createError from 'http-errors';
import { sessionRepository } from '../repositories/session.repo';

export const sessionService = {
  async start(userId: string, body: any) {
    const { taskId, plannedMinutes, note } = body || {};
    if (plannedMinutes != null && (plannedMinutes <= 0 || plannedMinutes > 600)) {
      throw createError(400, 'INVALID_PLANNED_MINUTES', { code: 'INVALID_PLANNED_MINUTES' });
    }
    return sessionRepository.start(userId, { taskId, plannedMinutes, note });
  },
  async stop(userId: string, id: string) {
    const s = await sessionRepository.stop(userId, id);
    if (!s) throw createError(404, 'NOT_FOUND', { code: 'NOT_FOUND' });
    return s;
  },
  async list(userId: string, from?: string, to?: string) {
    return sessionRepository.list(userId, from, to);
  },
};





