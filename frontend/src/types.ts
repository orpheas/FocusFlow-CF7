export type Lane = 'NOW' | 'NEXT' | 'LATER';
export type TaskStatus = 'TODO' | 'DOING' | 'DONE' | 'SKIPPED';
export type Energy = 'LOW' | 'MED' | 'HIGH';

export type Task = {
  _id: string;
  userId: string;
  title: string;
  notes?: string;
  lane: Lane;
  status: TaskStatus;
  energy?: Energy;
  friction?: number;
  estimateMin?: number;
  scheduledFor?: string; // YYYY-MM-DD
  dueAt?: string;
  tags?: string[];
};

export type FocusSession = {
  _id: string;
  userId: string;
  taskId?: string;
  startedAt: string;
  endedAt?: string;
  plannedMinutes?: number;
  actualMinutes?: number;
  note?: string;
};
