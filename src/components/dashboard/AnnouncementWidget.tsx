import React, { useState } from 'react';
import { useHouse } from '../../context/HouseContext';
import { Megaphone, Send, Radio, Volume2, VolumeX, Play } from 'lucide-react';

export const AnnouncementWidget: React.FC = () => {
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

  const latestAnnouncement = announcements[0];

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0d0f17]/90 p-5 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/40 text-red-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-white font-display">
                SUPREME BROADCAST DESK
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                TRANSMIT ORDERS & VOICE PRONUNCIATION
              </p>
            </div>
          </div>

          {/* Voice Speech Toggle */}
          <button
            type="button"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
              isVoiceEnabled
                ? 'bg-red-950/80 border-red-600/60 text-red-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
            title="Toggle Voice Pronunciation (Speech Synthesis)"
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>VOICE: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>VOICE: OFF</span>
              </>
            )}
          </button>
        </div>

        {/* Latest Active Announcement Banner */}
        {latestAnnouncement && (
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-red-950/70 via-red-900/40 to-neutral-900/80 border border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.2)] relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 font-display">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span>🔴 BIG BOSS ANNOUNCEMENT</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-neutral-400">
                  {latestAnnouncement.timestamp}
                </span>

                {/* Pronounce Button */}
                <button
                  type="button"
                  onClick={() => speakCurrentAnnouncement(latestAnnouncement.content)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  title="Pronounce aloud using Speech Synthesis"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>PRONOUNCE</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white font-semibold leading-relaxed mt-1">
              "{latestAnnouncement.content}"
            </p>
          </div>
        )}
      </div>

      {/* Announcement Input Form */}
      <form onSubmit={handleSubmit} className="mt-2 space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-display">
          ENTER BIG BOSS ANNOUNCEMENT
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. All contestants must report to the living room immediately..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-lg bg-black border border-neutral-700 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md hover:shadow-[0_0_12px_rgba(220,38,38,0.5)] cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MAKE & SPEAK</span>
            <span className="sm:hidden">SEND</span>
          </button>
        </div>
      </form>
    </div>
  );
};
