import React, { useState } from 'react';
import { PIT_RULES } from '../data/mockData';
import fiveBoysImage from '../assets/images/altrois_five_boys_1790577792432.jpg';

export const CrewScreen: React.FC = () => {
  const [pitCodeSworn, setPitCodeSworn] = useState(false);
  const [openArticle, setOpenArticle] = useState<number | null>(null);
  const [customInstructionsModalOpen, setCustomInstructionsModalOpen] = useState(false);
  const [customDirectives, setCustomDirectives] = useState(
    `[BAND PRODUCTION CONSTITUTION]
- Tuning: Standard Drop-F (F-C-F-A#-D-G) on 28.5" Baritone or 8-String
- Distortion: Pre-amp Peavey 6505+ combined with Japanese Boss HM-2 maxed gain
- Vocal Directives: Raw Bronx street barks, no pitch correction, unhinged physical energy
- Pit Ethics: Stage dives permitted, protect the fallen, zero corporate security interference`
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleArticle = (index: number) => {
    setOpenArticle(openArticle === index ? null : index);
  };

  const handleSwearCode = () => {
    setPitCodeSworn(true);
    setToastMessage('PIT OATH RECORDED // AUTHENTICATED PIT VETERAN STATUS GRANTED.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fiveBoys = [
    {
      unitId: 'UNIT 01',
      name: 'ROCCO "ANVIL" V.',
      role: 'VOCAL COMMAND // FRONTMAN',
      specialty: 'Bronx street bark, guttural sub-octave low slams, unhinged physical crowd control, zero mic stand policy.'
    },
    {
      unitId: 'UNIT 02',
      name: 'MALIK VANCE',
      role: 'LEAD WARHEAD // GUITAR',
      specialty: '8-String Drop-F chugs, dissonant groove squeals, abrasive high-feedback panic chords, rhythmic blunt-force trauma.'
    },
    {
      unitId: 'UNIT 03',
      name: 'HECTOR "THUD" REYES',
      role: 'SEISMIC FREQUENCY // BASS',
      specialty: 'Overdriven subterranean clank pushed through dual Ampeg SVT full rigs, punishing mid-range attack, ribcage reverberation.'
    },
    {
      unitId: 'UNIT 04',
      name: 'DANTE CRUZ',
      role: 'KINETIC ENGINE // DRUMS',
      specialty: '280 BPM grind blast beats transitioning abruptly into swinging Texas two-step beats and ungodly halftime breakdown slugs.'
    },
    {
      unitId: 'UNIT 05',
      name: 'MARCO "SLAG" CRUZ',
      role: 'RHYTHM AXE & BARK // COMBAT VOCALS',
      specialty: 'Dual-tracked baritone chugs, gang shout coordination, bar-64 crowd callout spit, and second-stage physical pit security.'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#ffc703] text-[#3e2e00] font-mono text-xs font-bold px-4 py-2 shadow-2xl border-2 border-[#0e0e0e] max-w-sm text-center animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Field Transmission Header */}
      <div className="w-full bg-[#ffc703] text-[#3e2e00] py-1 px-4 flex items-center justify-between font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          FIELD TRANSMISSION // HISTORIC LOG BX-071
        </span>
        <span>SEC-L3</span>
      </div>

      {/* Origin Headline Section */}
      <div className="p-4 md:p-6 bg-[#0e0e0e] flex flex-col gap-1 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <span className="bg-[#ff562f] text-[#0e0e0e] font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
            10454 ORIGIN
          </span>
          <span className="font-mono text-xs text-[#e8bdb3] uppercase font-bold">
            EST. 2018 // SOUTH BRONX
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl uppercase text-[#e5e2e1] tracking-tight mt-1">
          FROM THE BRONX <span className="text-[#ff562f]">aLTROIS</span> COME...
        </h1>
        <p className="font-headline text-xl md:text-3xl uppercase text-[#ffc703] tracking-wide">
          ...AND THE PUNKS WATCH THEM STAY.
        </p>
      </div>

      {/* Mott Haven Rehearsal Vault Section */}
      <div className="p-4 bg-[#131313] flex flex-col gap-3">
        <div className="relative w-full aspect-[16/9] bg-[#1c1b1b] border border-[#2a2a2a] overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo3-I-n7wLE-vYNA_jXfD0Fj-ltsnZ_0CEDucF3bxJezRVZ9Hgse749KydCYF9UAwp8gzprY4aBDWc9FR4_snbeLphJw_-i3yodxgstbFx-9o6V71X7eALoykKzJRZ8PBVfl8iSXI79OdpQFYPj8ayLTuYNqQXRTgY_SVly40dkzy5l-oF-iLK5X5gTueZ1Iya41oIkYY77fmEImgBucrJaPlknYe-hUOuh4hg6LAyVnJ4BQU5TW8FFQ"
            alt="Rehearsal Vault"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-[#0e0e0e]/90 px-2 py-0.5 font-mono text-[10px] text-[#ffdad2] uppercase tracking-wider font-bold">
            [ARCHIVE: MOTT HAVEN REHEARSAL VAULT]
          </div>
          <div className="absolute bottom-2 right-2 bg-[#ff562f] text-[#0e0e0e] px-2 py-0.5 font-mono text-[10px] uppercase font-bold">
            UNFILTERED NYHC
          </div>
        </div>

        {/* Sonic Dissection Text */}
        <div className="p-4 bg-[#1c1b1b] border border-[#262626] flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#e8bdb3] uppercase">SONIC DISSECTION</span>
            <span className="text-[#ff562f] font-bold uppercase">BEATDOWN x GROOVE</span>
          </div>
          <p className="font-body text-xs md:text-sm text-[#e8bdb3] leading-relaxed">
            Forged on the bloodstained asphalt between 138th Street and Bruckner Boulevard, 
            <strong className="text-[#e5e2e1]"> aLTROIS</strong> collided the unyielding ethos of classic Bronx street hardcore with southern drop-tuned groove weight. We fuse frantic grindcore velocity with devastating Texas two-step swing and syncopated 8-string polyrhythms built to fracture floorboards.
          </p>

          {/* Hard Stats */}
          <div className="grid grid-cols-3 gap-1 pt-3 border-t border-[#2a2a2a] text-center font-mono">
            <div className="p-2 bg-[#0e0e0e]">
              <span className="font-headline text-2xl text-[#e5e2e1]">280</span>
              <span className="text-[10px] text-[#e8bdb3] uppercase block">PEAK BPM</span>
            </div>
            <div className="p-2 bg-[#0e0e0e]">
              <span className="font-headline text-2xl text-[#ff562f]">DROP-F</span>
              <span className="text-[10px] text-[#e8bdb3] uppercase block">TUNING</span>
            </div>
            <div className="p-2 bg-[#0e0e0e]">
              <span className="font-headline text-2xl text-[#ffc703]">132</span>
              <span className="text-[10px] text-[#e8bdb3] uppercase block">DB SPL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Press Pulse Quote */}
      <div className="px-4 mt-2">
        <div className="p-4 bg-[#1c1b1b] border-l-4 border-[#ff562f] flex flex-col gap-1 shadow-md">
          <span className="font-mono text-[10px] text-[#ff562f] uppercase font-bold tracking-wider">
            99 PRESS PULSE
          </span>
          <p className="font-headline text-xl md:text-2xl text-[#e5e2e1] uppercase tracking-wide">
            "KUBLAI KHAN TX MEETS PANTERA THROUGH A BRONX STREET RIOT."
          </p>
          <span className="font-mono text-[10px] text-[#e8bdb3] text-right">
            // PITCHFORK UNDERGROUND
          </span>
        </div>
      </div>

      {/* The Ethos */}
      <div className="px-4 mt-4">
        <div className="p-4 bg-[#0e0e0e] border border-[#262626] flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#e8bdb3] uppercase font-bold">BRONX DIRECTIVE</span>
            <span className="text-[#ffc703]">DOC. REF #00-ETHOS</span>
          </div>
          <h2 className="font-headline text-2xl text-[#e5e2e1] uppercase">THE ETHOS</h2>
          <p className="font-body text-xs md:text-sm text-[#e8bdb3] italic leading-relaxed">
            "We don't play polite metal. We don't do choreographed sets. 16 countries, every basement, warehouse, and festival stage getting dismantled piece by piece."
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-[#222] font-mono text-[10px] text-[#ff562f] font-bold">
            <span>■ GLOBAL CARNAGE LOGGED</span>
            <span>NO POLITE RIFFS</span>
          </div>
        </div>
      </div>

      {/* Lyric Directive Banner */}
      <div className="px-4 mt-4">
        <div className="p-4 bg-[#1c1b1b] border-2 border-[#ff562f] shadow-lg flex flex-col gap-1">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="bg-[#ff562f] text-[#0e0e0e] px-1.5 py-0.5 uppercase font-bold">
              LYRIC DIRECTIVE // BRONX PIT ANTHEM
            </span>
            <span className="text-[#e8bdb3]">TRACK BX-01</span>
          </div>
          <h3 className="font-headline text-2xl md:text-3xl text-[#e5e2e1] uppercase mt-2">
            “YOU LOOKIN THIS WAY?
          </h3>
          <h3 className="font-headline text-2xl md:text-3xl text-[#ff562f] uppercase">
            YOU GOT SOMETHIN TO SAY?
          </h3>
          <h3 className="font-headline text-2xl md:text-3xl text-[#e5e2e1] uppercase">
            GET OUT OF MY WAY”
          </h3>
          <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#2a2a2a] font-mono text-[10px] text-[#e8bdb3]">
            <span>// CROWDKILL CREED</span>
            <span className="text-[#ffc703] font-bold">DECIBEL RATED 132+</span>
          </div>
        </div>
      </div>

      {/* THE FIVE BOYS IN A PIC TOGETHER (User Request Feature) */}
      <div className="px-4 mt-6">
        <div className="bg-[#1c1b1b] border-2 border-[#ffc703] p-4 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#ffc703] inline-block animate-pulse"></span>
              <span className="font-mono text-xs text-[#ffc703] uppercase font-bold tracking-wider">
                FULL SQUADRON // THE FIVE BOYS TOGETHER
              </span>
            </div>
            <span className="bg-[#0e0e0e] text-[#ff562f] font-mono text-[10px] font-bold px-2 py-0.5 uppercase">
              ALL 5 ACTIVE
            </span>
          </div>

          <div className="relative w-full aspect-[16/9] bg-[#0e0e0e] border border-[#333] overflow-hidden">
            <img
              src={fiveBoysImage}
              alt="The Five Boys in a Pic Together"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-[#0e0e0e]/95 border border-[#ff562f] px-2.5 py-1 font-mono text-[10px] text-[#e5e2e1] uppercase font-bold tracking-wider">
              aLTROIS COMBAT SQUADRON // ROCCO • MALIK • HECTOR • DANTE • MARCO
            </div>
          </div>

          <p className="font-body text-xs text-[#e8bdb3] leading-relaxed">
            The five South Bronx brothers standing shoulder to shoulder. From basement generator shows in Mott Haven to headlining European brutal assault tours.
          </p>
        </div>
      </div>

      {/* Combat Personnel / War Ensemble List */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <span className="font-mono text-xs text-[#e5e2e1] uppercase font-bold">
            COMBAT PERSONNEL // WAR ENSEMBLE
          </span>
          <span className="font-mono text-[10px] text-[#ffc703] uppercase font-bold">
            [05 / 05 ACTIVE]
          </span>
        </div>

        <div className="flex flex-col gap-3 mt-3">
          {fiveBoys.map((member) => (
            <div
              key={member.unitId}
              className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 flex flex-col gap-2 hover:border-[#ff562f] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#ff562f] inline-block"></span>
                  <span className="font-headline text-lg md:text-xl text-[#e5e2e1] uppercase tracking-wide">
                    {member.name}
                  </span>
                </div>
                <span className="bg-[#ff562f] text-[#0e0e0e] font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  {member.unitId}
                </span>
              </div>

              <span className="font-mono text-xs text-[#ff562f] uppercase font-bold">
                {member.role}
              </span>

              <div className="p-2.5 bg-[#0e0e0e] border border-[#222] font-mono text-xs text-[#e8bdb3] flex flex-col gap-1">
                <span className="text-[10px] text-[#ffc703] uppercase font-bold">
                  BATTLE SPECIALTY:
                </span>
                <p className="leading-relaxed">
                  {member.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PIT RULES & SURVIVAL CODE ACCORDION */}
      <div className="px-4 mt-6">
        <div className="bg-[#1c1b1b] border border-[#262626] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc703] text-[20px]">verified_user</span>
              <span className="font-headline text-lg uppercase text-[#e5e2e1]">
                PIT RULES &amp; SURVIVAL CODE
              </span>
            </div>
            {pitCodeSworn && (
              <span className="bg-[#ffc703] text-[#3e2e00] font-mono text-[9px] font-bold px-2 py-0.5 uppercase">
                OATH SWORN ✓
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {PIT_RULES.map((rule, idx) => {
              const isOpen = openArticle === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0e0e0e] border border-[#2a2a2a] overflow-hidden"
                >
                  <button
                    onClick={() => toggleArticle(idx)}
                    className="w-full p-3 flex items-center justify-between text-left font-mono text-xs hover:bg-[#181818] transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#ff562f] uppercase font-bold">
                        {rule.article}
                      </span>
                      <span className="text-[#e5e2e1] font-bold mt-0.5">
                        {rule.title}
                      </span>
                    </div>
                    <span className="text-[#ffc703] font-bold">
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="p-3 bg-[#141414] border-t border-[#222] font-body text-xs text-[#e8bdb3] leading-relaxed">
                      {rule.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSwearCode}
            disabled={pitCodeSworn}
            className={`w-full py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              pitCodeSworn
                ? 'bg-[#353534] text-[#ffc703] cursor-default'
                : 'bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] shadow-[2px_2px_0px_#ffc703]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {pitCodeSworn ? 'task_alt' : 'verified'}
            </span>
            <span>{pitCodeSworn ? 'SWEAR RECORDED // MOSH VETERAN STATUS' : 'SWEAR TO THE PIT CODE'}</span>
          </button>
        </div>
      </div>

      {/* Front of House Warfare Specs */}
      <div className="px-4 mt-6">
        <div className="bg-[#0e0e0e] border border-[#262626] p-4 flex flex-col gap-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[10px] text-[#e8bdb3] pb-1 border-b border-[#222]">
            <span>FRONT OF HOUSE WARFARE SPECS</span>
            <span className="text-[#ff562f]">STEREO FX DEPLOYED</span>
          </div>
          <div className="flex justify-between text-[#e5e2e1]">
            <span className="text-[#e8bdb3]">STAGE RIGGING:</span>
            <span className="text-[#ff562f] font-bold">PEAVEY 6505+ // DUAL SVT-VR</span>
          </div>
          <div className="flex justify-between text-[#e5e2e1]">
            <span className="text-[#e8bdb3]">SUB-BASS HARMONICS:</span>
            <span className="text-[#ffc703] font-bold">32 HZ HIGH PASS LIMITER OFF</span>
          </div>

          <button
            onClick={() => setCustomInstructionsModalOpen(true)}
            className="mt-2 py-2 bg-[#2a2a2a] hover:bg-[#353534] text-[#ffc703] font-mono text-[10px] uppercase font-bold text-center"
          >
            INSPECT BAND CUSTOM INSTRUCTIONS &amp; DIRECTIVES
          </button>
        </div>
      </div>

      {/* Custom Instructions Modal */}
      {customInstructionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131313] border-2 border-[#ff562f] max-w-lg w-full p-5 shadow-[6px_6px_0px_#ffc703] flex flex-col gap-3 max-h-[85vh]">
            <div className="flex items-center justify-between pb-2 border-b border-[#333]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff562f] text-[20px]">code</span>
                <span className="font-mono text-xs text-[#ff562f] uppercase font-bold">
                  CUSTOM INSTRUCTIONS // APP STYLE &amp; PREFERENCES
                </span>
              </div>
              <button
                onClick={() => setCustomInstructionsModalOpen(false)}
                className="text-[#e5e2e1] font-mono text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="font-mono text-[11px] text-[#e8bdb3]">
              Stored design constitution and guidelines that dictate colors, fonts (Anton, Chivo, Space Mono),
              hard drop offsets, Lyria AI music parameters, and zero-pill discipline.
            </p>

            <textarea
              rows={8}
              value={customDirectives}
              onChange={(e) => setCustomDirectives(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-[#333] p-3 text-xs text-[#ffdad2] font-mono leading-relaxed outline-none"
            />

            <button
              onClick={() => {
                setCustomInstructionsModalOpen(false);
                setToastMessage('CUSTOM INSTRUCTIONS SAVED TO AGENT WORKSPACE.');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              className="w-full py-2.5 bg-[#ff562f] text-[#0e0e0e] font-mono text-xs font-bold uppercase hover:bg-[#ffc703]"
            >
              SAVE DIRECTIVES
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
