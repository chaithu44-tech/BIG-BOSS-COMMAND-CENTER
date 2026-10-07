import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Contestant, 
  Task, 
  EvictionRecord, 
  Announcement, 
  ActivityItem, 
  ToastItem, 
  Team, 
  ContestantStatus,
  NavigationTab,
  TaskStatus,
  AnnouncementType,
  UserRole,
  RoleConfig,
  HouseNotification,
} from '../types';
import { 
  INITIAL_CONTESTANTS, 
  INITIAL_TASKS, 
  INITIAL_EVICTIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ACTIVITIES 
} from '../data/initialData';
import { 
  formatCurrentTime, 
  generateUniqueId, 
  getTeamAvatarColor,
  playAttentionChime,
  speakAnnouncement
} from '../utils/helpers';

export const ROLES_CONFIG: Record<UserRole, RoleConfig> = {
  big_boss: {
    id: 'big_boss',
    title: 'Big Boss (Supreme)',
    badge: 'LVL 5 SUPREME',
    clearanceLevel: 5,
    description: 'Supreme executive authority. Full command over evictions, score modifications, decrees, and system overrides.',
    color: 'text-red-400 border-red-500 bg-red-950/70',
    canManagePoints: true,
    canEvict: true,
    canNominate: true,
    canManageTasks: true,
    canBroadcast: true,
    canResetHouse: true,
    canAddContestants: true,
  },
  producer: {
    id: 'producer',
    title: 'Show Producer',
    badge: 'LVL 3 OPERATIONAL',
    clearanceLevel: 3,
    description: 'Operational control. Can manage contestants, tasks, and announcements. Permanent eviction and system reset require Level 5 clearance.',
    color: 'text-amber-400 border-amber-500 bg-amber-950/70',
    canManagePoints: true,
    canEvict: false,
    canNominate: true,
    canManageTasks: true,
    canBroadcast: true,
    canResetHouse: false,
    canAddContestants: true,
  },
  surveillance: {
    id: 'surveillance',
    title: 'Surveillance Officer',
    badge: 'LVL 1 AUDIT ONLY',
    clearanceLevel: 1,
    description: 'Strict read-only monitoring. Inspect live feeds, leaderboard, analytics, and telemetry logs. Mutations and overrides are locked.',
    color: 'text-blue-400 border-blue-500 bg-blue-950/70',
    canManagePoints: false,
    canEvict: false,
    canNominate: false,
    canManageTasks: false,
    canBroadcast: false,
    canResetHouse: false,
    canAddContestants: false,
  },
};

const INITIAL_NOTIFICATIONS: HouseNotification[] = [
  {
    id: 'notif-1',
    title: 'Surveillance System Live',
    message: 'Primary surveillance feeds initialized across all 8 zones.',
    timestamp: '10:00:15',
    type: 'info',
    read: false,
    actionTab: 'dashboard',
  },
  {
    id: 'notif-2',
    title: 'Danger Zone Active',
    message: '3 contestants currently nominated for eviction this week.',
    timestamp: '10:04:30',
    type: 'warning',
    read: false,
    actionTab: 'nominations',
  },
  {
    id: 'notif-3',
    title: 'House Captaincy Decreed',
    message: 'Rahul appointed as House Captain with executive immunity.',
    timestamp: '10:12:00',
    type: 'success',
    read: false,
    actionTab: 'captaincy',
  },
];

