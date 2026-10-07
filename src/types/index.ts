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
  assignedToId?: string;
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
  | 'system'
  | 'security';

export interface ActivityItem {
  id: string;
  timestamp: string;
  message: string;
  type: ActivityType;
  severity?: 'normal' | 'warning' | 'critical';
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

// Role-Based Access Control (RBAC) types
export type UserRole = 'big_boss' | 'producer' | 'surveillance';

export interface RoleConfig {
  id: UserRole;
  title: string;
  badge: string;
  clearanceLevel: number;
  description: string;
  color: string;
  canManagePoints: boolean;
  canEvict: boolean;
  canNominate: boolean;
  canManageTasks: boolean;
  canBroadcast: boolean;
  canResetHouse: boolean;
  canAddContestants: boolean;
}

// Event Notification types
export interface HouseNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  read: boolean;
  actionTab?: NavigationTab;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'contestants' 
  | 'leaderboard' 
  | 'tasks' 
  | 'nominations' 
  | 'captaincy' 
  | 'announcements' 
  | 'eviction'
  | 'analytics'
  | 'activity-log';
