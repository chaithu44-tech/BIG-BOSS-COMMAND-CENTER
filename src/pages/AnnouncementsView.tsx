import React, { useState } from 'react';
import { useHouse } from '../context/HouseContext';
import { Megaphone, Send, Radio, Clock, Volume2, VolumeX } from 'lucide-react';
import { AnnouncementType } from '../types';

export const AnnouncementsView: React.FC = () => {
  const {
    announcements,
    makeAnnouncement,
    isVoiceEnabled,
    setIsVoiceEnabled,
    speakCurrentAnnouncement,
  } = useHouse();

  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      makeAnnouncement(content.trim(), 'normal');
      setContent('');
    }
  };

  const getAnnouncementBadge = (type: AnnouncementType) => {
    switch (type) {
      case 'captain':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            CAPTAINCY DECREE
          </span>
        );
      case 'eviction':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
            EVICTION ORDER
          </span>
        );
      case 'nomination':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">
            NOMINATION ALERT
          </span>
        );
      case 'immunity':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
            IMMUNITY NOTICE
          </span>
        );
      case 'task':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
            TASK PROTOCOL
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700">
            DISCIPLINARY WARNING
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
            BROADCAST
          </span>
        );
    }
  };

  const latestAnnouncement = announcements[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-[#0d0f17] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-red-500" />
            <span>BIG BOSS BROADCAST CONSOLE</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Supreme vocal decrees transmitted directly to the House loudspeakers with speech pronunciation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Voice Toggle */}
          <button
            type="button"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
              isVoiceEnabled
                ? 'bg-red-950/80 border-red-600/60 text-red-300 shadow-[0_0_12px_rgba(220,38,38,0.25)]'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
            title="Toggle Voice Pronunciation"
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />
                <span>VOICE SYNTHESIS: ACTIVE</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>VOICE SYNTHESIS: MUTED</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-red-400 bg-red-950/40 px-3 py-2 rounded-lg border border-red-800/40">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span>PA SYSTEM ARMED</span>
          </div>
        </div>
      </div>

      {/* Prominent Active Announcement Banner */}
      {latestAnnouncement && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/80 via-red-900/40 to-neutral-900 border border-red-600/70 shadow-[0_0_30px_rgba(220,38,38,0.25)] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-red-400 font-display">
                🔴 CURRENT BIG BOSS ANNOUNCEMENT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400">
                {latestAnnouncement.timestamp}
              </span>

              {/* Pronounce Now Button */}
              <button
                type="button"
                onClick={() => speakCurrentAnnouncement(latestAnnouncement.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>PRONOUNCE ALOUD</span>
              </button>
            </div>
          </div>

          <p className="text-lg sm:text-xl font-bold text-white leading-relaxed mt-2">
            "{latestAnnouncement.content}"
          </p>
        </div>
      )}

      {/* Input Formulation Card */}
      <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl">
        <h3 className="text-base font-bold tracking-wider uppercase text-white font-display mb-3">
          TRANSMIT & PRONOUNCE SUPREME ORDER
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
            ENTER BIG BOSS ANNOUNCEMENT
          </label>
          <textarea
            rows={3}
            placeholder="Type your official decree here (e.g. All contestants must assemble in the living room immediately...)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-3 rounded-lg bg-black border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 leading-relaxed"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>BROADCAST & PRONOUNCE</span>
            </button>
          </div>
        </form>
      </div>

      {/* History List */}
      <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl">
        <h3 className="text-base font-bold tracking-wider uppercase text-white font-display mb-4">
          TRANSMISSION ARCHIVES ({announcements.length})
        </h3>

        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
          {announcements.length > 0 ? (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-lg bg-neutral-900/40 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    {getAnnouncementBadge(ann.type)}
                    {ann.isAutomatic && (
                      <span className="text-[10px] text-neutral-500 font-mono">
                        (System Trigger)
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-200 font-medium text-sm leading-relaxed">
                    "{ann.content}"
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => speakCurrentAnnouncement(ann.content)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-[11px] font-bold uppercase transition-colors cursor-pointer"
                    title="Pronounce this announcement"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-red-400" />
                    <span>SPEAK</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{ann.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-neutral-500 text-xs">
              NO ANNOUNCEMENTS YET
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
