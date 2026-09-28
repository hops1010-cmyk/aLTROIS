import React, { useState, useEffect } from 'react';
import { SongCut } from '../types';
import { INITIAL_SONGS } from '../data/mockData';
import { audioEngine, AudioPlaybackState } from '../services/hardcoreAudioEngine';
import { AiMusicStudioModal } from './AiMusicStudioModal';
import { AudioTranscriberModal } from './AudioTranscriberModal';

export const SonicArsenalScreen: React.FC = () => {
  const [songs, setSongs] = useState<SongCut[]>(INITIAL_SONGS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSong, setActiveSong] = useState<SongCut>(INITIAL_SONGS[0]);
  const [expandedLyricsId, setExpandedLyricsId] = useState<string | null>(null);

  const [playback, setPlayback] = useState<AudioPlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 222,
    trackId: INITIAL_SONGS[0].id,
    visualizerData: new Array(32).fill(0.2),
    isBreakdown: false,
    secondsToBreakdown: 45
  });

  const [isGeneratingLyriaAll, setIsGeneratingLyriaAll] = useState(false);
  const [generatingSongId, setGeneratingSongId] = useState<string | null>(null);
  const [aiStudioOpen, setAiStudioOpen] = useState(false);
  const [transcriberOpen, setTranscriberOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setPlayback(state);
    });
    return unsubscribe;
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleArmAndPlay = (song: SongCut) => {
    setActiveSong(song);
    audioEngine.playTrack({
      id: song.id,
      durationSeconds: song.durationSeconds,
      breakdownSeconds: song.breakdownSeconds,
      bpm: song.bpm,
      audioUrl: song.lyriaAudioUrl
    });
  };

  const generateSingleWithLyria = async (song: SongCut) => {
    setGeneratingSongId(song.id);
    try {
      const res = await fetch('/api/lyria/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: song.id,
          prompt: song.lyriaPrompt,
          model: 'lyria-3-clip-preview'
        })
      });

      const data = await res.json();
      let audioUrl = song.lyriaAudioUrl;

      if (data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      }

      setSongs(prev =>
        prev.map(s => {
          if (s.id === song.id) {
            return {
              ...s,
              isLyriaGenerated: true,
              lyriaAudioUrl: audioUrl,
              lyrics: data.lyrics || s.lyrics
            };
          }
          return s;
        })
      );

      setToastMessage(`LYRIA GENERATED: ${song.title}`);
      setTimeout(() => setToastMessage(null), 3000);

      // Play immediately
      audioEngine.playTrack({
        id: song.id,
        durationSeconds: song.durationSeconds,
        breakdownSeconds: song.breakdownSeconds,
        bpm: song.bpm,
        audioUrl
      });
    } catch (err: any) {
      console.warn('Lyria single gen:', err);
      setToastMessage(`SYNTHESIZED PREVIEW ACTIVE FOR: ${song.title}`);
      setTimeout(() => setToastMessage(null), 3000);
      handleArmAndPlay(song);
    } finally {
      setGeneratingSongId(null);
    }
  };

  const generateAllFourSongsWithLyria = async () => {
    setIsGeneratingLyriaAll(true);
    setToastMessage('DISPATCHING LYRIA BATCH GENERATION FOR 4 SONGS...');

    const cutsToGenerate = songs.filter(s => ['cut-01', 'cut-02', 'cut-03', 'cut-04'].includes(s.id));

    for (const cut of cutsToGenerate) {
      try {
        await generateSingleWithLyria(cut);
      } catch (e) {
        console.error('Error generating song:', cut.title, e);
      }
    }

    setIsGeneratingLyriaAll(false);
    setToastMessage('LYRIA GENERATION CYCLE COMPLETED FOR ALL 4 CUTS.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const categories = [
    { id: 'all', label: '[ ALL ]' },
    { id: 'hardcore', label: 'BRONX HARDCORE' },
    { id: 'grindcore', label: 'GRINDCORE' },
    { id: 'groove', label: 'GROOVE METAL' },
    { id: 'djent', label: 'DJENT' },
    { id: 'anthem', label: 'MOTIVATIONAL' }
  ];

  const filteredSongs = activeCategory === 'all'
    ? songs
    : songs.filter(s => s.category === activeCategory);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#ffc703] text-[#3e2e00] font-mono text-xs font-bold px-4 py-2 shadow-2xl border-2 border-[#0e0e0e] max-w-sm text-center animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Hazard Ticker */}
      <div className="w-full bg-[#ffc703] text-[#3e2e00] py-1 px-4 overflow-hidden select-none shadow-md">
        <div className="flex items-center gap-4 whitespace-nowrap animate-pulse font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest">
          <span>⚠ CAUTION: HIGH DECIBEL SUB-BASS TRANSIENTS //</span>
          <span>OVERDRIVEN HM-2 CHAINSAW PREAMPS LOADED</span>
          <span>// LYRIA 3 CLIP AUDIO ENGINE ARMED //</span>
        </div>
      </div>

      {/* Frequency Warfare Header */}
      <div className="p-4 md:p-6 bg-[#0e0e0e] flex flex-col gap-1 border-b border-[#262626]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff562f] inline-block"></span>
            <span className="font-mono text-xs text-[#ff562f] font-bold uppercase tracking-widest">
              FREQUENCY WARFARE
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#ffc703] font-bold uppercase">
            REV.4.9
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl text-[#e5e2e1] uppercase tracking-tight">
          SONIC ARSENAL // THE HEAVIEST CUTS
        </h1>
        <p className="font-body text-xs md:text-sm text-[#e8bdb3] mt-1">
          Raw live studio stems recorded hot through overdriven tube preamps. Zero pitch correction. Pure brute impact.
        </p>

        {/* Global AI Action Strip */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button
            onClick={generateAllFourSongsWithLyria}
            disabled={isGeneratingLyriaAll}
            className="flex-1 min-w-[200px] py-2.5 px-3 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#ffc703] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all"
          >
            {isGeneratingLyriaAll ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#0e0e0e] border-t-transparent rounded-full animate-spin"></div>
                <span>LYRIA GENERATING ALL 4 CUTS...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                <span>GENERATE 4 SONGS WITH LYRIA</span>
              </>
            )}
          </button>

          <button
            onClick={() => setAiStudioOpen(true)}
            className="py-2.5 px-3 bg-[#2a2a2a] hover:bg-[#353534] text-[#ffc703] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">music_note</span>
            <span>CUSTOM STUDIO / ANTHEM</span>
          </button>

          <button
            onClick={() => setTranscriberOpen(true)}
            className="py-2.5 px-3 bg-[#2a2a2a] hover:bg-[#353534] text-[#ffb4a3] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span>LIVE TRANSCRIBER</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 bg-[#131313] border-b border-[#262626]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 px-3 py-1 font-mono text-[11px] uppercase tracking-wider font-bold transition-all ${
                activeCategory === c.id
                  ? 'bg-[#ff562f] text-[#0e0e0e] shadow-[2px_2px_0px_#0e0e0e]'
                  : 'bg-[#2a2a2a] text-[#e8bdb3] hover:bg-[#353534]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* NOW ARMED DIRECT TAPE PLAYER CARD */}
      <div className="p-4 bg-[#131313]">
        <div className="bg-[#1c1b1b] border-2 border-[#ff562f] shadow-2xl relative overflow-hidden">
          {/* Card Top Banner */}
          <div className="bg-[#0e0e0e] p-3 border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#ff562f] text-[#0e0e0e] font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
                NOW ARMED
              </span>
              <span className="flex items-center gap-1 text-[#ff562f] font-mono text-[10px] font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-[#ff562f] animate-ping"></span>
                ● DIRECT TAPE
              </span>
            </div>
            <div className="bg-[#ffc703] text-[#3e2e00] font-mono text-xs font-bold px-2.5 py-0.5">
              {formatTime(playback.currentTime)} / {formatTime(playback.duration)}
            </div>
          </div>

          {/* Hero Track Header */}
          <div className="p-4 bg-gradient-to-b from-[#201f1f] to-[#181818] border-b border-[#2a2a2a]">
            <span className="font-mono text-[10px] text-[#ffc703] uppercase tracking-wider font-bold">
              {activeSong.cutNumber}
            </span>
            <h2 className="font-headline text-2xl md:text-4xl text-[#e5e2e1] uppercase tracking-wide leading-tight mt-1">
              {activeSong.title}
            </h2>
          </div>

          {/* Metadata telemetry */}
          <div className="grid grid-cols-3 gap-1 p-3 bg-[#0e0e0e] text-center font-mono text-[10px] md:text-xs border-b border-[#262626]">
            <div>
              <span className="text-[#e8bdb3]/70 uppercase block text-[9px]">TEMPO CADENCE</span>
              <span className="text-[#e5e2e1] font-bold">{activeSong.bpm} BPM</span>
            </div>
            <div>
              <span className="text-[#e8bdb3]/70 uppercase block text-[9px]">SUB TUNING</span>
              <span className="text-[#ff562f] font-bold">{activeSong.tuning}</span>
            </div>
            <div>
              <span className="text-[#e8bdb3]/70 uppercase block text-[9px]">KICK RIG</span>
              <span className="text-[#ffc703] font-bold">TRIG. PUMMEL</span>
            </div>
          </div>

          {/* Dynamic 32-Bar Responsive Visualizer */}
          <div className="p-4 bg-[#0e0e0e] flex flex-col gap-2">
            <div className="h-20 flex items-end justify-between gap-1 px-1 bg-[#131313] border border-[#222] p-2">
              {playback.visualizerData.map((val, i) => {
                const heightPercent = Math.max(8, Math.min(100, Math.round(val * 100)));
                const isPassed = (i / 32) <= (playback.currentTime / playback.duration);
                return (
                  <div
                    key={i}
                    style={{ height: `${heightPercent}%` }}
                    className={`flex-1 transition-all duration-75 ${
                      isPassed ? 'bg-[#ff562f]' : 'bg-[#3a3939]'
                    }`}
                  ></div>
                );
              })}
            </div>

            {/* Breakdown alert status */}
            <div className="flex items-center justify-between p-2.5 bg-[#93000a] text-[#ffdad6] border border-[#ff562f]">
              <div className="flex items-center gap-1.5 font-mono text-[10px] md:text-xs uppercase font-bold">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>BREAKDOWN DROP IMMINENT: {activeSong.breakdownTimestamp}</span>
              </div>
              <span className="font-mono text-xs bg-[#ffdad6] text-[#93000a] px-2 py-0.5 font-bold">
                {playback.secondsToBreakdown > 0 ? `- ${playback.secondsToBreakdown} SEC` : 'SLAM ACTIVE!'}
              </span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => audioEngine.togglePlay()}
                className="w-16 h-12 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono font-bold text-lg flex items-center justify-center transition-colors shadow-md shrink-0"
              >
                <span className="material-symbols-outlined text-[28px]">
                  {playback.isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => audioEngine.skip(-10)}
                className="w-12 h-12 bg-[#2a2a2a] hover:bg-[#353534] text-[#e5e2e1] font-mono text-xs font-bold flex items-center justify-center transition-colors shrink-0"
                title="Rewind 10 seconds"
              >
                <span className="material-symbols-outlined text-[20px]">replay_10</span>
              </button>

              <button
                onClick={() => audioEngine.skip(10)}
                className="w-12 h-12 bg-[#2a2a2a] hover:bg-[#353534] text-[#e5e2e1] font-mono text-xs font-bold flex items-center justify-center transition-colors shrink-0"
                title="Forward 10 seconds"
              >
                <span className="material-symbols-outlined text-[20px]">forward_10</span>
              </button>

              <button
                onClick={() => {
                  setToastMessage(`TRACK [${activeSong.title}] PINNED TO PIT SETLIST`);
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                className="flex-1 h-12 bg-[#2a2a2a] hover:bg-[#ffc703] hover:text-[#0e0e0e] text-[#e5e2e1] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">playlist_add</span>
                <span>+ ADD TO PIT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stencil Callout Section */}
      {activeSong.stencilQuote && (
        <div className="px-4 mt-2">
          <div className="p-4 bg-[#1c1b1b] border-l-4 border-[#ffc703] shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#ffc703] uppercase font-bold tracking-widest">
                STENCIL CALLOUT // {activeSong.title}
              </span>
              <span className="font-headline text-xl text-[#ffc703]">99</span>
            </div>
            <p className="font-headline text-xl md:text-2xl text-[#e5e2e1] uppercase tracking-wide leading-snug">
              {activeSong.stencilQuote}
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#e8bdb3]">
              <span>{activeSong.vocalSpit}</span>
              <span className="bg-[#0e0e0e] text-[#ff562f] px-2 py-0.5 font-bold uppercase">
                UNCENSORED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Arsenal Directory List */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <span className="font-mono text-xs text-[#e5e2e1] uppercase font-bold">
            ARSENAL DIRECTORY // {filteredSongs.length} CUTS LOADED
          </span>
          <span className="font-mono text-[10px] text-[#ffc703] uppercase font-bold">
            TAP ROW TO ARM STEM
          </span>
        </div>

        <div className="flex flex-col gap-3 mt-3">
          {filteredSongs.map((song) => {
            const isCurrent = activeSong.id === song.id;
            const isPlayingThis = isCurrent && playback.isPlaying;
            const isExpandedLyrics = expandedLyricsId === song.id;

            return (
              <div
                key={song.id}
                className={`flex flex-col bg-[#1c1b1b] border transition-all ${
                  isCurrent ? 'border-[#ff562f] shadow-[3px_3px_0px_#ff562f]' : 'border-[#262626] hover:border-[#444]'
                }`}
              >
                <div
                  onClick={() => handleArmAndPlay(song)}
                  className="p-3 md:p-4 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-headline text-2xl md:text-3xl text-[#ff562f] shrink-0">
                      {song.cutNumber.split(' ')[0]}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] text-[#e8bdb3] uppercase font-bold">
                        {song.genreTag}
                      </span>
                      <h3 className="font-headline text-lg md:text-xl text-[#e5e2e1] uppercase tracking-wide">
                        {song.title}
                      </h3>
                      <p className="font-body text-xs text-[#e8bdb3]/80 line-clamp-2 mt-0.5">
                        {song.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPlayingThis) {
                          audioEngine.pause();
                        } else {
                          handleArmAndPlay(song);
                        }
                      }}
                      className={`w-9 h-9 rounded-none flex items-center justify-center ${
                        isPlayingThis ? 'bg-[#ffc703] text-[#0e0e0e]' : 'bg-[#2a2a2a] text-[#e5e2e1] hover:bg-[#ff562f] hover:text-[#0e0e0e]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isPlayingThis ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <span className="font-mono text-[10px] text-[#e8bdb3]">
                      {song.durationFormatted}
                    </span>
                  </div>
                </div>

                {/* Sub row with details and Lyria button */}
                <div className="p-2.5 bg-[#141414] border-t border-[#262626] flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                  <div className="flex items-center gap-3 text-[#e8bdb3]">
                    <span>BPM: <strong className="text-[#e5e2e1]">{song.bpm}</strong></span>
                    <span>TUNING: <strong className="text-[#ff562f]">{song.tuning}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedLyricsId(isExpandedLyrics ? null : song.id);
                      }}
                      className="px-2 py-1 bg-[#222] text-[#ffc703] uppercase hover:bg-[#333] font-bold"
                    >
                      {isExpandedLyrics ? 'HIDE LYRICS ▲' : 'VIEW LYRICS ▼'}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateSingleWithLyria(song);
                      }}
                      disabled={generatingSongId === song.id}
                      className="px-2.5 py-1 bg-[#ff562f] text-[#0e0e0e] hover:bg-[#ffc703] uppercase font-bold flex items-center gap-1 disabled:opacity-50"
                    >
                      {generatingSongId === song.id ? (
                        <>
                          <div className="w-2.5 h-2.5 border-2 border-[#0e0e0e] border-t-transparent rounded-full animate-spin"></div>
                          <span>GENERATING...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[13px]">electric_bolt</span>
                          <span>LYRIA STEM</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Lyrics Drawer */}
                {isExpandedLyrics && (
                  <div className="p-4 bg-[#0e0e0e] border-t border-[#ff562f] font-mono text-xs text-[#ffdad2] leading-relaxed whitespace-pre-line animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-[#262626] mb-2 text-[10px] text-[#ffc703]">
                      <span>LYRICS DIRECTIVE // {song.title}</span>
                      <span>RECORDED VOCAL TRACK</span>
                    </div>
                    {song.lyrics || 'No lyrics file attached to this stem.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tone Rig Chain Telemetry */}
      <div className="px-4 mt-8">
        <div className="bg-[#1c1b1b] p-4 border border-[#262626] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff562f] text-[18px]">tune</span>
              <span className="font-mono text-xs text-[#e5e2e1] uppercase font-bold tracking-wider">
                TONE RIG CHAIN TELEMETRY
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#ffc703] uppercase font-bold">
              STAGE READY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="p-2.5 bg-[#0e0e0e] border border-[#222]">
              <span className="text-[9px] text-[#e8bdb3] uppercase block">GUITARS</span>
              <span className="text-[#e5e2e1] font-bold">BARITONE 28.5" / 8-STR FAN</span>
            </div>
            <div className="p-2.5 bg-[#0e0e0e] border border-[#222]">
              <span className="text-[9px] text-[#e8bdb3] uppercase block">STRINGS GAUGES</span>
              <span className="text-[#e5e2e1] font-bold">.013 - .084 CUSTOM STEEL</span>
            </div>
            <div className="p-2.5 bg-[#0e0e0e] border border-[#222]">
              <span className="text-[9px] text-[#e8bdb3] uppercase block">AMPLIFICATION</span>
              <span className="text-[#ff562f] font-bold">5150 BLOCK LETTER + HM2</span>
            </div>
            <div className="p-2.5 bg-[#0e0e0e] border border-[#222]">
              <span className="text-[9px] text-[#e8bdb3] uppercase block">CAB IMPULSE</span>
              <span className="text-[#ffc703] font-bold">4x12 V30 OVERSIZED SLAM</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modals */}
      <AiMusicStudioModal
        isOpen={aiStudioOpen}
        onClose={() => setAiStudioOpen(false)}
        onTrackCreated={(track) => {
          setToastMessage(`CUSTOM TRACK [${track.title}] ARMED IN ARSENAL!`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      <AudioTranscriberModal
        isOpen={transcriberOpen}
        onClose={() => setTranscriberOpen(false)}
        currentlyPlayingTrack={activeSong.title}
      />
    </div>
  );
};
