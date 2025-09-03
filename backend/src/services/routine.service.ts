import createError from 'http-errors';
import { routineRepository } from '../repositories/routine.repo';
import { taskRepository } from '../repositories/task.repo';

export const routineService = {
  async list(userId: string) {
    return routineRepository.list(userId);
  },
  async create(userId: string, body: any) {
    const { title, rrule, energy, friction, estimateMin, preferredWindow } = body || {};
    if (!title) throw createError(400, 'TITLE_REQUIRED', { code: 'TITLE_REQUIRED' });
    if (!['DAILY', 'WEEKLY'].includes(rrule)) throw createError(400, 'INVALID_RRULE', { code: 'INVALID_RRULE' });
    if (friction != null && (friction < 0 || friction > 3)) throw createError(400, 'FRICTION_RANGE', { code: 'FRICTION_RANGE' });
    return routineRepository.create(userId, { title, rrule, energy, friction, estimateMin, preferredWindow });
  },
  async materializeToday(userId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const list = await routineRepository.list(userId);
    const created = [] as any[];
    for (const r of list) {
      created.push(
        await taskRepository.create({
          userId,
          title: r.title,
          lane: 'NEXT',
          status: 'TODO',
          energy: r.energy,
          friction: r.friction,
          estimateMin: r.estimateMin,
          scheduledFor: today,
        } as any)
      );
    }
    return created;
  },
};