interface HouseContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Role-Based Access Control (RBAC)
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  rolesConfig: Record<UserRole, RoleConfig>;
  hasPermission: (action: keyof Omit<RoleConfig, 'id' | 'title' | 'badge' | 'clearanceLevel' | 'description' | 'color'>) => boolean;
  checkPermissionOrWarn: (action: keyof Omit<RoleConfig, 'id' | 'title' | 'badge' | 'clearanceLevel' | 'description' | 'color'>, actionName?: string) => boolean;

  // Event Notifications
  notifications: HouseNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (title: string, message: string, type: 'critical' | 'warning' | 'info' | 'success', actionTab?: NavigationTab) => void;

  // Real-Time Activity Log Features
  isAutoLoggingActive: boolean;
  setIsAutoLoggingActive: (active: boolean) => void;
  clearActivities: () => void;
  exportActivities: (format: 'json' | 'csv') => void;

  // Voice Speech Synthesis
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (enabled: boolean) => void;
  speakCurrentAnnouncement: (text: string) => void;

  // Data Collections
  contestants: Contestant[];
  tasks: Task[];
  evictions: EvictionRecord[];
  announcements: Announcement[];
  activities: ActivityItem[];
  toasts: ToastItem[];

  // Computed Properties & Statistics
  activeContestants: Contestant[];
  evictedContestants: Contestant[];
  activeContestantsCount: number;
  evictedContestantsCount: number;
  houseCaptain: Contestant | null;
  highestScorer: Contestant | null;
  lowestScorer: Contestant | null;
  averagePoints: number;
  completedTasksCount: number;
  totalTasksCount: number;
  pendingTasksCount: number;
  activeTasksCount: number;
  currentNominees: Contestant[];
  immuneContestants: Contestant[];
  teamPoints: Record<Team, number>;

  // Timer State & Controls
  timerSeconds: number;
  initialTimerSeconds: number;
  isTimerRunning: boolean;
  isTimerExpired: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newSeconds?: number) => void;
  setCustomTimer: (seconds: number) => void;

  // Contestant Actions
  addContestant: (name: string, team: Team, startingPoints?: number, status?: ContestantStatus) => boolean;
  bulkImportContestants: (rawText: string, defaultTeam: Team, startingPoints: number) => number;
  editContestant: (id: string, updates: { name: string; team: Team; points: number; status: ContestantStatus }) => boolean;
  deleteContestant: (id: string) => boolean;

  // Point System
  addPoints: (id: string, amount: number) => void;
  deductPoints: (id: string, amount: number) => void;
  setCustomPoints: (id: string, exactAmount: number) => void;

  // Roles & Status
  nominateContestant: (id: string) => boolean;
  removeNomination: (id: string) => void;
  grantImmunity: (id: string) => boolean;
  removeImmunity: (id: string) => void;
  setCaptain: (id: string) => boolean;

  // Tasks
  createTask: (title: string, description: string, assignedToType: 'individual' | 'team', assignedToId: string, assignedToName: string, pointReward: number, durationMinutes: number) => void;
  startTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;

  // Eviction
  evictContestant: (id: string, reason?: string) => boolean;

  // Announcements & Activities
  makeAnnouncement: (content: string, type?: AnnouncementType) => void;
  addActivity: (message: string, type: ActivityItem['type'], severity?: ActivityItem['severity']) => void;

  // Toast
  addToast: (title: string, message: string, type: ToastItem['type'], duration?: number) => void;
  removeToast: (id: string) => void;

  // Global House Reset
  resetHouse: () => void;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

const STORAGE_KEY = 'big_boss_command_center_state_v2';

