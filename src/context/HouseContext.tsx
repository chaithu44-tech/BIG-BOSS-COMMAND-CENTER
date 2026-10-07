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
  AnnouncementType
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

interface HouseContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

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
  addActivity: (message: string, type: ActivityItem['type']) => void;

  // Toast
  addToast: (title: string, message: string, type: ToastItem['type'], duration?: number) => void;
  removeToast: (id: string) => void;

  // Global House Reset
  resetHouse: () => void;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

const STORAGE_KEY = 'big_boss_command_center_state_v1';

export const HouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Load from local storage or fallback to initial data
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

  // Sync state changes to localStorage
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

  // Activity Log Helper
  const addActivity = useCallback((message: string, type: ActivityItem['type']) => {
    const newActivity: ActivityItem = {
      id: generateUniqueId('act'),
      timestamp: formatCurrentTime(),
      message,
      type,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 49)]); // keep latest 50
  }, []);

  // Speech speaker helper
  const speakCurrentAnnouncement = useCallback((text: string) => {
    speakAnnouncement(text, true);
  }, []);

  // Announcement Helper
  const makeAnnouncement = useCallback((content: string, type: AnnouncementType = 'normal', isAutomatic = false) => {
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
    addActivity(`Big Boss Announcement: "${cleanContent.substring(0, 40)}${cleanContent.length > 40 ? '...' : ''}"`, 'announcement');
    
    // Vocal speech pronunciation by Big Boss
    speakAnnouncement(cleanContent, isVoiceEnabled);

    if (!isAutomatic) {
      addToast('Announcement Broadcasted', 'The house announcement was made successfully.', 'success');
    }
  }, [addActivity, addToast, isVoiceEnabled]);

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
            addActivity('Task timer expired.', 'system');
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
  }, [isTimerRunning, timerSeconds, addToast, addActivity, makeAnnouncement]);

  const startTimer = useCallback(() => {
    if (timerSeconds <= 0) {
      setTimerSeconds(initialTimerSeconds);
    }
    setIsTimerExpired(false);
    setIsTimerRunning(true);
    addToast('Timer Started', 'Countdown active.', 'info');
  }, [timerSeconds, initialTimerSeconds, addToast]);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
    addToast('Timer Paused', 'Countdown halted.', 'warning');
  }, [addToast]);

  const resetTimer = useCallback((newSeconds?: number) => {
    setIsTimerRunning(false);
    setIsTimerExpired(false);
    const target = newSeconds !== undefined ? newSeconds : initialTimerSeconds;
    setInitialTimerSeconds(target);
    setTimerSeconds(target);
    addToast('Timer Reset', `Reset to ${Math.floor(target / 60)} minutes.`, 'info');
  }, [initialTimerSeconds, addToast]);

  const setCustomTimer = useCallback((seconds: number) => {
    setIsTimerRunning(false);
    setIsTimerExpired(false);
    setInitialTimerSeconds(seconds);
    setTimerSeconds(seconds);
    addToast('Timer Configured', `Duration set to ${Math.floor(seconds / 60)}m ${seconds % 60}s.`, 'info');
  }, [addToast]);

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
    addToast('Contestant Added', `"${cleanName}" added successfully to ${team}.`, 'success');
    return true;
  }, [contestants, addToast, addActivity]);

  const bulkImportContestants = useCallback((rawText: string, defaultTeam: Team, startingPoints: number): number => {
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
      addToast('Import Successful', `${addedCount} contestants imported successfully.`, 'success');
    } else {
      addToast('Import Notice', 'No new unique contestants found to import.', 'warning');
    }

    return addedCount;
  }, [contestants, addToast, addActivity]);

  const editContestant = useCallback((id: string, updates: { name: string; team: Team; points: number; status: ContestantStatus }): boolean => {
    const cleanName = updates.name.trim();
    if (!cleanName) {
      addToast('Validation Error', 'Contestant name cannot be empty.', 'error');
      return false;
    }

    // Check duplicate name excluding self
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
  }, [contestants, addToast, addActivity]);

  const deleteContestant = useCallback((id: string): boolean => {
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
  }, [contestants, addToast, addActivity]);

  // Points Actions
  const addPoints = useCallback((id: string, amount: number) => {
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
    addToast('Points Awarded', message, 'success');
  }, [contestants, addToast, addActivity]);

  const deductPoints = useCallback((id: string, amount: number) => {
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
    addActivity(message, 'points');
    addToast('Points Deducted', message, 'warning');
  }, [contestants, addToast, addActivity]);

  const setCustomPoints = useCallback((id: string, exactAmount: number) => {
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
    addToast('Points Updated', message, 'info');
  }, [contestants, addToast, addActivity]);

  // Nominations & Immunity
  const nominateContestant = useCallback((id: string): boolean => {
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
    addActivity(`${target.name} was nominated for eviction.`, 'nomination');
    addToast('Nominated', `${target.name} is now nominated.`, 'warning');
    makeAnnouncement(`NOMINATION ALERT: ${target.name} has been placed in the Danger Zone facing eviction.`, 'nomination', true);
    return true;
  }, [contestants, addToast, addActivity, makeAnnouncement]);

  const removeNomination = useCallback((id: string) => {
    const target = contestants.find((c) => c.id === id);
    if (!target || !target.isNominated) return;

    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isNominated: false } : c))
    );

    addActivity(`${target.name}'s nomination was revoked.`, 'nomination');
    addToast('Nomination Cleared', `${target.name} removed from Danger Zone.`, 'info');
  }, [contestants, addToast, addActivity]);

  const grantImmunity = useCallback((id: string): boolean => {
    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot receive immunity.', 'error');
      return false;
    }

    // Rule 17: If a nominated contestant receives immunity, automatically remove the nomination!
    setContestants((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isImmune: true,
              isNominated: false, // Automatically clears nomination!
            }
          : c
      )
    );

    playAttentionChime('complete');
    addActivity(`${target.name} received immunity.`, 'immunity');
    addToast('Immunity Granted', `🛡 ${target.name} is now immune from eviction.`, 'success');
    makeAnnouncement(`IMMUNITY CONFIRMED: ${target.name} has secured full immunity and cannot be nominated.`, 'immunity', true);
    return true;
  }, [contestants, addToast, addActivity, makeAnnouncement]);

  const removeImmunity = useCallback((id: string) => {
    const target = contestants.find((c) => c.id === id);
    if (!target || !target.isImmune) return;

    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isImmune: false } : c))
    );

    addActivity(`${target.name}'s immunity was removed.`, 'immunity');
    addToast('Immunity Revoked', `${target.name} is no longer immune.`, 'info');
  }, [contestants, addToast, addActivity]);

  // Captaincy
  const setCaptain = useCallback((id: string): boolean => {
    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted) {
      addToast('Rule Violation', 'Evicted contestants cannot become House Captain.', 'error');
      return false;
    }

    // Only one captain allowed. Previous captain automatically loses status.
    setContestants((prev) =>
      prev.map((c) => ({
        ...c,
        isCaptain: c.id === id,
      }))
    );

    playAttentionChime('complete');
    addActivity(`${target.name} became House Captain.`, 'captain');
    addToast('Captain Changed', `👑 ${target.name} is now the House Captain.`, 'success');
    makeAnnouncement(`BIG BOSS ANNOUNCEMENT: ${target.name} is now the House Captain.`, 'captain', true);
    return true;
  }, [contestants, addToast, addActivity, makeAnnouncement]);

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
    addToast('Task Created', `Task "${title}" created successfully.`, 'success');
  }, [addToast, addActivity]);

  const startTask = useCallback((taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'ACTIVE' } : t))
    );

    // Also auto-prepare timer for the task duration
    if (task.durationMinutes > 0) {
      setInitialTimerSeconds(task.durationMinutes * 60);
      setTimerSeconds(task.durationMinutes * 60);
      setIsTimerRunning(true);
      setIsTimerExpired(false);
    }

    addActivity(`Task "${task.title}" has started.`, 'task');
    addToast('Task Started', `Task "${task.title}" is now active. Countdown initialized.`, 'info');
    makeAnnouncement(`TASK COMMENCED: All contestants participating in "${task.title}" must begin immediately.`, 'task', true);
  }, [tasks, addToast, addActivity, makeAnnouncement]);

  const completeTask = useCallback((taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === 'COMPLETED') return;

    // Update task
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: 'COMPLETED', completedAt: formatCurrentTime() }
          : t
      )
    );

    // Reward points to assignee
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
    addToast('Task Completed', `"${task.title}" completed! Points awarded.`, 'success');
    makeAnnouncement(`TASK COMPLETED: "${task.title}" successfully concluded. ${task.assignedToName} awarded ${reward} points.`, 'task', true);
  }, [tasks, addToast, addActivity, makeAnnouncement]);

  // Eviction Workflow
  const evictContestant = useCallback((id: string, reason = 'Direct eviction order'): boolean => {
    const target = contestants.find((c) => c.id === id);
    if (!target) return false;

    if (target.isEvicted) {
      addToast('Already Evicted', `${target.name} has already been evicted.`, 'warning');
      return false;
    }

    const evictionTimestamp = `Day 05, ${formatCurrentTime()}`;

    // Add record to history
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

    // Update contestant status in list (set isEvicted = true, clear captain/immune/nomination)
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
    addActivity(`Contestant ${target.name} was evicted from the House.`, 'eviction');
    addToast('EVICTION EXECUTED', `🔴 ${target.name} has been evicted from the House.`, 'error', 6000);
    makeAnnouncement(`🔴 BIG BOSS ANNOUNCEMENT: ${target.name} has been evicted from the House. They must exit via the main tunnel immediately.`, 'eviction', true);
    return true;
  }, [contestants, addToast, addActivity, makeAnnouncement]);

  // Reset House
  const resetHouse = useCallback(() => {
    localStorage.removeItem(`${STORAGE_KEY}_contestants`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_evictions`);
    localStorage.removeItem(`${STORAGE_KEY}_announcements`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);

    setContestants(INITIAL_CONTESTANTS);
    setTasks(INITIAL_TASKS);
    setEvictions(INITIAL_EVICTIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setActivities(INITIAL_ACTIVITIES);
    setTimerSeconds(900);
    setInitialTimerSeconds(900);
    setIsTimerRunning(false);
    setIsTimerExpired(false);

    playAttentionChime('alert');
    addToast('House Reset', 'Big Boss Command Center restored to initial state.', 'info');
  }, [addToast]);

  return (
    <HouseContext.Provider
      value={{
        activeTab,
        setActiveTab,

        isVoiceEnabled,
        setIsVoiceEnabled,
        speakCurrentAnnouncement,

        contestants,
        tasks,
        evictions,
        announcements,
        activities,
        toasts,

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

        timerSeconds,
        initialTimerSeconds,
        isTimerRunning,
        isTimerExpired,
        startTimer,
        pauseTimer,
        resetTimer,
        setCustomTimer,

        addContestant,
        bulkImportContestants,
        editContestant,
        deleteContestant,

        addPoints,
        deductPoints,
        setCustomPoints,

        nominateContestant,
        removeNomination,
        grantImmunity,
        removeImmunity,
        setCaptain,

        createTask,
        startTask,
        completeTask,

        evictContestant,

        makeAnnouncement,
        addActivity,

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
