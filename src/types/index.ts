export type Team = 'Team Red' | 'Team Blue' | 'Team Gold' | 'Team Black';

export type ContestantStatus = 'Active' | 'Evicted';

export interface Contestant {
  id: string;
  name: string;
  team: Team;
  points: number;
  status: ContestantStatus;
  isCaptain: boolean;
  isImmune: boolean;
  isNominated: boolean;
  isEvicted: boolean;
  tasksCompleted: number;
  avatarColor: string;
  addedAt: string;
}

export type TaskStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToType: 'individual' | 'team';
  assignedToId?: string; // contestant ID or Team string
  assignedToName: string;
  pointReward: number;
  durationMinutes: number;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface EvictionRecord {
  id: string;
  contestantId: string;
  name: string;
  team: Team;
  finalPoints: number;
  evictionTime: string;
  tasksCompleted: number;
  reason: string;
}

export type AnnouncementType = 
  | 'normal' 
  | 'captain' 
  | 'eviction' 
  | 'nomination' 
  | 'task' 
  | 'immunity' 
  | 'warning'
  | 'points';

export interface Announcement {
  id: string;
  content: string;
  timestamp: string;
  isAutomatic?: boolean;
  type: AnnouncementType;
}

export type ActivityType = 
  | 'points' 
  | 'nomination' 
  | 'immunity' 
  | 'captain' 
  | 'task' 
  | 'eviction' 
  | 'announcement' 
  | 'contestant' 
  | 'system';

export interface ActivityItem {
  id: string;
  timestamp: string;
  message: string;
  type: ActivityType;
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'contestants' 
  | 'leaderboard' 
  | 'tasks' 
  | 'nominations' 
  | 'captaincy' 
  | 'announcements' 
  | 'eviction';
