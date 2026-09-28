import React, { useState, useRef, useEffect } from 'react';

interface AudioTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentlyPlayingTrack?: string;
}

export const AudioTranscriberModal: React.FC<AudioTranscriberModalProps> = ({
  isOpen,
  onClose,
  currentlyPlayingTrack
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState<Array<{ text: string; time: string; source: string; tag?: string }>>([
    {
      time: '00:14',
      source: 'MOSH MIC FEED',
      text: '[CROWD ROAR] STEP TO THE FRONT! LOCK THE CIRCLE!',
      tag: 'GANG SHOUT'
    },
    {
      time: '00:28',
      source: 'DIRECT TAPE STEM',
      text: 'YOU LOOKIN THIS WAY? YOU GOT SOMETHIN TO SAY? GET OUT OF MY WAY!',
      tag: 'GUTTURAL VOCAL'
    }
  ]);
  const [decibels, setDecibels] = useState(118);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<any>(null);

  useEffect(() => {
    // Decibel meter simulation
    const interval = setInterval(() => {
      if (isRecording) {
        setDecibels(Math.floor(105 + Math.random() * 28));
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isRecording]);

  const startLiveTranscription = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];

    // 1. Try browser Web Speech API for real-time streaming text
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          if (event.results[current].isFinal) {
            setTranscripts(prev => [
              ...prev,
              {
                time: new Date().toLocaleTimeString().slice(3, 8),
                source: 'LIVE MICROPHONE',
                text: transcriptText.toUpperCase(),
                tag: 'LIVE CROWD SPEECH'
              }
            ]);
          }
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition failed:', err);
      }
    }

    // 2. Also record audio chunk to send to /api/transcribe (Gemini 3.5 Transcribe)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setLoading(true);
          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: 'audio/webm'
              })
            });
            const data = await res.json();
            if (data.transcript) {
              setTranscripts(prev => [
                ...prev,
                {
                  time: new Date().toLocaleTimeString().slice(3, 8),
                  source: 'GEMINI 3.5 TRANSCRIBE',
                  text: data.transcript,
                  tag: 'DEEP AUDIO DECODE'
                }
              ]);
            }
          } catch (e) {
            console.error('Transcription API error:', e);
          } finally {
            setLoading(false);
          }
        };
      };

      mediaRecorder.start();
    } catch (err) {
      console.warn('Microphone access unavailable:', err);
    }
  };

  const stopLiveTranscription = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
  };

  const transcribeCurrentTrack = async () => {
    setLoading(true);
    try {
      // Simulate transcribing live direct tape stem
      await new Promise(r => setTimeout(r, 1200));
      setTranscripts(prev => [
        ...prev,
        {
          time: '01:45',
          source: currentlyPlayingTrack || 'ARMED DIRECT TAPE',
          text: '[BREAKDOWN SLAM] NO RETREAT! NO SURRENDER! FROM THE BRONX WE NEVER BEND!',
          tag: 'SYNCHRONIZED STEM'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#131313] border-2 border-[#ff562f] max-w-2xl w-full my-auto shadow-[6px_6px_0px_#ffc703] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1c1b1b] p-3 md:p-4 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff562f] text-[24px]">mic</span>
            <div>
              <div className="font-mono text-[10px] text-[#ffc703] font-bold uppercase tracking-widest">
                GEMINI 3.5 TRANSCRIBE // REAL-TIME ACOUSTIC PARSER
              </div>
              <h2 className="font-headline text-lg md:text-xl text-[#e5e2e1] uppercase tracking-wide">
                PIT TRANSCRIBER // LIVE MIC &amp; STEM DECODER
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              stopLiveTranscription();
              onClose();
            }}
            className="text-[#e5e2e1] hover:text-[#ff562f] font-mono font-bold text-xl px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Telemetry Bar */}
        <div className="p-3 bg-[#181818] border-b border-[#262626] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isRecording ? 'bg-[#ff562f] animate-ping' : 'bg-[#353534]'}`}></span>
            <span className="text-[#e5e2e1] uppercase font-bold">
              FEED STATUS: {isRecording ? 'LIVE RECORDING ACTIVE' : 'IDLE / READY'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#ffc703]">
              SPL: <span className="font-bold">{decibels} dB</span>
            </span>
            <span className="text-[#ffb4a3] hidden sm:inline">SAMPLE RATE: 48 KHZ</span>
          </div>
        </div>

        {/* Live Transcripts Stream */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3 font-mono text-xs max-h-[360px] bg-[#0e0e0e]">
          {transcripts.map((t, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#181818] border-l-4 border-[#ff562f] flex flex-col gap-1 shadow-sm"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#ffc703] font-bold">
                  [{t.time}] // {t.source}
                </span>
                {t.tag && (
                  <span className="bg-[#2a2a2a] text-[#ffb4a3] px-1.5 py-0.5 uppercase tracking-wider font-bold">
                    {t.tag}
                  </span>
                )}
              </div>
              <p className="text-[#e5e2e1] text-xs md:text-sm font-bold tracking-wide leading-relaxed">
                "{t.text}"
              </p>
            </div>
          ))}

          {loading && (
            <div className="p-3 bg-[#181818] border-l-4 border-[#ffc703] flex items-center gap-2 animate-pulse">
              <span className="w-2 h-2 bg-[#ffc703] rounded-full"></span>
              <span className="text-[#ffc703] uppercase">
                Decoding aggressive phonemes with Gemini Transcribe...
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#181818] border-t border-[#262626] flex flex-wrap gap-2">
          {!isRecording ? (
            <button
              onClick={startLiveTranscription}
              className="flex-1 py-3 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[2px_2px_0px_#0e0e0e]"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
              START LIVE MIC TRANSCRIBE
            </button>
          ) : (
            <button
              onClick={stopLiveTranscription}
              className="flex-1 py-3 bg-[#93000a] text-[#ffdad6] hover:bg-[#ff562f] hover:text-[#0e0e0e] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">stop_circle</span>
              STOP LIVE FEED &amp; ANALYZE
            </button>
          )}

          <button
            onClick={transcribeCurrentTrack}
            disabled={loading}
            className="px-4 py-3 bg-[#2a2a2a] hover:bg-[#353534] text-[#ffc703] font-mono text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
          >
            TRANSCRIBE CURRENT TRACK STEM
          </button>
        </div>
      </div>
    </div>
  );
};
