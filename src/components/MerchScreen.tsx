import React, { useState } from 'react';
import { MerchItem, OrderItem } from '../types';
import { MERCH_ITEMS } from '../data/mockData';

interface MerchScreenProps {
  order: OrderItem[];
  onAddToOrder: (item: OrderItem) => void;
  onRemoveFromOrder: (id: number) => void;
  onClearOrder: () => void;
}

export const MerchScreen: React.FC<MerchScreenProps> = ({
  order,
  onAddToOrder,
  onRemoveFromOrder,
  onClearOrder
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'threads' | 'passes'>('all');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'merch-tee': 'L',
    'merch-hoodie': 'XL'
  });
  const [fulfillmentType, setFulfillmentType] = useState<'venue' | 'ship'>('venue');
  const [selectedCity, setSelectedCity] = useState('Bronx, NY // Webster Hall [May 12]');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filterTabs = [
    { id: 'all' as const, label: 'ALL GEAR [5]' },
    { id: 'threads' as const, label: 'THREADS & WAX' },
    { id: 'passes' as const, label: 'PIT PASSES' }
  ];

  const filteredItems = MERCH_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'threads') return item.category === 'apparel' || item.category === 'wax' || item.category === 'hardware';
    if (activeCategory === 'passes') return item.category === 'passes';
    return true;
  });

  const handleSelectSize = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [itemId]: size }));
  };

  const handleAddItem = (item: MerchItem) => {
    const chosenSize = selectedSizes[item.id] || item.sizes[0];
    onAddToOrder({
      id: Date.now(),
      name: `${item.title}${item.category === 'apparel' ? ` [${chosenSize}]` : ''}`,
      price: item.price,
      size: chosenSize
    });
    setToastMessage(`STAGED TO MANIFEST: ${item.title}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const totalDue = order.reduce((sum, i) => sum + i.price, 0);

  const executeCheckout = () => {
    if (order.length === 0) {
      setToastMessage('MANIFEST EMPTY // CHOOSE GEAR TO SECURE YOUR DROP.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setOrderModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#ffc703] text-[#3e2e00] font-mono text-xs font-bold px-4 py-2 shadow-2xl border-2 border-[#0e0e0e] max-w-sm text-center animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Hazard Marquee Ticker */}
      <div className="w-full bg-[#ffc703] text-[#3e2e00] py-1 overflow-hidden select-none shadow-md">
        <div className="flex items-center gap-4 whitespace-nowrap animate-pulse font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest px-4">
          <span>/// CRITICAL TOUR ARMORY ///</span>
          <span>STOCK DEPLETING IN REAL-TIME</span>
          <span>/// AUTHENTIC BRONX MOSH GEAR ///</span>
          <span>PIT COLLECTION VERIFIED</span>
          <span>/// ALL SALES FINAL IN THE PIT ///</span>
        </div>
      </div>

      {/* Header Banner Section */}
      <div className="p-4 md:p-6 flex flex-col gap-1 bg-[#0e0e0e] border-b border-[#262626]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#ff562f] inline-block"></span>
            <span className="font-mono text-xs text-[#ff562f] uppercase font-bold tracking-widest">
              DEPOT // 2025 TOUR SUPPLY
            </span>
          </div>
          <span className="bg-[#2a2a2a] text-[#e5e2e1] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
            SECURE LINK
          </span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl uppercase text-[#e5e2e1] tracking-tight mt-1">
          OFFICIAL TOUR ARMORY // MERCH &amp; EXCLUSIVES
        </h1>
        <div className="p-2.5 bg-[#1c1b1b] text-[#e8bdb3] flex items-start gap-2 mt-2 border-l-2 border-[#ff562f]">
          <span className="material-symbols-outlined text-[#ff562f] text-[20px] shrink-0 mt-0.5">
            warning
          </span>
          <p className="font-body text-xs md:text-sm leading-snug">
            Tour-only pressings and apparel. Ships direct or pick up at the pit table.
          </p>
        </div>
      </div>

      {/* Mode Filter Switch */}
      <div className="px-4 py-3 flex items-center gap-2 bg-[#131313] border-b border-[#262626]">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`flex-1 py-1.5 px-3 font-mono text-[11px] font-bold uppercase tracking-wider text-center transition-all ${
              activeCategory === tab.id
                ? 'bg-[#ff562f] text-[#0e0e0e] shadow-[2px_2px_0px_#ffc703]'
                : 'bg-[#2a2a2a] text-[#e8bdb3] hover:bg-[#353534]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Merch Catalog Stack */}
      <div className="flex flex-col gap-4 p-4 bg-[#131313]">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col border shadow-xl overflow-hidden ${
              item.category === 'passes'
                ? 'bg-[#1c1b1b] border-2 border-[#ffc703]'
                : 'bg-[#0e0e0e] border-[#262626]'
            }`}
          >
            {item.category === 'passes' && (
              <div className="w-full bg-[#ffc703] text-[#3e2e00] px-3 py-1 flex items-center justify-between font-mono text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  MAX LEVEL ADMISSION
                </span>
                <span>SECURITY ENCRYPTED</span>
              </div>
            )}

            {/* Product Image */}
            <div className="relative w-full aspect-[4/3] bg-[#1c1b1b] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute top-2 left-2 px-2 py-0.5 font-mono text-[10px] uppercase font-bold tracking-widest ${
                  item.badgeType === 'limited'
                    ? 'bg-[#ffc703] text-[#3e2e00]'
                    : item.badgeType === 'limit'
                    ? 'bg-[#93000a] text-[#ffdad6]'
                    : 'bg-[#0e0e0e]/90 text-[#ff562f]'
                }`}
              >
                {item.badge}
              </div>
              <div
                className={`absolute bottom-2 right-2 px-3 py-1 font-headline text-2xl uppercase ${
                  item.category === 'passes'
                    ? 'bg-[#ffc703] text-[#3e2e00]'
                    : 'bg-[#ff562f] text-[#0e0e0e]'
                }`}
              >
                ${item.price}
              </div>
            </div>

            {/* Info and Selectors */}
            <div className="p-4 flex flex-col gap-2">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-[#e8bdb3] uppercase">
                  {item.subtitle}
                </span>
                <h2 className="font-headline text-xl md:text-2xl uppercase text-[#e5e2e1] tracking-wide leading-tight mt-0.5">
                  {item.title}
                </h2>
              </div>

              <p className="font-body text-xs md:text-sm text-[#e8bdb3]">
                {item.description}
              </p>

              {/* Checklist for Pit Pass */}
              {item.checklist && (
                <ul className="flex flex-col gap-1.5 py-1 text-xs text-[#e8bdb3]">
                  {item.checklist.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ffc703] text-[16px]">
                        check_box
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Stock Status for Vinyl */}
              {item.stockStatus && (
                <div className="flex items-center justify-between p-2 bg-[#2a2a2a] font-mono text-xs text-[#e5e2e1]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ffc703] inline-block animate-ping"></span>
                    PRESSING STATUS:
                  </span>
                  <span className="text-[#ff562f] font-bold">{item.stockStatus}</span>
                </div>
              )}

              {/* Size Selector for Apparel */}
              {item.category === 'apparel' && item.sizes && (
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="uppercase font-bold text-[#e5e2e1]">CHOOSE CUT:</span>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-[#ff562f] hover:underline"
                    >
                      SIZE GUIDE [?]
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-1 font-mono text-xs">
                    {item.sizes.map((sz) => {
                      const isSoldOut = sz.includes('SOLD OUT');
                      const cleanSz = sz.split(' ')[0];
                      const isSelected = selectedSizes[item.id] === cleanSz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          disabled={isSoldOut}
                          onClick={() => handleSelectSize(item.id, cleanSz)}
                          className={`py-1 text-center font-bold uppercase transition-all ${
                            isSoldOut
                              ? 'bg-[#2a2a2a] text-[#555] line-through cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#ff562f] text-[#0e0e0e]'
                              : 'bg-[#2a2a2a] text-[#e5e2e1] hover:bg-[#3a3939]'
                          }`}
                        >
                          {cleanSz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Manifest Button */}
              <button
                type="button"
                onClick={() => handleAddItem(item)}
                className={`mt-2 w-full py-2.5 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                  item.category === 'passes'
                    ? 'bg-[#ffc703] hover:bg-[#ffe9b9] text-[#3e2e00]'
                    : 'bg-[#2a2a2a] hover:bg-[#ff562f] text-[#e5e2e1] hover:text-[#0e0e0e]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.category === 'passes' ? 'confirmation_number' : 'add_shopping_cart'}
                </span>
                <span>
                  {item.category === 'passes' ? 'CLAIM PIT PASS ACCESS' : 'ADD TO TACTICAL MANIFEST'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CHECKOUT & FULFILLMENT PANEL */}
      <div className="mt-4 p-4 md:p-6 bg-[#0e0e0e] border-t border-[#262626] flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ffc703] inline-block"></span>
            <h3 className="font-headline text-xl md:text-2xl uppercase text-[#e5e2e1] tracking-tight">
              FULFILLMENT DISPATCH
            </h3>
          </div>
          <span className="font-mono text-xs text-[#ff562f] uppercase font-bold">
            {order.length} ITEMS STAGED
          </span>
        </div>

        {/* Fulfillment Type Radio Cards */}
        <div className="grid grid-cols-2 gap-2 font-mono">
          <label
            onClick={() => setFulfillmentType('venue')}
            className={`flex flex-col p-3 border cursor-pointer transition-colors ${
              fulfillmentType === 'venue'
                ? 'bg-[#2a2a2a] border-[#ff562f]'
                : 'bg-[#181818] border-[#333]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentType === 'venue'}
                onChange={() => setFulfillmentType('venue')}
                className="accent-[#ff562f]"
              />
              <span className="text-[10px] uppercase font-bold text-[#ffc703]">
                FAST PICKUP
              </span>
            </div>
            <span className="text-xs uppercase font-bold text-[#e5e2e1]">SNAG AT VENUE</span>
            <span className="text-[11px] text-[#e8bdb3]">Pit Merch Desk Pickup</span>
          </label>

          <label
            onClick={() => setFulfillmentType('ship')}
            className={`flex flex-col p-3 border cursor-pointer transition-colors ${
              fulfillmentType === 'ship'
                ? 'bg-[#2a2a2a] border-[#ff562f]'
                : 'bg-[#181818] border-[#333]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentType === 'ship'}
                onChange={() => setFulfillmentType('ship')}
                className="accent-[#ff562f]"
              />
              <span className="text-[10px] uppercase font-bold text-[#e8bdb3]">
                WORLDWIDE
              </span>
            </div>
            <span className="text-xs uppercase font-bold text-[#e5e2e1]">DIRECT FREIGHT</span>
            <span className="text-[11px] text-[#e8bdb3]">Ships in sealed polybag</span>
          </label>
        </div>

        {/* Venue Pickup Selector */}
        {fulfillmentType === 'venue' ? (
          <div className="flex flex-col gap-1.5 p-3 bg-[#181818] border border-[#2a2a2a]">
            <label className="font-mono text-[10px] uppercase font-bold text-[#e5e2e1] flex items-center justify-between">
              <span>DESIGNATE TOUR PICKUP STOP:</span>
              <span className="text-[#ffc703]">READY DOORS OPEN @ 18:00</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#0e0e0e] text-[#e5e2e1] p-2.5 font-mono text-xs uppercase font-bold border border-[#333] outline-none"
            >
              <option value="Bronx, NY // Webster Hall [May 12]">BRONX, NY // WEBSTER HALL [MAY 12]</option>
              <option value="Philadelphia, PA // First Unitarian Church [May 14]">PHILADELPHIA, PA // FIRST UNITARIAN CHURCH [MAY 14]</option>
              <option value="Detroit, MI // The Sanctuary [May 16]">DETROIT, MI // THE SANCTUARY [MAY 16]</option>
              <option value="Chicago, IL // Subterranean [May 18]">CHICAGO, IL // SUBTERRANEAN [MAY 18]</option>
              <option value="Berlin, DE // SO36 [June 02]">BERLIN, DE // SO36 [JUNE 02]</option>
              <option value="London, UK // Underworld Camden [June 05]">LONDON, UK // UNDERWORLD CAMDEN [JUNE 05]</option>
              <option value="Tokyo, JP // Club Asia Shibuya [June 19]">TOKYO, JP // CLUB ASIA SHIBUYA [JUNE 19]</option>
            </select>
            <p className="font-mono text-[10px] text-[#e8bdb3] mt-1">
              Present order barcode at the merch cage. Pit passes issued directly at VIP turnstile.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-3 bg-[#181818] border border-[#2a2a2a] font-mono text-xs">
            <label className="text-[10px] uppercase font-bold text-[#e5e2e1]">
              ENTER TARGET COORDINATES // MAILING ADDRESS:
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="STREET ADDRESS, APARTMENT / SUITE"
              className="w-full bg-[#0e0e0e] text-[#e5e2e1] p-2 border border-[#333] outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="CITY / PROVINCE"
                className="w-full bg-[#0e0e0e] text-[#e5e2e1] p-2 border border-[#333] outline-none"
              />
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="POSTAL CODE / COUNTRY"
                className="w-full bg-[#0e0e0e] text-[#e5e2e1] p-2 border border-[#333] outline-none"
              />
            </div>
          </div>
        )}

        {/* Tactical Order Ledger */}
        <div className="p-3 bg-[#181818] border border-[#262626] flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1 border-b border-[#2a2a2a]">
            <span className="font-mono text-xs text-[#e5e2e1] uppercase font-bold">
              TACTICAL ORDER LEDGER
            </span>
            <button
              type="button"
              onClick={onClearOrder}
              className="font-mono text-[10px] uppercase text-[#ff562f] font-bold hover:underline"
            >
              RESET
            </button>
          </div>

          <div className="flex flex-col gap-1 min-h-[48px] justify-center font-mono text-xs">
            {order.length === 0 ? (
              <span className="text-[#e8bdb3]/60 italic text-center py-2">
                NO GEAR SELECTED. TAP ANY ITEM TO ENGAGE.
              </span>
            ) : (
              order.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1 bg-[#0e0e0e] px-2 text-[#e5e2e1]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[#ff562f] font-bold">&gt;</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold">${item.price}.00</span>
                    <button
                      type="button"
                      onClick={() => onRemoveFromOrder(item.id)}
                      className="text-[#ffb4ab] font-bold px-1.5 hover:bg-[#333]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#2a2a2a]">
            <span className="font-headline text-lg uppercase text-[#e5e2e1]">TOTAL DUE</span>
            <span className="font-headline text-2xl uppercase text-[#ffc703]">
              ${totalDue}.00
            </span>
          </div>
        </div>

        {/* Order Action Button */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={executeCheckout}
            className="w-full py-3.5 bg-[#ff562f] hover:bg-[#ffc703] text-[#0e0e0e] font-mono text-xs md:text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_#ffc703] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <span>LOCK IN ORDER // PAY WITH APPLE PAY / CRYPTO</span>
          </button>
          <div className="flex items-center justify-center gap-3 text-[#e8bdb3]/70 font-mono text-[10px] uppercase tracking-wider py-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">lock</span> 256-BIT ENCRYPTION
            </span>
            <span>•</span>
            <span>IMMEDIATE MINT CONFIRMATION</span>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border-2 border-[#ff562f] max-w-md w-full p-5 shadow-[4px_4px_0px_#ffc703]">
            <div className="flex items-center justify-between pb-2 border-b border-[#353534]">
              <span className="font-mono text-xs text-[#ff562f] font-bold uppercase">
                CUT &amp; FIT SPECIFICATION // BOX OVERSIZED
              </span>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="text-[#e5e2e1] font-mono text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-xs font-mono text-[#e8bdb3] flex flex-col gap-2">
              <p>Heavyweight drop-shoulder street cut. 280 GSM ring-spun cotton.</p>
              <div className="bg-[#0e0e0e] p-3 border border-[#333] flex flex-col gap-1">
                <div>• S: 22" CHEST // 28" LENGTH</div>
                <div>• M: 24" CHEST // 29" LENGTH</div>
                <div>• L: 26" CHEST // 30" LENGTH (STAGE FIT)</div>
                <div>• XL: 28" CHEST // 31" LENGTH (PIT ARMOR)</div>
                <div>• 2XL: 30" CHEST // 32" LENGTH</div>
              </div>
              <p className="text-[#ffc703]">Recommendation: Order true size for stage fit, or size 1-up to wear over hoodie in the pit.</p>
            </div>
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-2 bg-[#ff562f] text-[#0e0e0e] font-mono text-xs font-bold uppercase"
            >
              GOT IT // CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Order Confirmed Receipt Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131313] border-2 border-[#ffc703] max-w-lg w-full p-5 shadow-[6px_6px_0px_#ff562f] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#333]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#ffc703] inline-block animate-ping"></span>
                <span className="font-mono text-xs text-[#ffc703] font-bold uppercase tracking-wider">
                  [TRANSACTION ENGAGED] // SERIAL #ALT-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-[#e5e2e1] font-mono text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0e0e0e] p-4 border border-[#262626] font-mono text-xs flex flex-col gap-2">
              <div className="flex justify-between text-[#ff562f] font-bold">
                <span>FULFILLMENT MODE:</span>
                <span>{fulfillmentType === 'venue' ? 'VENUE DESK PICKUP' : 'DIRECT FREIGHT'}</span>
              </div>
              <div className="flex justify-between text-[#e5e2e1]">
                <span>DESTINATION:</span>
                <span className="text-right truncate max-w-[220px]">
                  {fulfillmentType === 'venue' ? selectedCity : (streetAddress || 'WORLDWIDE FREIGHT')}
                </span>
              </div>
              <div className="border-t border-[#222] my-1"></div>
              {order.map((item) => (
                <div key={item.id} className="flex justify-between text-[#e8bdb3]">
                  <span>{item.name}</span>
                  <span>${item.price}.00</span>
                </div>
              ))}
              <div className="border-t border-[#222] pt-2 flex justify-between font-headline text-xl text-[#ffc703]">
                <span>TOTAL BILLED:</span>
                <span>${totalDue}.00</span>
              </div>
            </div>

            <div className="p-3 bg-[#1c1b1b] border-l-2 border-[#ff562f] font-mono text-[11px] text-[#e8bdb3]">
              Present encrypted QR barcode at the pit merchandise desk or show confirmation email. See you on the floor.
            </div>

            <button
              onClick={() => {
                setOrderModalOpen(false);
                onClearOrder();
                setToastMessage('DISPATCH LOCKED. ENCRYPTED CONFIRMATION ISSUED.');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="w-full py-3 bg-[#ff562f] text-[#0e0e0e] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ffc703]"
            >
              CONFIRM DISPATCH &amp; CLEAR STAGING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
