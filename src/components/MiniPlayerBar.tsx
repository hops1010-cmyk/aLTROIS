import React, { useState, useEffect } from 'react';
import { audioEngine, AudioPlaybackState } from '../services/hardcoreAudioEngine';
import { INITIAL_SONGS } from '../data/mockData';

interface MiniPlayerBarProps {
  onOpenArsenal: () => void;
  isVisible: boolean;
}

export const MiniPlayerBar: React.FC<MiniPlayerBarProps> = ({ onOpenArsenal, isVisible }) => {
  const [playback, setPlayback] = useState<AudioPlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 180,
    trackId: '',
    visualizerData: [],
    isBreakdown: false,
    secondsToBreakdown: 0
  });

  useEffect(() => {
    return audioEngine.subscribe((state) => {
      setPlayback(state);
    });
  }, []);

  if (!isVisible || !playback.trackId) return null;

  const currentSong = INITIAL_SONGS.find(s => s.id === playback.trackId) || {
    title: 'CUSTOM AI STEM',
    cutNumber: 'CUT // DIRECT'
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-16 md:bottom-20 w-full z-30 bg-[#0e0e0e]/95 border-t-2 border-[#ff562f] shadow-[0_-4px_16px_rgba(0,0,0,0.8)] backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div
          onClick={onOpenArsenal}
          className="flex items-center gap-2.5 truncate cursor-pointer flex-1"
        >
          <span className="w-2.5 h-2.5 bg-[#ff562f] rounded-full animate-ping shrink-0"></span>
          <div className="flex flex-col truncate">
            <span className="font-mono text-[9px] text-[#ffc703] uppercase font-bold tracking-wider truncate">
              {currentSong.cutNumber} • {playback.isBreakdown ? '⚠ BREAKDOWN SLAM' : 'DIRECT TAPE'}
            </span>
            <span className="font-headline text-sm md:text-base text-[#e5e2e1] uppercase truncate">
              {currentSong.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-[#e8bdb3]">
            {formatTime(playback.currentTime)} / {formatTime(playback.duration)}
          </span>

          <button
            onClick={() => audioEngine.togglePlay()}
            className="w-8 h-8 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {playback.isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
