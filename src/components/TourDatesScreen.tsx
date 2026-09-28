import React, { useState } from 'react';
import { TourDate } from '../types';
import { TOUR_DATES } from '../data/mockData';
import { GoogleMapsAgentModal } from './GoogleMapsAgentModal';

interface TourDatesScreenProps {
  onNavigateToMerch: () => void;
  onSelectPassForGig?: (gigVenue: string) => void;
}

export const TourDatesScreen: React.FC<TourDatesScreenProps> = ({
  onNavigateToMerch,
  onSelectPassForGig
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [mapsModalOpen, setMapsModalOpen] = useState(false);
  const [selectedVenueForMaps, setSelectedVenueForMaps] = useState('The Brooklyn Monarch, Brooklyn, NY');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all', label: '[ ALL REGIONS ]' },
    { id: 'europe', label: 'EUROPE' },
    { id: 'na', label: 'NORTH AMERICA' },
    { id: 'latam', label: 'LATIN AMERICA' },
    { id: 'apac', label: 'ASIA-PACIFIC' }
  ];

  const filteredGigs = selectedRegion === 'all'
    ? TOUR_DATES
    : TOUR_DATES.filter(g => g.region === selectedRegion);

  const handleGigAction = (gig: TourDate) => {
    if (gig.actionType === 'pit-pass') {
      if (onSelectPassForGig) {
        onSelectPassForGig(gig.venue);
      } else {
        onNavigateToMerch();
      }
    } else if (gig.actionType === 'waitlist') {
      setToastMessage(`ADDED TO WAITLIST FOR ${gig.venue}. YOU WILL BE PINGED IF A SPOT FREES UP.`);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setToastMessage(`SECURED WRISTBAND DISPATCH FOR ${gig.venue}. CHECK YOUR PIT PASS LEDGER.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const openVenueDirections = (venueString: string) => {
    setSelectedVenueForMaps(venueString);
    setMapsModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#ffc703] text-[#3e2e00] font-mono text-xs font-bold px-4 py-2 shadow-2xl border-2 border-[#0e0e0e] max-w-sm text-center animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Hero Banner Section */}
      <div className="relative w-full bg-[#0e0e0e] overflow-hidden">
        <div
          className="relative w-full h-80 bg-cover bg-center flex flex-col justify-end p-4 md:p-6"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCo3-I-n7wLE-vYNA_jXfD0Fj-ltsnZ_0CEDucF3bxJezRVZ9Hgse749KydCYF9UAwp8gzprY4aBDWc9FR4_snbeLphJw_-i3yodxgstbFx-9o6V71X7eALoykKzJRZ8PBVfl8iSXI79OdpQFYPj8ayLTuYNqQXRTgY_SVly40dkzy5l-oF-iLK5X5gTueZ1Iya41oIkYY77fmEImgBucrJaPlknYe-hUOuh4hg6LAyVnJ4BQU5TW8FFQ')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/60 to-transparent"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#ff562f] text-[#560d00] font-mono text-[10px] md:text-xs uppercase px-2 py-0.5 font-bold tracking-widest">
                WORLD TOUR 2025
              </span>
              <span className="bg-[#ffc703] text-[#3e2e00] font-mono text-[10px] md:text-xs uppercase px-2 py-0.5 font-bold tracking-widest animate-pulse">
                LIVE RECKONING
              </span>
            </div>
            <h1 className="font-headline text-3xl md:text-5xl text-[#e5e2e1] uppercase tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              16 COUNTRIES // ZERO MERCY
            </h1>
            <p className="font-mono text-xs md:text-sm text-[#ffb4a3] uppercase tracking-wider font-bold">
              FROM THE BRONX aLTROIS COME... AND THE PUNKS WATCH THEM STAY.
            </p>
          </div>
        </div>

        {/* Hazard Warning Banner */}
        <div className="w-full bg-[#ffc703] text-[#3e2e00] px-4 py-2 flex items-center gap-2 shadow-md">
          <span className="material-symbols-outlined text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <p className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest leading-snug">
            ZERO TOLERANCE FOR CROWD KILL WEAKNESS. ENTER THE MOSHPIT AT YOUR OWN RISK.
          </p>
        </div>
      </div>

      {/* Key Metrics / Stats Band */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-4 bg-[#0e0e0e]">
        <div className="bg-[#1c1b1b] p-3 flex flex-col justify-between border-l-2 border-[#ff562f]">
          <span className="font-mono text-[10px] text-[#e8bdb3] uppercase tracking-widest">TERRITORIES</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline text-2xl text-[#e5e2e1]">16</span>
            <span className="font-mono text-xs text-[#ff562f] uppercase font-bold">NATIONS</span>
          </div>
        </div>
        <div className="bg-[#1c1b1b] p-3 flex flex-col justify-between border-l-2 border-[#ffc703]">
          <span className="font-mono text-[10px] text-[#e8bdb3] uppercase tracking-widest">TOTAL STOPS</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline text-2xl text-[#e5e2e1]">48</span>
            <span className="font-mono text-xs text-[#e8bdb3] uppercase">RITUALS</span>
          </div>
        </div>
        <div className="bg-[#1c1b1b] p-3 flex flex-col justify-between border-l-2 border-[#ff562f]">
          <span className="font-mono text-[10px] text-[#e8bdb3] uppercase tracking-widest">CAPACITY CRUSH</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline text-2xl text-[#ff562f]">31</span>
            <span className="font-mono text-xs text-[#e8bdb3] uppercase">SOLD OUT</span>
          </div>
        </div>
        <div className="bg-[#1c1b1b] p-3 flex flex-col justify-between border-l-2 border-[#ffc703]">
          <span className="font-mono text-[10px] text-[#e8bdb3] uppercase tracking-widest">CASUALTIES</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline text-2xl text-[#ffc703]">N/A</span>
            <span className="font-mono text-xs text-[#ffc703] uppercase">UNCOUNTED</span>
          </div>
        </div>
      </div>

      {/* Territory Filters */}
      <div className="px-4 py-3 bg-[#131313] border-y border-[#262626]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`shrink-0 px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                selectedRegion === tab.id
                  ? 'bg-[#ff562f] text-[#0e0e0e] shadow-[2px_2px_0px_#ffc703]'
                  : 'bg-[#2a2a2a] text-[#e8bdb3] hover:bg-[#353534]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live Gig Schedule List */}
      <div className="flex flex-col gap-3 px-4 mt-4">
        {filteredGigs.map((gig) => (
          <div
            key={gig.id}
            className="flex flex-col bg-[#1c1b1b] p-4 border border-[#2a2a2a] shadow-md relative hover:border-[#ff562f] transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#ff562f] font-bold tracking-widest">
                  {gig.cityCode}
                </span>
                {gig.badge && (
                  <span className="px-1.5 py-0.5 bg-[#353534] text-[#e5e2e1] font-mono text-[9px] uppercase font-bold">
                    {gig.badge}
                  </span>
                )}
              </div>
              {gig.moshLevel ? (
                <div className="flex items-center gap-1 text-[#ff562f]">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                    {gig.moshLevel}
                  </span>
                </div>
              ) : (
                <span className="font-mono text-[10px] text-[#e8bdb3] uppercase">
                  {gig.doors || 'DOORS 18:30'}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="font-headline text-xl md:text-2xl text-[#e5e2e1] uppercase tracking-tight">
                  {gig.venue}
                </span>
                <span className="font-body text-xs md:text-sm text-[#e8bdb3]">
                  {gig.location}
                </span>
              </div>
              <div className="flex flex-col items-end shrink-0 bg-[#201f1f] px-3 py-1.5 border border-[#333]">
                <span className="font-mono text-[9px] text-[#e8bdb3] uppercase">DATE</span>
                <span className="font-headline text-lg text-[#ffb4a3]">{gig.dateFormatted}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 my-3">
              {gig.tags.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 font-mono text-[9px] uppercase ${
                    tag.includes('FEAT')
                      ? 'bg-[#ffc703] text-[#3e2e00] font-bold'
                      : 'bg-[#353534] text-[#e5e2e1]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#262626]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full inline-block ${
                    gig.isSoldOut ? 'bg-[#ffb4ab]' : 'bg-[#ffc703] animate-ping'
                  }`}
                ></span>
                <span className={`font-mono text-[10px] md:text-xs uppercase font-bold tracking-wider ${gig.statusColor}`}>
                  {gig.statusText}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openVenueDirections(`${gig.venue}, ${gig.location}`)}
                  className="px-2.5 py-1.5 bg-[#2a2a2a] hover:bg-[#3a3939] text-[#ffc703] font-mono text-[10px] uppercase font-bold flex items-center gap-1"
                  title="Google Maps venue info and directions"
                >
                  <span className="material-symbols-outlined text-[14px]">map</span>
                  INTEL
                </button>
                <button
                  onClick={() => handleGigAction(gig)}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase font-bold tracking-wider active:scale-95 shadow-lg ${
                    gig.actionType === 'pit-pass'
                      ? 'bg-[#ff562f] text-[#0e0e0e] hover:bg-[#ffc703]'
                      : gig.actionType === 'waitlist'
                      ? 'bg-[#353534] text-[#e5e2e1] hover:bg-[#4a4949]'
                      : 'bg-[#ff562f] text-[#0e0e0e] hover:bg-[#ffc703]'
                  }`}
                >
                  {gig.actionText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Headquarters & Pit Coord Map Feature */}
      <div className="px-4 mt-6">
        <div className="bg-[#1c1b1b] p-4 flex flex-col gap-3 border border-[#2a2a2a] shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff562f] text-[20px]">pin_drop</span>
              <span className="font-mono text-xs text-[#e5e2e1] font-bold uppercase tracking-wider">
                HEADQUARTERS &amp; PIT COORD
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#ffc703] uppercase font-bold">
              NEXT RITUAL
            </span>
          </div>

          <div
            onClick={() => openVenueDirections('The Brooklyn Monarch, 23 Meadow St, Brooklyn, NY 11206')}
            className="w-full h-44 bg-cover bg-center border border-[#333] cursor-pointer relative group"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBi0LZRuI3AoXZFUocB4RTcwotlcSEDDfQHYBngVXivLEsurpbpyT3qlmDDhjPfowK44qZkHhlrCVqFOzwW2Zhs7IyZ8PGdnYt6kFsBEJV6SJNl2eGSbYMCzpvdyafqAlYEE3k6VITzupKMRLkIPxLj-B1xKQBoMBk3b3dMszZreRMqU3sVh0EDKoz5zAKXB7ftbFlRfqHKk8hT2kWn0-08wQhj6qhOrHLx9AgR6JMPXAiDz087D07kcw')`
            }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <span className="bg-[#0e0e0e]/90 border border-[#ff562f] px-3 py-1 font-mono text-xs text-[#ffc703] uppercase font-bold flex items-center gap-1.5 shadow-lg">
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                EXPLORE REAL-TIME GOOGLE MAPS
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-mono text-xs text-[#e5e2e1] uppercase font-bold">
                THE BROOKLYN MONARCH
              </span>
              <span className="font-mono text-[10px] text-[#e8bdb3] uppercase">
                23 MEADOW ST, BROOKLYN, NY 11206
              </span>
            </div>
            <button
              onClick={() => openVenueDirections('The Brooklyn Monarch, 23 Meadow St, Brooklyn, NY 11206')}
              className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#ff562f] hover:text-[#0e0e0e] text-[#e5e2e1] font-mono text-[10px] uppercase font-bold tracking-widest active:scale-95 transition-colors"
            >
              GET DIRECTIONS
            </button>
          </div>
        </div>
      </div>

      {/* Merch / Pit Pass Upsell Strip */}
      <div className="px-4 mt-6">
        <div className="bg-[#ff562f] text-[#0e0e0e] p-4 flex items-center justify-between shadow-xl">
          <div className="flex flex-col">
            <span className="font-headline text-lg uppercase tracking-tight">
              LIMITED TOUR CREW SHRED
            </span>
            <span className="font-mono text-[10px] uppercase font-bold opacity-90">
              WORLDWIDE SHIPPING // ONLY 100 PIECES PRINTED
            </span>
          </div>
          <button
            onClick={onNavigateToMerch}
            className="shrink-0 px-4 py-2 bg-[#0e0e0e] text-[#e5e2e1] hover:bg-[#ffc703] hover:text-[#0e0e0e] font-mono text-xs uppercase font-bold tracking-wider shadow-md active:scale-95 transition-colors"
          >
            COP GEAR
          </button>
        </div>
      </div>

      {/* Stamp of Disavowal */}
      <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-1 opacity-70">
        <span className="font-mono text-xs text-[#ff562f] uppercase tracking-widest font-bold rotate-[-1deg]">
          AUTHENTIC BRONX SOUND DAMAGE // NON-REFUNDABLE IN THE MOSH
        </span>
        <span className="font-mono text-[9px] text-[#e8bdb3] uppercase tracking-widest mt-1">
          SER. NO: #ALT-0718-NYHC-2025 // AUDIO WEAPONRY DEPLOYMENT
        </span>
      </div>

      {/* Google Maps Agent Modal */}
      <GoogleMapsAgentModal
        isOpen={mapsModalOpen}
        onClose={() => setMapsModalOpen(false)}
        initialVenue={selectedVenueForMaps}
      />
    </div>
  );
};
