import React, { useState } from 'react';

interface GoogleMapsAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVenue?: string;
}

export const GoogleMapsAgentModal: React.FC<GoogleMapsAgentModalProps> = ({
  isOpen,
  onClose,
  initialVenue = 'The Brooklyn Monarch, 23 Meadow St, Brooklyn, NY'
}) => {
  const [query, setQuery] = useState('');
  const [activeVenue, setActiveVenue] = useState(initialVenue);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);

  const fetchVenueData = async (targetVenue: string, customQuestion?: string) => {
    setLoading(true);
    setResponse(null);
    try {
      const q = customQuestion || `Get real-time venue info, address, subway lines, parking, and walking directions for ${targetVenue}.`;
      const res = await fetch('/api/maps/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueName: targetVenue,
          query: q
        })
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.text);
        setGroundingMetadata(data.groundingMetadata);
      } else {
        setResponse(`Unable to query Google Maps: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setResponse(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchVenueData(initialVenue);
    }
  }, [isOpen, initialVenue]);

  if (!isOpen) return null;

  const tourStops = [
    'The Brooklyn Monarch, Brooklyn, NY',
    'Electric Ballroom, Camden, London, UK',
    'SO36 Kreuzberg, Oranienstr. 190, Berlin, DE',
    'Conne Island, Connewitz, Leipzig, DE',
    'Club Citta, Kawasaki, Tokyo, JP',
    'Carioca Club, Pinheiros, São Paulo, BR'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#131313] border-2 border-[#ff562f] max-w-2xl w-full my-auto shadow-[6px_6px_0px_#ffc703] flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#1c1b1b] p-3 md:p-4 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff562f] text-[22px]">pin_drop</span>
            <div>
              <div className="font-mono text-[10px] text-[#ffc703] font-bold uppercase tracking-widest">
                LIVE GOOGLE MAPS TELEMETRY // REAL-TIME AGENT
              </div>
              <h2 className="font-headline text-lg md:text-xl text-[#e5e2e1] uppercase tracking-wide">
                PIT NAVIGATOR // VENUE INTEL &amp; DIRECTIONS
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

        {/* Quick Venue Selector */}
        <div className="p-3 bg-[#181818] border-b border-[#262626] flex gap-1.5 overflow-x-auto no-scrollbar">
          {tourStops.map((stop) => (
            <button
              key={stop}
              onClick={() => {
                setActiveVenue(stop);
                fetchVenueData(stop);
              }}
              className={`shrink-0 px-2.5 py-1 font-mono text-[11px] uppercase transition-all ${
                activeVenue === stop
                  ? 'bg-[#ff562f] text-[#0e0e0e] font-bold'
                  : 'bg-[#2a2a2a] text-[#e8bdb3] hover:bg-[#3a3939]'
              }`}
            >
              {stop.split(',')[0]}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4 font-body">
          {/* Query Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask directions, nearest subway, parking, or bars..."
              className="flex-1 bg-[#0e0e0e] border border-[#353534] focus:border-[#ff562f] px-3 py-2 text-xs md:text-sm text-[#e5e2e1] font-mono outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchVenueData(activeVenue, query);
                }
              }}
            />
            <button
              onClick={() => fetchVenueData(activeVenue, query)}
              disabled={loading}
              className="px-4 py-2 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono text-xs font-bold uppercase transition-colors shrink-0 disabled:opacity-50"
            >
              {loading ? 'PULLING...' : 'DISPATCH'}
            </button>
          </div>

          {/* Results Box */}
          <div className="bg-[#0e0e0e] border border-[#2a2a2a] p-4 flex flex-col gap-3 min-h-[220px]">
            <div className="flex items-center justify-between pb-2 border-b border-[#222]">
              <span className="font-mono text-xs text-[#ffc703] uppercase font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#ffc703] rounded-full animate-ping"></span>
                ACTIVE VENUE: {activeVenue}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeVenue)}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] text-[#ff562f] underline hover:text-[#ffc703]"
              >
                OPEN IN GOOGLE MAPS ↗
              </a>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-4 border-[#ff562f] border-t-transparent rounded-full animate-spin"></div>
                <span className="font-mono text-xs text-[#ffb4a3] uppercase tracking-wider animate-pulse">
                  Querying live Google Maps API &amp; Grounding...
                </span>
              </div>
            ) : response ? (
              <div className="text-xs md:text-sm text-[#e5e2e1] whitespace-pre-line leading-relaxed font-body">
                {response}
              </div>
            ) : (
              <span className="font-mono text-xs text-[#e8bdb3]/60 italic">
                Select a tour stop or enter a tactical routing question above.
              </span>
            )}

            {/* Grounding references if present */}
            {groundingMetadata?.webSearchQueries && (
              <div className="mt-2 pt-2 border-t border-[#222] font-mono text-[10px] text-[#e8bdb3]/70">
                <span>Maps Grounding Sources: {groundingMetadata.webSearchQueries.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Direct Navigation Button */}
          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeVenue)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 bg-[#ffc703] hover:bg-[#ffe9b9] text-[#3e2e00] font-mono text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">directions</span>
              LAUNCH REAL-TIME GPS DIRECTIONS
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-[#2a2a2a] text-[#e5e2e1] font-mono text-xs font-bold uppercase hover:bg-[#3a3939]"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
