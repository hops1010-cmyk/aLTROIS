import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { TourDatesScreen } from './components/TourDatesScreen';
import { SonicArsenalScreen } from './components/SonicArsenalScreen';
import { MerchScreen } from './components/MerchScreen';
import { CrewScreen } from './components/CrewScreen';
import { MiniPlayerBar } from './components/MiniPlayerBar';
import { OrderItem } from './types';
import { audioEngine, AudioPlaybackState } from './services/hardcoreAudioEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('sonic-arsenal');
  const [moshMode, setMoshMode] = useState(false);
  const [cartOrder, setCartOrder] = useState<OrderItem[]>([
    {
      id: 1,
      name: "IT FKN MATTERS Boxy Tee [L]",
      price: 45,
      size: "L"
    }
  ]);
  const [isBreakdownDrop, setIsBreakdownDrop] = useState(false);

  useEffect(() => {
    return audioEngine.subscribe((state: AudioPlaybackState) => {
      setIsBreakdownDrop(state.isBreakdown);
    });
  }, []);

  const handleAddToOrder = (item: OrderItem) => {
    setCartOrder((prev) => [...prev, item]);
  };

  const handleRemoveFromOrder = (id: number) => {
    setCartOrder((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearOrder = () => {
    setCartOrder([]);
  };

  return (
    <div
      className={`min-h-screen bg-[#131313] text-[#e5e2e1] font-body flex flex-col selection:bg-[#ff562f] selection:text-[#0e0e0e] transition-all duration-200 ${
        moshMode && isBreakdownDrop ? 'animate-[pulse_0.15s_ease-in-out_infinite] ring-4 ring-[#ff562f]' : ''
      }`}
    >
      {/* Universal Fixed Header */}
      <Header
        currentTab={currentTab}
        moshMode={moshMode}
        onToggleMoshMode={() => setMoshMode(!moshMode)}
      />

      {/* Main View Area with Top & Bottom Safe Paddings */}
      <main className="flex-1 w-full max-w-4xl mx-auto pt-16 md:pt-20">
        {currentTab === 'tour-dates' && (
          <TourDatesScreen
            onNavigateToMerch={() => setCurrentTab('merch-pit-pass')}
            onSelectPassForGig={(gigVenue) => {
              handleAddToOrder({
                id: Date.now(),
                name: `PIT PASS // ${gigVenue} [ALL-ACCESS]`,
                price: 65,
                size: 'UNIVERSAL SLIDER'
              });
              setCurrentTab('merch-pit-pass');
            }}
          />
        )}

        {currentTab === 'sonic-arsenal' && <SonicArsenalScreen />}

        {currentTab === 'merch-pit-pass' && (
          <MerchScreen
            order={cartOrder}
            onAddToOrder={handleAddToOrder}
            onRemoveFromOrder={handleRemoveFromOrder}
            onClearOrder={handleClearOrder}
          />
        )}

        {currentTab === 'crew-lore' && <CrewScreen />}
      </main>

      {/* Persistent Mini Audio Bar for background playback when browsing other tabs */}
      <MiniPlayerBar
        isVisible={currentTab !== 'sonic-arsenal'}
        onOpenArsenal={() => setCurrentTab('sonic-arsenal')}
      />

      {/* Universal Fixed Bottom Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cartCount={cartOrder.length}
      />
    </div>
  );
}
