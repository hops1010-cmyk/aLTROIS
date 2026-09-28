import React from 'react';

export type TabId = 'tour-dates' | 'sonic-arsenal' | 'merch-pit-pass' | 'crew-lore';

interface NavigationProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  cartCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab, cartCount }) => {
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'tour-dates', label: 'TOUR DATES', icon: 'calendar_today' },
    { id: 'sonic-arsenal', label: 'ARSENAL', icon: 'graphic_eq' },
    { id: 'merch-pit-pass', label: 'PIT PASS', icon: 'confirmation_number' },
    { id: 'crew-lore', label: 'CREW', icon: 'skull' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#0e0e0e]/95 backdrop-blur-xl border-t border-[#262626] shadow-[0_-4px_24px_rgba(0,0,0,0.9)]">
      <div className="flex justify-around items-center h-16 md:h-20 max-w-4xl mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 w-20 h-14 transition-colors relative ${
                isActive
                  ? 'text-[#ff562f]'
                  : 'text-[#e8bdb3]/70 hover:text-[#e5e2e1]'
              }`}
            >
              {tab.id === 'merch-pit-pass' && cartCount > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 bg-[#ffc703] text-[#3e2e00] font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-8 h-0.5 bg-[#ff562f] absolute bottom-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
