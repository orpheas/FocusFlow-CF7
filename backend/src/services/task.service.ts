import createError from 'http-errors';
import { taskRepository } from '../repositories/task.repo';
import { activityRepository } from '../repositories/activity.repo';
import { TaskDocument, Lane, TaskStatus, Energy } from '../models/Task';

export const taskService = {
  async list(userId: string, date: string): Promise<TaskDocument[]> {
    const effectiveDate = date || new Date().toISOString().slice(0, 10);
    return taskRepository.listByDate(userId, effectiveDate);
  },

  async create(userId: string, body: any): Promise<TaskDocument> {
    const { title, lane, energy, friction, estimateMin, scheduledFor, notes, tags } = body;
    if (!title || !String(title).trim()) throw createError(400, 'TITLE_REQUIRED', { code: 'TITLE_REQUIRED' });
    if (friction != null && (friction < 0 || friction > 3)) throw createError(400, 'FRICTION_RANGE', { code: 'FRICTION_RANGE' });
    if (lane && !['NOW', 'NEXT', 'LATER'].includes(lane)) throw createError(400, 'INVALID_LANE', { code: 'INVALID_LANE' });
    if (energy && !['LOW', 'MED', 'HIGH'].includes(energy)) throw createError(400, 'INVALID_ENERGY', { code: 'INVALID_ENERGY' });
    const task = await taskRepository.create({
      userId,
      title: String(title),
      lane: (lane as Lane) || 'NEXT',
      status: 'TODO',
      energy: energy as Energy,
      friction,
      estimateMin,
      scheduledFor: scheduledFor || new Date().toISOString().slice(0, 10),
      notes,
      tags,
    } as any);
    return task;
  },

  async update(userId: string, id: string, body: any): Promise<TaskDocument> {
    const updates: Partial<TaskDocument> = {} as any;
    const allowed = ['title', 'notes', 'lane', 'status', 'energy', 'friction', 'estimateMin', 'scheduledFor', 'dueAt', 'tags'];
    for (const key of allowed) {
      if (body[key] !== undefined) (updates as any)[key] = body[key];
    }
    if (updates.friction != null && (updates.friction < 0 || updates.friction > 3)) throw createError(400, 'FRICTION_RANGE', { code: 'FRICTION_RANGE' });
    if (updates.lane && !['NOW', 'NEXT', 'LATER'].includes(updates.lane)) throw createError(400, 'INVALID_LANE', { code: 'INVALID_LANE' });
    if (updates.energy && !['LOW', 'MED', 'HIGH'].includes(updates.energy)) throw createError(400, 'INVALID_ENERGY', { code: 'INVALID_ENERGY' });
    const updated = await taskRepository.update(id, userId, updates);
    if (!updated) throw createError(404, 'NOT_FOUND', { code: 'NOT_FOUND' });
    return updated;
  },

  async markDone(userId: string, id: string): Promise<TaskDocument> {
    const task = await taskRepository.findById(id, userId);
    if (!task) throw createError(404, 'NOT_FOUND', { code: 'NOT_FOUND' });
    task.status = 'DONE';
    task.lane = 'LATER';
    await task.save();
    // Log activity separately for History (not a focus session)
    try {
      await activityRepository.create(userId, 'TASK_DONE', { taskId: id, title: task.title });
    } catch {}
    return task;
  },
};