export const HouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Role-Based Access Control State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_role`);
      if (saved && (saved === 'big_boss' || saved === 'producer' || saved === 'surveillance')) {
        return saved as UserRole;
      }
    } catch (e) {
      console.warn('Role load failed', e);
    }
    return 'big_boss';
  });

  // Event Notifications State
  const [notifications, setNotifications] = useState<HouseNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Notifications load failed', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Real-Time auto surveillance telemetry generator
  const [isAutoLoggingActive, setIsAutoLoggingActive] = useState<boolean>(true);

  // Load persistent entities from local storage or fallback to initial data
  const [contestants, setContestants] = useState<Contestant[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_contestants`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load contestants from storage', e);
    }
    return INITIAL_CONTESTANTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load tasks from storage', e);
    }
    return INITIAL_TASKS;
  });

  const [evictions, setEvictions] = useState<EvictionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_evictions`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load evictions from storage', e);
    }
    return INITIAL_EVICTIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load announcements from storage', e);
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load activities from storage', e);
    }
    return INITIAL_ACTIVITIES;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Speech Voice Announcements
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);

  // Timer State (default 15 minutes = 900 seconds)
  const [initialTimerSeconds, setInitialTimerSeconds] = useState<number>(900);
  const [timerSeconds, setTimerSeconds] = useState<number>(900);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_role`, currentRole);
    } catch (e) {
      console.error('Save role failed', e);
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    } catch (e) {
      console.error('Save notifications failed', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_contestants`, JSON.stringify(contestants));
    } catch (e) {
      console.error('Save contestants failed', e);
    }
  }, [contestants]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    } catch (e) {
      console.error('Save tasks failed', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_evictions`, JSON.stringify(evictions));
    } catch (e) {
      console.error('Save evictions failed', e);
    }
  }, [evictions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
    } catch (e) {
      console.error('Save announcements failed', e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.error('Save activities failed', e);
    }
  }, [activities]);

  // Toast Helpers
  const addToast = useCallback((title: string, message: string, type: ToastItem['type'], duration = 4000) => {
    const id = generateUniqueId('toast');
    const newToast: ToastItem = { id, title, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Notification Helpers
  const addNotification = useCallback((
    title: string, 
    message: string, 
    type: 'critical' | 'warning' | 'info' | 'success', 
    actionTab?: NavigationTab
  ) => {
    const newNotif: HouseNotification = {
      id: generateUniqueId('notif'),
      title,
      message,
      timestamp: formatCurrentTime(),
      type,
      read: false,
      actionTab,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Read', 'All alerts marked as read.', 'info');
  }, [addToast]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    addToast('Cleared', 'Notification center cleared.', 'info');
  }, [addToast]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Activity Log Helper
  const addActivity = useCallback((message: string, type: ActivityItem['type'], severity: ActivityItem['severity'] = 'normal') => {
    const newActivity: ActivityItem = {
      id: generateUniqueId('act'),
      timestamp: formatCurrentTime(),
      message,
      type,
      severity,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 99)]);
  }, []);

  const clearActivities = useCallback(() => {
    setActivities([]);
    addToast('Logs Cleared', 'Surveillance activity logs flushed.', 'info');
  }, [addToast]);

  const exportActivities = useCallback((format: 'json' | 'csv') => {
    if (activities.length === 0) {
      addToast('Export Notice', 'No activity logs to export.', 'warning');
      return;
    }
    let dataStr = '';
    let fileName = `big_boss_logs_${Date.now()}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
      fileName += '.json';
      mimeType = 'application/json';
    } else {
      const header = 'id,timestamp,type,severity,message\n';
      const rows = activities
        .map((a) => `"${a.id}","${a.timestamp}","${a.type}","${a.severity || 'normal'}","${a.message.replace(/"/g, '""')}"`)
        .join('\n');
      dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows);
      fileName += '.csv';
      mimeType = 'text/csv';
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Export Generated', `Saved as ${fileName.toUpperCase()}`, 'success');
  }, [activities, addToast]);

  // Simulated live surveillance telemetry events every ~26s to make the command room truly real-time
  useEffect(() => {
    if (!isAutoLoggingActive) return;

    const telemetryEvents = [
      { msg: 'CAM-02 (Living Quarters): Audio sensor detected whisper cluster.', type: 'security' as const, sev: 'normal' as const },
      { msg: 'CAM-04 (Kitchen Area): Micro-activity logged during breakfast preparation.', type: 'system' as const, sev: 'normal' as const },
      { msg: 'BIOMETRIC SCANNER: All housemates vital signs within baseline range.', type: 'system' as const, sev: 'normal' as const },
      { msg: 'CONFESSION ROOM: Perimeter motion trigger active.', type: 'security' as const, sev: 'warning' as const },
      { msg: 'RADAR SWEEP: Task arena perimeter locked and ready.', type: 'task' as const, sev: 'normal' as const },
      { msg: 'CAM-07 (Gymnasium): Daily physical regime in progress.', type: 'system' as const, sev: 'normal' as const },
    ];

    const interval = setInterval(() => {
      const randomEvent = telemetryEvents[Math.floor(Math.random() * telemetryEvents.length)];
      addActivity(randomEvent.msg, randomEvent.type, randomEvent.sev);
    }, 26000);

    return () => clearInterval(interval);
  }, [isAutoLoggingActive, addActivity]);

  // Role Permissions
  const hasPermission = useCallback((action: keyof Omit<RoleConfig, 'id' | 'title' | 'badge' | 'clearanceLevel' | 'description' | 'color'>): boolean => {
    const config = ROLES_CONFIG[currentRole];
    return Boolean(config && config[action]);
  }, [currentRole]);

  const checkPermissionOrWarn = useCallback((
    action: keyof Omit<RoleConfig, 'id' | 'title' | 'badge' | 'clearanceLevel' | 'description' | 'color'>,
    actionName = 'this operation'
  ): boolean => {
    if (hasPermission(action)) {
      return true;
    }
    playAttentionChime('alert');
    const roleConfig = ROLES_CONFIG[currentRole];
    const roleTitle = roleConfig?.title || currentRole;
    addToast(
      'ACCESS RESTRICTED [403]', 
      `Clearance insufficient: ${roleTitle} cannot perform ${actionName}. Switch to Big Boss or Producer role.`, 
      'error',
      5000
    );
    addActivity(`Security Warning: Unauthorized ${actionName} attempted under ${roleTitle}.`, 'security', 'critical');
    addNotification(
      'Security Access Denied',
      `Clearance failure: ${roleTitle} attempted ${actionName} without requisite level clearance.`,
      'critical',
      'dashboard'
    );
    return false;
  }, [hasPermission, currentRole, addToast, addActivity, addNotification]);

  // Speech speaker helper
  const speakCurrentAnnouncement = useCallback((text: string) => {
    speakAnnouncement(text, true);
  }, []);

  // Announcement Helper
  const makeAnnouncement = useCallback((content: string, type: AnnouncementType = 'normal', isAutomatic = false) => {
    if (!isAutomatic && !checkPermissionOrWarn('canBroadcast', 'house announcements')) {
      return;
    }

    const cleanContent = content.trim();
    if (!cleanContent) return;

    const newAnn: Announcement = {
      id: generateUniqueId('ann'),
      content: cleanContent,
      timestamp: formatCurrentTime(),
      type,
      isAutomatic,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    addActivity(`Big Boss Announcement: "${cleanContent.substring(0, 45)}${cleanContent.length > 45 ? '...' : ''}"`, 'announcement');
    addNotification(
      'House Broadcast Issued',
      cleanContent.substring(0, 90),
      type === 'eviction' ? 'critical' : type === 'nomination' ? 'warning' : 'info',
      'announcements'
    );
    
    // Vocal speech pronunciation by Big Boss
    speakAnnouncement(cleanContent, isVoiceEnabled);

    if (!isAutomatic) {
      addToast('Announcement Broadcasted', 'The house announcement was made successfully.', 'success');
    }
  }, [checkPermissionOrWarn, addActivity, addNotification, addToast, isVoiceEnabled]);

  // Countdown Timer Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsTimerExpired(true);
            playAttentionChime('buzz');
            addToast('TIME UP', 'The House task countdown timer has expired!', 'error');
            addActivity('Task timer expired.', 'system', 'warning');
            addNotification('Task Timer Expired', 'The countdown has concluded. Housemates must stop task activities.', 'critical', 'tasks');
            makeAnnouncement('ATTENTION HOUSEMATES: The allotted task countdown timer has expired. Cease all activities immediately!', 'warning', true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, addToast, addActivity, addNotification, makeAnnouncement]);

  const startTimer = useCallback(() => {
    if (!checkPermissionOrWarn('canManageTasks', 'timer controls')) return;
    if (timerSeconds <= 0) {
      setTimerSeconds(initialTimerSeconds);
    }
    setIsTimerExpired(false);
    setIsTimerRunning(true);
    addToast('Timer Started', 'Countdown active.', 'info');
  }, [checkPermissionOrWarn, timerSeconds, initialTimerSeconds, addToast]);

  const pauseTimer = useCallback(() => {
    if (!checkPermissionOrWarn('canManageTasks', 'timer controls')) return;
    setIsTimerRunning(false);
    addToast('Timer Paused', 'Countdown halted.', 'warning');
  }, [checkPermissionOrWarn, addToast]);

  const resetTimer = useCallback((newSeconds?: number) => {
    if (!checkPermissionOrWarn('canManageTasks', 'timer controls')) return;
    setIsTimerRunning(false);
    setIsTimerExpired(false);
    const target = newSeconds !== undefined ? newSeconds : initialTimerSeconds;
    setInitialTimerSeconds(target);
    setTimerSeconds(target);
    addToast('Timer Reset', `Reset to ${Math.floor(target / 60)} minutes.`, 'info');
  }, [checkPermissionOrWarn, initialTimerSeconds, addToast]);

  const setCustomTimer = useCallback((seconds: number) => {
    if (!checkPermissionOrWarn('canManageTasks', 'timer configuration')) return;
    setIsTimerRunning(false);
    setIsTimerExpired(false);
    setInitialTimerSeconds(seconds);
    setTimerSeconds(seconds);
    addToast('Timer Configured', `Duration set to ${Math.floor(seconds / 60)}m ${seconds % 60}s.`, 'info');
  }, [checkPermissionOrWarn, addToast]);

  // Computed lists and statistics
  const activeContestants = useMemo(() => {
    return contestants.filter((c) => !c.isEvicted && c.status === 'Active');
  }, [contestants]);

  const evictedContestants = useMemo(() => {
    return contestants.filter((c) => c.isEvicted || c.status === 'Evicted');
  }, [contestants]);

  const activeContestantsCount = activeContestants.length;
  const evictedContestantsCount = evictions.length;

  const houseCaptain = useMemo(() => {
    return activeContestants.find((c) => c.isCaptain) || null;
  }, [activeContestants]);

  const highestScorer = useMemo(() => {
    if (activeContestants.length === 0) return null;
    return [...activeContestants].sort((a, b) => b.points - a.points)[0];
  }, [activeContestants]);

  const lowestScorer = useMemo(() => {
    if (activeContestants.length === 0) return null;
    return [...activeContestants].sort((a, b) => a.points - b.points)[0];
  }, [activeContestants]);

  const averagePoints = useMemo(() => {
    if (activeContestants.length === 0) return 0;
    const total = activeContestants.reduce((sum, c) => sum + c.points, 0);
    return Math.round(total / activeContestants.length);
  }, [activeContestants]);

  const completedTasksCount = useMemo(() => {
    return tasks.filter((t) => t.status === 'COMPLETED').length;
  }, [tasks]);

  const totalTasksCount = tasks.length;
  const pendingTasksCount = useMemo(() => tasks.filter((t) => t.status === 'PENDING').length, [tasks]);
  const activeTasksCount = useMemo(() => tasks.filter((t) => t.status === 'ACTIVE').length, [tasks]);

  const currentNominees = useMemo(() => {
    return activeContestants.filter((c) => c.isNominated);
  }, [activeContestants]);

  const immuneContestants = useMemo(() => {
    return activeContestants.filter((c) => c.isImmune);
  }, [activeContestants]);

  const teamPoints = useMemo(() => {
    const scores: Record<Team, number> = {
      'Team Red': 0,
      'Team Blue': 0,
      'Team Gold': 0,
      'Team Black': 0,
    };
    activeContestants.forEach((c) => {
      scores[c.team] = (scores[c.team] || 0) + c.points;
    });
    return scores;
  }, [activeContestants]);

  // Contestant Operations
  const addContestant = useCallback((name: string, team: Team, startingPoints = 0, status: ContestantStatus = 'Active'): boolean => {
    if (!checkPermissionOrWarn('canAddContestants', 'registering contestants')) return false;

    const cleanName = name.trim();
    if (!cleanName) {
      addToast('Validation Error', 'Contestant name cannot be empty.', 'error');
      return false;
    }

    const duplicate = contestants.some(
      (c) => !c.isEvicted && c.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      addToast('Duplicate Name', `A contestant named "${cleanName}" already exists in the House.`, 'error');
      return false;
    }

    const newContestant: Contestant = {
      id: generateUniqueId('c'),
      name: cleanName,
      team,
      points: Number(startingPoints) || 0,
      status,
      isCaptain: false,
      isImmune: false,
      isNominated: false,
      isEvicted: status === 'Evicted',
      tasksCompleted: 0,
      avatarColor: getTeamAvatarColor(team),
      addedAt: new Date().toISOString(),
    };

    setContestants((prev) => [...prev, newContestant]);
    addActivity(`New contestant added: ${cleanName}`, 'contestant');
    addNotification('Contestant Onboarded', `${cleanName} joined ${team} with ${startingPoints} points.`, 'info', 'contestants');
    addToast('Contestant Added', `"${cleanName}" added successfully to ${team}.`, 'success');
    return true;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification]);

  const bulkImportContestants = useCallback((rawText: string, defaultTeam: Team, startingPoints: number): number => {
    if (!checkPermissionOrWarn('canAddContestants', 'bulk contestant import')) return 0;

    const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) {
      addToast('Import Error', 'Please enter at least one contestant name.', 'warning');
      return 0;
    }

    let addedCount = 0;
    const existingNames = new Set(
      contestants.filter((c) => !c.isEvicted).map((c) => c.name.toLowerCase())
    );

    const newEntries: Contestant[] = [];

    lines.forEach((name) => {
      if (!existingNames.has(name.toLowerCase())) {
        existingNames.add(name.toLowerCase());
        newEntries.push({
          id: generateUniqueId('c'),
          name,
          team: defaultTeam,
          points: Number(startingPoints) || 0,
          status: 'Active',
          isCaptain: false,
          isImmune: false,
          isNominated: false,
          isEvicted: false,
          tasksCompleted: 0,
          avatarColor: getTeamAvatarColor(defaultTeam),
          addedAt: new Date().toISOString(),
        });
        addedCount++;
      }
    });

    if (newEntries.length > 0) {
      setContestants((prev) => [...prev, ...newEntries]);
      addActivity(`Bulk imported ${addedCount} contestants to ${defaultTeam}.`, 'contestant');
      addNotification('Bulk Import Completed', `${addedCount} new contestants enrolled into ${defaultTeam}.`, 'info', 'contestants');
      addToast('Import Successful', `${addedCount} contestants imported successfully.`, 'success');
    } else {
      addToast('Import Notice', 'No new unique contestants found to import.', 'warning');
    }

    return addedCount;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification]);

  const editContestant = useCallback((id: string, updates: { name: string; team: Team; points: number; status: ContestantStatus }): boolean => {
    if (!checkPermissionOrWarn('canAddContestants', 'editing contestant dossiers')) return false;

    const cleanName = updates.name.trim();
    if (!cleanName) {
      addToast('Validation Error', 'Contestant name cannot be empty.', 'error');
      return false;
    }

    const duplicate = contestants.some(
      (c) => c.id !== id && !c.isEvicted && c.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      addToast('Duplicate Name', `A contestant named "${cleanName}" already exists.`, 'error');
      return false;
    }

    setContestants((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isNowEvicted = updates.status === 'Evicted';
          return {
            ...c,
            name: cleanName,
            team: updates.team,
            points: Number(updates.points) || 0,
            status: updates.status,
            isEvicted: isNowEvicted,
            isCaptain: isNowEvicted ? false : c.isCaptain,
            isImmune: isNowEvicted ? false : c.isImmune,
            isNominated: isNowEvicted ? false : c.isNominated,
            avatarColor: getTeamAvatarColor(updates.team),
          };
        }
        return c;
      })
    );

    addActivity(`Contestant ${cleanName} details updated.`, 'contestant');
    addToast('Updated', `Contestant ${cleanName} updated successfully.`, 'success');
    return true;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity]);

  const deleteContestant = useCallback((id: string): boolean => {
    if (!checkPermissionOrWarn('canAddContestants', 'deleting contestants')) return false;

    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted || target.status === 'Evicted') {
      addToast('Action Blocked', 'Cannot delete an evicted contestant from history.', 'error');
      return false;
    }

    setContestants((prev) => prev.filter((c) => c.id !== id));
    addActivity(`Contestant "${target.name}" was removed from the House.`, 'contestant');
    addToast('Contestant Removed', `"${target.name}" was deleted.`, 'info');
    return true;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity]);

  // Points Actions
  const addPoints = useCallback((id: string, amount: number) => {
    if (!checkPermissionOrWarn('canManagePoints', 'awarding points')) return;

    const target = contestants.find((c) => c.id === id);
    if (!target) return;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot receive points.', 'error');
      return;
    }

    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, points: c.points + amount } : c))
    );

    const message = `${target.name} gained +${amount} points.`;
    addActivity(message, 'points');
    addNotification('Score Adjustment', `${target.name} awarded +${amount} points.`, 'info', 'leaderboard');
    addToast('Points Awarded', message, 'success');
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification]);

  const deductPoints = useCallback((id: string, amount: number) => {
    if (!checkPermissionOrWarn('canManagePoints', 'deducting points')) return;

    const target = contestants.find((c) => c.id === id);
    if (!target) return;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot have points altered.', 'error');
      return;
    }

    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, points: c.points - amount } : c))
    );

    const message = `${target.name} lost -${amount} points.`;
    addActivity(message, 'points', 'warning');
    addNotification('Score Penalty', `${target.name} penalized -${amount} points.`, 'warning', 'leaderboard');
    addToast('Points Deducted', message, 'warning');
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification]);

  const setCustomPoints = useCallback((id: string, exactAmount: number) => {
    if (!checkPermissionOrWarn('canManagePoints', 'setting exact score')) return;

    const target = contestants.find((c) => c.id === id);
    if (!target) return;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot have points altered.', 'error');
      return;
    }

    const diff = exactAmount - target.points;
    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, points: exactAmount } : c))
    );

    const message = `${target.name}'s points updated to ${exactAmount} (${diff >= 0 ? '+' : ''}${diff}).`;
    addActivity(message, 'points');
    addNotification('Score Overwrite', `${target.name} points directly set to ${exactAmount}.`, 'info', 'leaderboard');
    addToast('Points Updated', message, 'info');
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification]);

  // Nominations & Immunity
  const nominateContestant = useCallback((id: string): boolean => {
    if (!checkPermissionOrWarn('canNominate', 'nominating contestants')) return false;

    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot be nominated.', 'error');
      return false;
    }

    if (target.isImmune) {
      addToast('Action Blocked', `Cannot nominate ${target.name} — contestant is immune.`, 'error');
      return false;
    }

    if (target.isNominated) {
      addToast('Already Nominated', `${target.name} is already in the Danger Zone.`, 'warning');
      return false;
    }

    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isNominated: true } : c))
    );

    playAttentionChime('alert');
    addActivity(`${target.name} was nominated for eviction.`, 'nomination', 'warning');
    addNotification('Danger Zone Alert', `${target.name} has been placed on the eviction ballot.`, 'warning', 'nominations');
    addToast('Nominated', `${target.name} is now nominated.`, 'warning');
    makeAnnouncement(`NOMINATION ALERT: ${target.name} has been placed in the Danger Zone facing eviction.`, 'nomination', true);
    return true;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification, makeAnnouncement]);

  const removeNomination = useCallback((id: string) => {
    if (!checkPermissionOrWarn('canNominate', 'clearing nominations')) return;

    const target = contestants.find((c) => c.id === id);
    if (!target || !target.isNominated) return;

    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isNominated: false } : c))
    );

    addActivity(`${target.name}'s nomination was revoked.`, 'nomination');
    addNotification('Nomination Revoked', `${target.name} was removed from the Danger Zone.`, 'info', 'nominations');
    addToast('Nomination Cleared', `${target.name} removed from Danger Zone.`, 'info');
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification]);

  const grantImmunity = useCallback((id: string): boolean => {
    if (!checkPermissionOrWarn('canNominate', 'granting immunity')) return false;

    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot receive immunity.', 'error');
      return false;
    }

    setContestants((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isImmune: true,
              isNominated: false,
            }
          : c
      )
    );

    playAttentionChime('complete');
    addActivity(`${target.name} received immunity.`, 'immunity');
    addNotification('Immunity Granted', `🛡 ${target.name} secured immunity from eviction.`, 'success', 'contestants');
    addToast('Immunity Granted', `🛡 ${target.name} is now immune from eviction.`, 'success');
    makeAnnouncement(`IMMUNITY CONFIRMED: ${target.name} has secured full immunity and cannot be nominated.`, 'immunity', true);
    return true;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification, makeAnnouncement]);

  const removeImmunity = useCallback((id: string) => {
    if (!checkPermissionOrWarn('canNominate', 'revoking immunity')) return;

    const target = contestants.find((c) => c.id === id);
    if (!target || !target.isImmune) return;

    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isImmune: false } : c))
    );

    addActivity(`${target.name}'s immunity was removed.`, 'immunity');
    addToast('Immunity Revoked', `${target.name} is no longer immune.`, 'info');
  }, [checkPermissionOrWarn, contestants, addToast, addActivity]);

  // Captaincy
  const setCaptain = useCallback((id: string): boolean => {
    if (!checkPermissionOrWarn('canNominate', 'appointing captaincy')) return false;

    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot become House Captain.', 'error');
      return false;
    }

    setContestants((prev) =>
      prev.map((c) => ({
        ...c,
        isCaptain: c.id === id,
        isImmune: c.id === id ? true : c.isImmune,
        isNominated: c.id === id ? false : c.isNominated,
      }))
    );

    playAttentionChime('complete');
    addActivity(`${target.name} became House Captain.`, 'captain');
    addNotification('New Captain Crowned', `👑 ${target.name} appointed House Captain with immunity.`, 'success', 'captaincy');
    addToast('Captain Changed', `👑 ${target.name} is now the House Captain.`, 'success');
    makeAnnouncement(`BIG BOSS ANNOUNCEMENT: ${target.name} is now the House Captain.`, 'captain', true);
    return true;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification, makeAnnouncement]);

  // Tasks Management
  const createTask = useCallback((
    title: string, 
    description: string, 
    assignedToType: 'individual' | 'team', 
    assignedToId: string, 
    assignedToName: string, 
    pointReward: number, 
    durationMinutes: number
  ) => {
    if (!checkPermissionOrWarn('canManageTasks', 'creating tasks')) return;

    const newTask: Task = {
      id: generateUniqueId('task'),
      title: title.trim(),
      description: description.trim(),
      assignedToType,
      assignedToId,
      assignedToName,
      pointReward: Number(pointReward) || 50,
      durationMinutes: Number(durationMinutes) || 15,
      status: 'PENDING',
      createdAt: formatCurrentTime(),
    };

    setTasks((prev) => [newTask, ...prev]);
    addActivity(`New task created: "${title}" (Assigned: ${assignedToName})`, 'task');
    addNotification('Task Dispatched', `"${title}" assigned to ${assignedToName} (${pointReward} pts).`, 'info', 'tasks');
    addToast('Task Created', `Task "${title}" created successfully.`, 'success');
  }, [checkPermissionOrWarn, addToast, addActivity, addNotification]);

  const startTask = useCallback((taskId: string) => {
    if (!checkPermissionOrWarn('canManageTasks', 'starting tasks')) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'ACTIVE' } : t))
    );

    if (task.durationMinutes > 0) {
      setInitialTimerSeconds(task.durationMinutes * 60);
      setTimerSeconds(task.durationMinutes * 60);
      setIsTimerRunning(true);
      setIsTimerExpired(false);
    }

    addActivity(`Task "${task.title}" has started.`, 'task');
    addNotification('Task Commenced', `"${task.title}" is in progress. Timer started.`, 'info', 'tasks');
    addToast('Task Started', `Task "${task.title}" is now active. Countdown initialized.`, 'info');
    makeAnnouncement(`TASK COMMENCED: All contestants participating in "${task.title}" must begin immediately.`, 'task', true);
  }, [checkPermissionOrWarn, tasks, addToast, addActivity, addNotification, makeAnnouncement]);

  const completeTask = useCallback((taskId: string) => {
    if (!checkPermissionOrWarn('canManageTasks', 'completing tasks')) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'COMPLETED') return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'COMPLETED', completedAt: formatCurrentTime() }
          : t
      )
    );

    const reward = task.pointReward;
    if (reward > 0) {
      if (task.assignedToType === 'individual' && task.assignedToId) {
        setContestants((prev) =>
          prev.map((c) =>
            c.id === task.assignedToId && !c.isEvicted
              ? { ...c, points: c.points + reward, tasksCompleted: c.tasksCompleted + 1 }
              : c
          )
        );
      } else if (task.assignedToType === 'team' && task.assignedToId) {
        const teamName = task.assignedToId as Team;
        setContestants((prev) =>
          prev.map((c) =>
            c.team === teamName && !c.isEvicted
              ? { ...c, points: c.points + reward, tasksCompleted: c.tasksCompleted + 1 }
              : c
          )
        );
      }
    }

    playAttentionChime('complete');
    addActivity(`Task "${task.title}" completed. +${reward} pts rewarded to ${task.assignedToName}.`, 'task');
    addNotification('Task Concluded', `"${task.title}" completed! +${reward} points distributed.`, 'success', 'tasks');
    addToast('Task Completed', `"${task.title}" completed! Points awarded.`, 'success');
    makeAnnouncement(`TASK COMPLETED: "${task.title}" successfully concluded. ${task.assignedToName} awarded ${reward} points.`, 'task', true);
  }, [checkPermissionOrWarn, tasks, addToast, addActivity, addNotification, makeAnnouncement]);

  // Eviction Workflow
  const evictContestant = useCallback((id: string, reason = 'Direct eviction order'): boolean => {
    // Eviction strictly requires Level 5 Supreme Big Boss authority!
    if (!checkPermissionOrWarn('canEvict', 'executing permanent eviction')) return false;

    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted) {
      addToast('Already Evicted', `${target.name} has already been evicted.`, 'warning');
      return false;
    }

    const evictionTimestamp = `Day 05, ${formatCurrentTime()}`;

    const newRecord: EvictionRecord = {
      id: generateUniqueId('ev'),
      contestantId: target.id,
      name: target.name,
      team: target.team,
      finalPoints: target.points,
      evictionTime: evictionTimestamp,
      tasksCompleted: target.tasksCompleted,
      reason,
    };

    setEvictions((prev) => [newRecord, ...prev]);

    setContestants((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'Evicted',
              isEvicted: true,
              isCaptain: false,
              isImmune: false,
              isNominated: false,
            }
          : c
      )
    );

    playAttentionChime('evict');
    addActivity(`Contestant ${target.name} was evicted from the House.`, 'eviction', 'critical');
    addNotification(
      'CONTESTANT EXPELLED',
      `${target.name} evicted from Big Boss house with ${target.points} final points.`,
      'critical',
      'eviction'
    );
    addToast('EVICTION EXECUTED', `🔴 ${target.name} has been evicted from the House.`, 'error', 6000);
    makeAnnouncement(`🔴 BIG BOSS ANNOUNCEMENT: ${target.name} has been evicted from the House. They must exit via the main tunnel immediately.`, 'eviction', true);
    return true;
  }, [checkPermissionOrWarn, contestants, addToast, addActivity, addNotification, makeAnnouncement]);

  // Reset House
  const resetHouse = useCallback(() => {
    if (!checkPermissionOrWarn('canResetHouse', 'wiping and resetting the entire house state')) return;

    localStorage.removeItem(`${STORAGE_KEY}_contestants`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_evictions`);
    localStorage.removeItem(`${STORAGE_KEY}_announcements`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);

    setContestants(INITIAL_CONTESTANTS);
    setTasks(INITIAL_TASKS);
    setEvictions(INITIAL_EVICTIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setActivities(INITIAL_ACTIVITIES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTimerSeconds(900);
    setInitialTimerSeconds(900);
    setIsTimerRunning(false);
    setIsTimerExpired(false);

    playAttentionChime('alert');
    addToast('House Reset', 'Big Boss Command Center restored to initial state.', 'info');
  }, [checkPermissionOrWarn, addToast]);

  return (
    <HouseContext.Provider
      value={{
        activeTab,
        setActiveTab,

        // Role-Based Access Control
        currentRole,
        setCurrentRole,
        rolesConfig: ROLES_CONFIG,
        hasPermission,
        checkPermissionOrWarn,

        // Event Notifications
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addNotification,

        // Activity Log Features
        isAutoLoggingActive,
        setIsAutoLoggingActive,
        clearActivities,
        exportActivities,

        // Voice Speech
        isVoiceEnabled,
        setIsVoiceEnabled,
        speakCurrentAnnouncement,

        // Data Collections
        contestants,
        tasks,
        evictions,
        announcements,
        activities,
        toasts,

        // Computed Properties & Statistics
        activeContestants,
        evictedContestants,
        activeContestantsCount,
        evictedContestantsCount,
        houseCaptain,
        highestScorer,
        lowestScorer,
        averagePoints,
        completedTasksCount,
        totalTasksCount,
        pendingTasksCount,
        activeTasksCount,
        currentNominees,
        immuneContestants,
        teamPoints,

        // Timer
        timerSeconds,
        initialTimerSeconds,
        isTimerRunning,
        isTimerExpired,
        startTimer,
        pauseTimer,
        resetTimer,
        setCustomTimer,

        // Contestant Operations
        addContestant,
        bulkImportContestants,
        editContestant,
        deleteContestant,

        // Points
        addPoints,
        deductPoints,
        setCustomPoints,

        // Nominations & Captaincy
        nominateContestant,
        removeNomination,
        grantImmunity,
        removeImmunity,
        setCaptain,

        // Tasks
        createTask,
        startTask,
        completeTask,

        // Eviction
        evictContestant,

        // Announcements & Activities
        makeAnnouncement,
        addActivity,

        // Toast & Reset
        addToast,
        removeToast,
        resetHouse,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

export const useHouse = (): HouseContextType => {
  const context = useContext(HouseContext);
  if (!context) {
    throw new Error('useHouse must be used within a HouseProvider');
  }
  return context;
};
