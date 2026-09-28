import React, { useState } from 'react';

interface HeaderProps {
  currentTab: 'tour-dates' | 'sonic-arsenal' | 'merch-pit-pass' | 'crew-lore';
  moshMode: boolean;
  onToggleMoshMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, moshMode, onToggleMoshMode }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getSubtitle = () => {
    switch (currentTab) {
      case 'tour-dates':
        return 'Tour Dates';
      case 'sonic-arsenal':
        return 'Sonic Arsenal';
      case 'merch-pit-pass':
        return 'Merch Pit Pass';
      case 'crew-lore':
        return 'Crew Lore';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-[#262626] shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="h-16 md:h-20 px-4 md:px-6 max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#ff562f] inline-block animate-pulse"></span>
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-[#ffb4a3] font-bold">
                BRONX HARDCORE // LIVE WORLDWIDE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-xl md:text-2xl text-[#e5e2e1] uppercase tracking-tight">
                aLTROIS
              </span>
              <span className="font-mono text-xs md:text-sm text-[#e8bdb3] font-bold">
                {getSubtitle()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMoshMode}
            className={`px-2 py-0.5 font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
              moshMode
                ? 'bg-[#ff562f] text-[#0e0e0e] shadow-[0_0_12px_#ff562f]'
                : 'bg-[#ffc703] text-[#3e2e00] hover:bg-[#ffe9b9]'
            }`}
            title="Click to toggle mosh pit overload mode"
          >
            {moshMode ? '⚡ WALL OF DEATH' : 'MOSH ACTIVE'}
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            className="relative w-8 h-8 rounded-full overflow-hidden border border-[#ff562f] hover:scale-105 transition-transform"
            title="Band Identity & Directives"
          >
            <img
              alt="aLTROIS Logo"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzkp16-YWABoeE41zvIefjsa2YLQBfIv74dLs8Zx5oC_PWtyhuKCNaclo94x0Tiy7c6r0VdqSQ_CaVk651jTxfa5M1b1kw7bh8z2TDWw_10g4pot_0R3PB0jTzhOoubpITo6Ga-7pXoHRbYIOF-QolB0mG-poL7a9ZcxbG6zoVG0eHAzoIra7_P0y0zIhmhUQ3sq_oTiH0GkIQ4z8GdWm696r4qYZRLpprl-5kAbHXOk8gtTlSS8ZDzA"
            />
          </button>
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border-2 border-[#ff562f] max-w-md w-full p-5 shadow-[4px_4px_0px_#ffc703] relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#353534]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ff562f] inline-block"></span>
                <span className="font-mono text-xs text-[#ff562f] font-bold uppercase tracking-wider">
                  SECURITY CLEARANCE // AUTHENTICATED
                </span>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-[#e5e2e1] hover:text-[#ff562f] font-mono font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 my-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzkp16-YWABoeE41zvIefjsa2YLQBfIv74dLs8Zx5oC_PWtyhuKCNaclo94x0Tiy7c6r0VdqSQ_CaVk651jTxfa5M1b1kw7bh8z2TDWw_10g4pot_0R3PB0jTzhOoubpITo6Ga-7pXoHRbYIOF-QolB0mG-poL7a9ZcxbG6zoVG0eHAzoIra7_P0y0zIhmhUQ3sq_oTiH0GkIQ4z8GdWm696r4qYZRLpprl-5kAbHXOk8gtTlSS8ZDzA"
                alt="Badge"
                className="w-16 h-16 border-2 border-[#ffc703]"
              />
              <div className="flex flex-col">
                <span className="font-headline text-2xl text-[#e5e2e1] uppercase">aLTROIS</span>
                <span className="font-mono text-xs text-[#ffc703]">SOUTH BRONX NYHC CREW</span>
                <span className="font-mono text-[10px] text-[#e8bdb3]">EST. 2018 // MOTIVATIONAL BEATDOWN</span>
              </div>
            </div>

            <p className="font-body text-xs text-[#e8bdb3] leading-relaxed mb-4">
              Raw underground sound weaponized on the pavement between 138th St & Bruckner Blvd.
              Powered by Lyria 3 Clip AI audio, Google Maps live venue telemetry, and 32Hz sub-bass transients.
            </p>

            <button
              onClick={() => setShowProfileModal(false)}
              className="w-full py-2 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono text-xs font-bold uppercase tracking-wider"
            >
              ACKNOWLEDGE & RETURN TO PIT
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
