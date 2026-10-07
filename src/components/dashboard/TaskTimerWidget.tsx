import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { formatTimerSeconds } from '../../utils/helpers';
import { Play, Pause, RotateCcw, Timer, AlertOctagon, Settings2 } from 'lucide-react';

export const TaskTimerWidget: React.FC = () => {
  const {
    timerSeconds,
    initialTimerSeconds,
    isTimerRunning,
    isTimerExpired,
    startTimer,
    pauseTimer,
    resetTimer,
    setCustomTimer,
  } = useHouse();

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(15);

  const presets = [
    { label: '5 MIN', seconds: 5 * 60 },
    { label: '10 MIN', seconds: 10 * 60 },
    { label: '15 MIN', seconds: 15 * 60 },
    { label: '30 MIN', seconds: 30 * 60 },
  ];

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMinutes > 0) {
      setCustomTimer(customMinutes * 60);
      setShowCustomInput(false);
    }
  };

  // Progress percentage
  const progressPercent = initialTimerSeconds > 0 
    ? Math.min(100, Math.max(0, ((initialTimerSeconds - timerSeconds) / initialTimerSeconds) * 100))
    : 0;

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/40 text-red-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-white font-display">
              CHALLENGE COUNTDOWN TIMER
            </h3>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
              REAL-TIME BROADCAST SYNCHRONIZATION
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
          title="Custom time"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Duration Form Dropdown */}
      {showCustomInput && (
        <form onSubmit={handleApplyCustom} className="mb-3 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-2">
          <span className="text-xs text-neutral-400">Minutes:</span>
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            className="w-16 px-2 py-1 bg-black border border-neutral-700 rounded text-xs text-white font-mono focus:border-red-500 outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded cursor-pointer uppercase"
          >
            SET
          </button>
          <button
            type="button"
            onClick={() => setShowCustomInput(false)}
            className="px-2 py-1 text-neutral-400 hover:text-white text-xs cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Large Digital Display */}
      <div className="flex flex-col items-center justify-center my-2 py-3 bg-[#08090f] rounded-xl border border-neutral-800/80 relative overflow-hidden">
        {/* Progress Bar Underneath */}
        <div
          className="absolute bottom-0 left-0 top-0 bg-red-950/20 transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />

        {isTimerExpired ? (
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-3xl sm:text-4xl font-black text-red-500 font-display tracking-widest flex items-center gap-2">
              <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />
              TIME UP
            </span>
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest mt-1">
              CHALLENGE CONCLUDED
            </span>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`font-mono text-4xl sm:text-5xl font-black tracking-widest tabular-nums ${
                isTimerRunning
                  ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'text-neutral-400'
              }`}
            >
              {formatTimerSeconds(timerSeconds)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mt-0.5">
              {isTimerRunning ? 'COUNTING DOWN' : timerSeconds === initialTimerSeconds ? 'READY' : 'PAUSED'}
            </div>
          </div>
        )}
      </div>

      {/* Main Controls: START / PAUSE / RESET */}
      <div className="flex items-center gap-2 mt-2">
        {isTimerRunning ? (
          <button
            onClick={pauseTimer}
            className="flex-1 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>START</span>
          </button>
        )}

        <button
          onClick={() => resetTimer()}
          className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-neutral-800/80">
        {presets.map((preset) => {
          const isActive = initialTimerSeconds === preset.seconds;
          return (
            <button
              key={preset.label}
              onClick={() => resetTimer(preset.seconds)}
              className={`py-1.5 rounded text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-950/80 text-red-300 border border-red-700/60'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
