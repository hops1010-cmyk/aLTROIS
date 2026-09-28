import React, { useState, useRef } from 'react';
import { audioEngine } from '../services/hardcoreAudioEngine';
import { GeneratedSongTrack } from '../types';

interface AiMusicStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackCreated?: (track: GeneratedSongTrack) => void;
}

export const AiMusicStudioModal: React.FC<AiMusicStudioModalProps> = ({
  isOpen,
  onClose,
  onTrackCreated
}) => {
  const [prompt, setPrompt] = useState(
    'Write a motivational anthem with powerful lyrics about perseverance and achieving goals. It should have a driving beat and an uplifting chorus.'
  );
  const [generationType, setGenerationType] = useState<'soundtrack' | 'jingle' | 'background' | 'anthem'>('anthem');
  const [mood, setMood] = useState('triumphant, relentless, driving');
  const [genre, setGenre] = useState('heavy hardcore motivational metal');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<{
    title: string;
    audioUrl?: string;
    lyrics?: string;
    isSynthetic?: boolean;
    statusText: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt && !imagePreview) return;
    setLoading(true);
    setLastGenerated(null);

    try {
      const res = await fetch('/api/music/generate-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type: generationType,
          mood,
          genre,
          imageBase64: imagePreview
        })
      });

      const data = await res.json();
      let audioUrl = '';

      if (data.audioBase64) {
        // Convert base64 audio to Blob URL
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      }

      const generatedTitle = generationType === 'anthem'
        ? 'UNBROKEN IRON // RISE FROM THE FLAME'
        : `AI ${generationType.toUpperCase()} // ${genre.toUpperCase()}`;

      setLastGenerated({
        title: generatedTitle,
        audioUrl: audioUrl || undefined,
        lyrics: data.lyrics || '',
        isSynthetic: data.isSyntheticFallback,
        statusText: data.isSyntheticFallback
          ? 'Synthesized with procedural beatdown engine (Lyria paid tier required for direct neural WAV stream)'
          : 'Generated directly via Lyria 3 Clip Neural Audio Engine'
      });

      // Play through audio engine immediately!
      audioEngine.playTrack({
        id: `custom-${Date.now()}`,
        durationSeconds: 180,
        bpm: 130,
        audioUrl: audioUrl || undefined
      });

      if (onTrackCreated) {
        onTrackCreated({
          id: `custom-${Date.now()}`,
          title: generatedTitle,
          prompt,
          audioUrl,
          lyrics: data.lyrics,
          timestamp: Date.now(),
          model: data.isSyntheticFallback ? 'synthesizer-augmented' : 'lyria-3-clip-preview',
          type: generationType
        });
      }
    } catch (err: any) {
      console.error('Music generation failed:', err);
      // Fallback preview
      setLastGenerated({
        title: 'UNBROKEN IRON (OFFLINE PREVIEW)',
        statusText: `Fallback audio engaged: ${err.message}`,
        lyrics: `[CHORUS]
WE ARE UNBROKEN! WE ARE UNBOWED!
ROARING LIKE THUNDER OUT OF THE CLOUD!
THROUGH EVERY TRIAL, THROUGH EVERY BLOW
WATCH HOW THE STEEL BEGINS TO GLOW!`
      });
      audioEngine.playTrack({
        id: `fallback-${Date.now()}`,
        durationSeconds: 180,
        bpm: 130
      });
    } finally {
      setLoading(false);
    }
  };

  const quickPresets = [
    {
      label: 'MOTIVATIONAL ANTHEM',
      prompt: 'Write a motivational anthem with powerful lyrics about perseverance and achieving goals. It should have a driving beat and an uplifting chorus.',
      type: 'anthem' as const,
      mood: 'inspiring, powerful, triumphant',
      genre: 'hardcore melodic groove'
    },
    {
      label: 'HEAVY SOUNDTRACK',
      prompt: 'Cinematic underground action trailer soundtrack with aggressive low-tuned 8-string guitars, thunderous cinematic brass, and pounding percussion.',
      type: 'soundtrack' as const,
      mood: 'apocalyptic, high-adrenaline',
      genre: 'industrial metalcore'
    },
    {
      label: 'PIT JINGLE',
      prompt: 'A short 15-second explosive hardcore bumper jingle with shout vocals "ALTROIS MOSH PIT VERIFIED" and a quick beatdown slam.',
      type: 'jingle' as const,
      mood: 'explosive, high impact',
      genre: 'beatdown hardcore'
    },
    {
      label: 'BACKGROUND TEXTURE',
      prompt: 'Dark subterranean industrial ambient drone with subtle heartbeat kick pulse and distant reverb guitars.',
      type: 'background' as const,
      mood: 'dark, atmospheric',
      genre: 'dark ambient metal'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#131313] border-2 border-[#ff562f] max-w-2xl w-full my-auto shadow-[6px_6px_0px_#ffc703] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1c1b1b] p-3 md:p-4 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc703] text-[24px]">music_note</span>
            <div>
              <div className="font-mono text-[10px] text-[#ff562f] font-bold uppercase tracking-widest">
                LYRIA 3 CLIP &amp; PRO // NEURAL SOUND DESIGN
              </div>
              <h2 className="font-headline text-lg md:text-xl text-[#e5e2e1] uppercase tracking-wide">
                AI MUSIC STUDIO // SOUNDTRACKS, JINGLES &amp; ANTHEMS
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#e5e2e1] hover:text-[#ff562f] font-mono font-bold text-xl px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4 font-body">
          {/* Quick Presets */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase text-[#ffc703] font-bold">
              ENGAGE QUICK PRESETS:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    setGenerationType(preset.type);
                    setMood(preset.mood);
                    setGenre(preset.genre);
                  }}
                  className={`py-1.5 px-2 font-mono text-[10px] uppercase tracking-wider font-bold text-left transition-all ${
                    prompt === preset.prompt
                      ? 'bg-[#ff562f] text-[#0e0e0e]'
                      : 'bg-[#2a2a2a] text-[#e8bdb3] hover:bg-[#353534]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Type & Genre selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#e8bdb3] uppercase font-bold block mb-1">
                COMPOSITION TYPE:
              </label>
              <select
                value={generationType}
                onChange={(e: any) => setGenerationType(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-[#353534] p-2 text-[#e5e2e1] font-mono uppercase text-xs"
              >
                <option value="anthem">Motivational Anthem</option>
                <option value="soundtrack">Cinematic Soundtrack</option>
                <option value="jingle">Radio / Tour Jingle</option>
                <option value="background">Background Atmosphere</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#e8bdb3] uppercase font-bold block mb-1">
                GENRE / SONIC STYLE:
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Hardcore, Metal, Groove..."
                className="w-full bg-[#0e0e0e] border border-[#353534] p-2 text-[#e5e2e1] font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#e8bdb3] uppercase font-bold block mb-1">
                EMOTIONAL CADENCE:
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Uplifting, Relentless..."
                className="w-full bg-[#0e0e0e] border border-[#353534] p-2 text-[#e5e2e1] font-mono text-xs"
              />
            </div>
          </div>

          {/* Prompt textarea */}
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-[#e8bdb3] uppercase font-bold flex items-center justify-between">
              <span>SONIC DIRECTIVE // TEXT PROMPT:</span>
              <span className="text-[#ffc703]">LYRIA 3 MODEL READY</span>
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-[#353534] focus:border-[#ff562f] p-3 text-xs md:text-sm text-[#e5e2e1] font-mono leading-relaxed outline-none"
              placeholder="Describe rhythm, riffs, tempo, vocals, chorus, and lyrics..."
            />
          </div>

          {/* Image-to-Music Optional Upload */}
          <div className="p-3 bg-[#181818] border border-[#2a2a2a] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#ffc703] uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">image</span>
                IMAGE-TO-MUSIC // VISUAL FREQUENCY ANCHOR (OPTIONAL)
              </span>
              {imagePreview && (
                <button
                  onClick={() => setImagePreview(null)}
                  className="font-mono text-[10px] text-[#ff562f] hover:underline"
                >
                  REMOVE IMAGE
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Reference"
                  className="w-16 h-16 object-cover border border-[#ff562f]"
                />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 bg-[#0e0e0e] border border-dashed border-[#555] flex flex-col items-center justify-center cursor-pointer hover:border-[#ff562f]"
                >
                  <span className="material-symbols-outlined text-[#777] text-[20px]">add_photo_alternate</span>
                </div>
              )}
              <div className="flex flex-col gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-[#2a2a2a] hover:bg-[#353534] font-mono text-[10px] text-[#e5e2e1] uppercase font-bold text-left"
                >
                  {imagePreview ? 'CHANGE REFERENCE IMAGE' : 'UPLOAD ARTWORK / GIG POSTER'}
                </button>
                <span className="text-[10px] text-[#e8bdb3]/70 font-mono">
                  Lyria generates custom tempo and timbre inspired by the colors and textures of your image.
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Results Box */}
          {lastGenerated && (
            <div className="p-4 bg-[#0e0e0e] border border-[#ff562f] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#222]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#ff562f] rounded-full animate-ping"></span>
                  <span className="font-headline text-lg text-[#e5e2e1] uppercase">
                    {lastGenerated.title}
                  </span>
                </div>
                <span className="bg-[#ffc703] text-[#3e2e00] font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
                  NOW PLAYING
                </span>
              </div>

              <p className="font-mono text-[10px] text-[#e8bdb3]/80">
                {lastGenerated.statusText}
              </p>

              {lastGenerated.lyrics && (
                <div className="p-3 bg-[#181818] border-l-2 border-[#ffc703] font-mono text-xs text-[#ffb4a3] whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {lastGenerated.lyrics}
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => audioEngine.togglePlay()}
                  className="flex-1 py-2 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  TOGGLE PLAYBACK
                </button>
                {lastGenerated.audioUrl && (
                  <a
                    href={lastGenerated.audioUrl}
                    download="altrois-generated-track.wav"
                    className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#353534] text-[#e5e2e1] font-mono text-xs font-bold uppercase tracking-wider text-center"
                  >
                    DOWNLOAD WAV
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono text-xs md:text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_#ffc703] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0e0e0e] border-t-transparent rounded-full animate-spin"></div>
                <span>COMPOSING NEURAL AUDIO WITH LYRIA...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">equalizer</span>
                <span>EXECUTE LYRIA GENERATION // ARM SOUNDTRACK</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
