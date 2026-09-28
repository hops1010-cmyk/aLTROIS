import { SongCut, TourDate, MerchItem, CrewMember, PitRule } from '../types';

export const INITIAL_SONGS: SongCut[] = [
  {
    id: 'cut-00',
    cutNumber: 'CUT 00 // FLAGSHIP SLAM',
    title: 'BRONX CONCRETE // TEETH ON THE CURB',
    genreTag: 'BEATDOWN HC // DROP-F SLAM',
    category: 'hardcore',
    description: 'The definitive anthem of South Bronx concrete. Overdriven 8-string baritone chugs transitioning into an apocalyptic half-time beatdown.',
    bpm: 135,
    tuning: 'DROP F (F-C-F-A#-D-G)',
    durationFormatted: '03:42',
    durationSeconds: 222,
    breakdownTimestamp: '02:45',
    breakdownSeconds: 165,
    stencilQuote: '"YOU LOOKIN THIS WAY? YOU GOT SOMETHIN TO SAY? GET OUT OF MY WAY"',
    vocalSpit: "BAR 64 // VOCAL SPIT: MARCO 'SLAG' CRUZ",
    lyrics: `[VERSE 1]
Stepped off the 6 train, asphalt steaming hot
Under the Bruckner bridge, remember what we got
Blood in the gutter, iron in the teeth
You want the crown? Come dig it underneath!

[CHORUS]
YOU LOOKIN THIS WAY?
YOU GOT SOMETHIN TO SAY?
GET OUT OF MY WAY!
CONCRETE CRACKING UNDER BRONX WEIGHT!

[BREAKDOWN - HALF TIME DROP-F]
TEETH. ON. THE. CURB.
ZERO REMORSE. PURE RETRIBUTION.`,
    lyriaPrompt: 'Ultra aggressive heavy hardcore beatdown metal track, 135 BPM slowing into 70 BPM half-time breakdown, severely down-tuned Drop-F 8-string guitars with Swedish HM-2 chainsaw distortion, thunderous double kick drums, gritty subterranean bass clank, shouting NYC hardcore vocals.',
    rigTelemetry: 'BARITONE 28.5" // 5150 BLOCK LETTER + HM-2 // 4x12 V30 OVERSIZED SLAM'
  },
  {
    id: 'cut-01',
    cutNumber: '01',
    title: 'PUNKS WATCH THEM STAY',
    genreTag: 'BRONX HARDCORE // BEATDOWN',
    category: 'hardcore',
    description: 'Featuring Bronx crew vocals, concrete bounce groove, two-step transition into unrelenting floorboard-cracking chugs.',
    bpm: 140,
    tuning: 'DROP D',
    durationFormatted: '02:58',
    durationSeconds: 178,
    breakdownTimestamp: '02:10',
    breakdownSeconds: 130,
    stencilQuote: '"THEY SAID WE WOULD FADE. WE BUILT THE FORTRESS."',
    vocalSpit: "BAR 32 // VOCAL SPIT: ROCCO 'ANVIL' V.",
    lyrics: `[VERSE]
Talk is cheap in the back of the hall
We stand tall when the empires fall
They said we would fade into the gray
From the Bronx aLTROIS come... and the punks watch them stay!

[CHORUS]
PUNKS WATCH THEM STAY!
NO STEPPING BACK! NO GIVING WAY!
LOCK THE PIT!`,
    lyriaPrompt: 'Fast-paced Bronx hardcore punk beatdown anthem, 140 BPM, energetic 2-step punk drums transitioning into heavy syncopated chugging breakdown, gang vocals shouting "Punks watch them stay", distorted bass and driving aggressive rhythm.',
    rigTelemetry: 'FENDER TELE CUSTOM // DUAL RECTIFIER // DROP D'
  },
  {
    id: 'cut-02',
    cutNumber: '02',
    title: 'SPIT CHROME',
    genreTag: 'GRINDCORE // 240 BPM MICRO-TRACK',
    category: 'grindcore',
    description: '42 seconds of pure auditory obliteration. Full blast beats, buzzsaw Swedish HM-2 chainsaw guitars, and blistering feedback bursts.',
    bpm: 240,
    tuning: 'DROP C',
    durationFormatted: '00:42',
    durationSeconds: 42,
    breakdownTimestamp: '00:30',
    breakdownSeconds: 30,
    stencilQuote: '"PURE AUDITORY OBLITERATION. ZERO PITCH CORRECTION."',
    vocalSpit: "BAR 16 // VOCAL SPIT: ROCCO 'ANVIL' V.",
    lyrics: `[BLAST]
SPIT CHROME! BURN BONE!
NO RETREAT! CRUSH THE THRONE!
FORTY-TWO SECONDS OF ABSOLUTE RAGE!`,
    lyriaPrompt: 'Furious 240 BPM grindcore micro-track, 42 seconds long, lightning fast blast beats, buzzsaw Swedish HM-2 guitar tone, chaotic frenetic aggression, guttural screams and shrieks.',
    rigTelemetry: 'HM-2 WAZA MAX GAIN // PEAVEY 5150 // SPEED ENGINE'
  },
  {
    id: 'cut-03',
    cutNumber: '03',
    title: 'GRAVITY HAMMER',
    genreTag: 'GROOVE METAL // TEXAS SWING',
    category: 'groove',
    description: 'Thick down-tuned half-time swinging chugs reminiscent of Kublai Khan TX. Relentless swinging momentum and bone-snapping snare hits.',
    bpm: 92,
    tuning: 'DROP A',
    durationFormatted: '03:18',
    durationSeconds: 198,
    breakdownTimestamp: '02:30',
    breakdownSeconds: 150,
    stencilQuote: '"SWING FROM THE HIPS. DROP THE HAMMER."',
    vocalSpit: "BAR 48 // VOCAL SPIT: ROCCO 'ANVIL' V.",
    lyrics: `[VERSE]
Swing heavy like a wrecking ball
Weight of the world against the brick wall
Feel the gravity, feel the strain
Swing through the fire, swing through the pain!

[HEAVY SLAM]
HAMMER DROPS. EARTH SHAKES.
THIS IS WHAT RESOLVE MAKES.`,
    lyriaPrompt: 'Heavy groove metal beatdown track with Texas swing feel, 92 BPM, low Drop-A chugs, massive swinging half-time groove, thunderous bass drops, aggressive rhythmic barking vocals reminiscent of Texas metalcore.',
    rigTelemetry: 'BARITONE DROP A // AMPEG SVT SUB-BASS // CRUSH'
  },
  {
    id: 'cut-04',
    cutNumber: '04',
    title: 'FRACTURED AXIS',
    genreTag: 'DJENT // 8-STRING POLYRHYTHM',
    category: 'djent',
    description: 'Syncopated dissonance and Meshuggah-weight percussive breakdowns over odd-meter polyrhythmic drum patterns.',
    bpm: 110,
    tuning: 'DROP E1',
    durationFormatted: '04:12',
    durationSeconds: 252,
    breakdownTimestamp: '03:15',
    breakdownSeconds: 195,
    stencilQuote: '"TIME SIGNATURE: 27/16 // SYNCOPATED DISSONANCE"',
    vocalSpit: "BAR 88 // VOCAL SPIT: ROCCO 'ANVIL' V.",
    lyrics: `[POLYRHYTHM]
Fractured axis, shifting time
Order shattered, rhythm prime
Count the fractures in the glass
Nothing unbroken comes to pass!`,
    lyriaPrompt: 'Complex 8-string djent modern metal, odd-meter syncopated polyrhythms, Drop E1 low bass thumps, mechanical precision drumming, dissonant ambient leads over massive percussive guitar chugs.',
    rigTelemetry: '8-STRING FAN FRET // QUAD CORTEX DJENT PROFILE // DROP E1'
  },
  {
    id: 'cut-anthem',
    cutNumber: 'SPECIAL CUT // MOTIVATIONAL ANTHEM',
    title: 'UNBROKEN IRON // RISE FROM THE FLAME',
    genreTag: 'UPLIFTING HARDCORE ANTHEM',
    category: 'anthem',
    description: 'A powerful motivational anthem with driving beats, triumphant soaring riffs, and an uplifting chorus about relentless perseverance and claiming victory.',
    bpm: 130,
    tuning: 'DROP D',
    durationFormatted: '03:30',
    durationSeconds: 210,
    breakdownTimestamp: '02:20',
    breakdownSeconds: 140,
    stencilQuote: '"SCARS ARE PROOF WE FOUGHT AND SURVIVED. WE NEVER STOP."',
    vocalSpit: "BAR 32 // DUAL VOCAL COMMAND",
    lyrics: `[VERSE 1]
Every door that slammed in our faces
Every storm in forgotten places
They counted us out before we could start
They never measured the fire in our heart!

[PRE-CHORUS]
Heavy the road, but we carry the load
Step by step, we broke every mold!

[CHORUS - UPLIFTING & POWERFUL]
WE ARE UNBROKEN! WE ARE UNBOWED!
ROARING LIKE THUNDER OUT OF THE CLOUD!
THROUGH EVERY TRIAL, THROUGH EVERY BLOW
WATCH HOW THE STEEL BEGINS TO GLOW!
WE WILL STAND! WE WILL RISE!
VICTORY WRITTEN IN OUR EYES!

[BRIDGE - DRIVING BEAT]
No surrender, no retreat
Turn the pavement beneath our feet
Into a ladder to reach the sky
Hear the battle cry!`,
    lyriaPrompt: 'Motivational modern rock and hardcore anthem with powerful driving beat at 130 BPM, triumphant uplifting chorus with soaring distorted guitars, energetic drums, and passionate vocals singing about perseverance and achieving goals.',
    rigTelemetry: 'OVERDRIVEN TUBE STACK // HARMONIC TRIUMPH // 130 BPM DRIVING'
  }
];

export const TOUR_DATES: TourDate[] = [
  {
    id: 'gig-nyc',
    cityCode: 'NYC // METRO AREA',
    citySubtitle: 'HOMECOMING',
    venue: 'BROOKLYN MONARCH',
    location: 'BROOKLYN, NEW YORK, US',
    region: 'na',
    dateFormatted: 'MAY 17',
    moshLevel: 'LEVEL 5 MOSH',
    badge: 'HOMECOMING',
    tags: ['BRONX BEATDOWN', 'HARDCORE', 'FEAT. CONVULSE'],
    statusText: 'PIT PASS ACTIVE // ONLY 14 LEFT',
    actionText: 'PIT PASS',
    actionType: 'pit-pass',
    statusColor: 'text-[#ffc703]',
    doors: 'DOORS 18:00 EST'
  },
  {
    id: 'gig-lon',
    cityCode: 'LON // UK RAMPAGE',
    citySubtitle: 'MAIN STAGE',
    venue: 'ELECTRIC BALLROOM',
    location: 'CAMDEN, LONDON, UK',
    region: 'europe',
    dateFormatted: 'MAY 22',
    tags: ['GROOVE METAL', 'BEATDOWN', 'GRINDCORE'],
    statusText: 'SOLD OUT - RESALE ONLY',
    actionText: 'WAITLIST',
    actionType: 'waitlist',
    statusColor: 'text-[#ffb4ab]',
    doors: 'DOORS 18:30 GMT',
    isSoldOut: true
  },
  {
    id: 'gig-ber',
    cityCode: 'BER // KREUZBERG VIOLENCE',
    citySubtitle: 'CRUCIAL SHOW',
    venue: 'SO36 KREUZBERG',
    location: 'ORANIENSTR. 190, BERLIN, DE',
    region: 'europe',
    dateFormatted: 'MAY 25',
    moshLevel: 'WALL OF DEATH',
    badge: 'CRUCIAL SHOW',
    tags: ['HARDCORE', 'DJENT', 'SLUDGE'],
    statusText: 'LOW TICKETS // 28 LEFT',
    actionText: 'SECURE WRISTBAND',
    actionType: 'secure',
    statusColor: 'text-[#ff562f]',
    doors: 'DOORS 19:00 CEST'
  },
  {
    id: 'gig-lei',
    cityCode: 'LEI // SQUAT RESISTANCE',
    citySubtitle: 'ALL AGES',
    venue: 'CONNE ISLAND',
    location: 'CONNEWITZ, LEIPZIG, DE',
    region: 'europe',
    dateFormatted: 'MAY 28',
    tags: ['HARDCORE PUNK', 'DIY ETHOS'],
    statusText: 'DOOR TIX ONLY',
    actionText: 'RSVP SPOT',
    actionType: 'rsvp',
    statusColor: 'text-[#ffc703]',
    doors: 'DOORS 18:00 CEST'
  },
  {
    id: 'gig-tyo',
    cityCode: 'TYO // PACIFIC CRUSH',
    citySubtitle: 'TOKYO EXCLUSIVE',
    venue: 'CLUB CITTA',
    location: 'KAWASAKI, TOKYO, JP',
    region: 'apac',
    dateFormatted: 'JUNE 09',
    moshLevel: 'STAGE DIVES PERMITTED',
    badge: 'TOKYO EXCLUSIVE',
    tags: ['BEATDOWN', 'GROOVE METAL', 'GRINDCORE'],
    statusText: 'PIT PASS ACTIVE',
    actionText: 'SECURE WRISTBAND',
    actionType: 'secure',
    statusColor: 'text-[#ff562f]',
    doors: 'DOORS 17:30 JST'
  },
  {
    id: 'gig-sao',
    cityCode: 'SAO // DESTRUCTION SOUTH',
    citySubtitle: 'DOORS 19:00 BRT',
    venue: 'CARIOCA CLUB',
    location: 'PINHEIROS, SÃO PAULO, BR',
    region: 'latam',
    dateFormatted: 'JUNE 21',
    tags: ['BRUTAL BEATDOWN', 'HARDCORE'],
    statusText: 'SOLD OUT - RESALE ONLY',
    actionText: 'WAITLIST',
    actionType: 'waitlist',
    statusColor: 'text-[#ffb4ab]',
    doors: 'DOORS 19:00 BRT',
    isSoldOut: true
  }
];

export const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'merch-tee',
    lot: 'LOT #01 // ENZYME WASH',
    title: "'IT FKN MATTERS' Heavyweight Boxy Tee",
    subtitle: 'TOUR APPAREL 2025',
    price: 45,
    description: 'Vintage enzyme wash, barbed wire sleeve prints, back tour 16-country print. 280 GSM indestructible ring-spun cotton.',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL [SOLD OUT]'],
    badge: 'LOT #01 // ENZYME WASH',
    badgeType: 'lot',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUhFHoFqHjYV1CNwhVSGKcixBZ_LzyxzBdY7_9Vdi8W9MbbKFWj2UexiGFztqio4PhP5yy1CP2ucYorUFTk_r1xr6IeAM1QlVL0WyHGhiGEMQGuDI1_k9SOUwNVRVAgDuadtLfzNicqr_bGnubLS2NdIRgvVcXd__ZqbPyovOQGpbv94yHlT-OQhTn-br7EVNOMRxhUC3FYA_TEWUTcG-KoeNAtKj63PniI_pE2qkQe3z_1OEKZD9w6g',
    category: 'apparel'
  },
  {
    id: 'merch-hoodie',
    lot: 'LIMITED RUN // 350 PIECES',
    title: "'PUNKS WATCH THEM STAY' Heavy Pullover Hoodie",
    subtitle: 'CHAMPION REVERSE WEAVE',
    price: 85,
    description: 'Embroidered barbed aLTROIS chest badge, vibrant blood-orange thermal hood lining, twin-needle durable construction for cold city trenches.',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    badge: 'LIMITED RUN // 350 PIECES',
    badgeType: 'limited',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOzd-Nlg9pcYMW0O_gkAcvUuZBFqe4xtloSfGtFNw_DZrbajXNVWmYqtP2y07I03nwJafSr0t5qK-4p6JY3KC0_0b2-VSL6iBZ01lQE9A_Q00azU1mkIKjOlSTAM1z4saxIEwyBfoBpZEKedT7xuBW5XO_7K6SDaaCAC7rHhiEYMKPXMijxsnMWQSoi5oaeCQp1QQdCxntCeCmBYfAcLVP4P7KJzdt7eNX4M2OgJ8fi7bBEfVL1PjbJw',
    category: 'apparel'
  },
  {
    id: 'merch-vinyl',
    lot: 'STRICT LIMIT: 500 COPIES',
    title: "'16 COUNTRIES TOUR' Splatter Vinyl 12\" LP",
    subtitle: 'HARDCORE ARCHIVE // AUDIOPHILE PRESS',
    price: 38,
    description: 'Pressed on concrete ash & blood red splatter. Hand-numbered gatefold jackets with 24-page archival tour photo-zine stamped with Bronx seal.',
    sizes: ['ONE SIZE // 12" GATEFOLD'],
    badge: 'STRICT LIMIT: 500 COPIES',
    badgeType: 'limit',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACV2E7JXuVBgDa2FGzv1vOhO23j1ZC7gOy0ZFHp5PtqnANYlogbtuu8UqJ0-nWtlfAM4AS2q-A0feg1f5Jwt7KB-9jWAgM-0oHNNEbNpFivRp-34sRUJ27dHf7golwZAsmV1kRfb1r911lGFDqvVhtE0BsuIE7BfXyASahearyOQH_pNTf9BjS8mKgitWMizKxWPjpfI1ksqGe_yz3WbmgIMr1bNZjiKuFwSbQQN2e1SOpWJNZ0xG3-A',
    category: 'wax',
    stockStatus: '142 / 500 REMAINING'
  },
  {
    id: 'merch-pass',
    lot: 'UPGRADE PASSPORT // NON-TRANSFERABLE',
    title: 'PIT PASS // ALL-ACCESS WRISTBAND',
    subtitle: 'MAX LEVEL ADMISSION // SECURITY ENCRYPTED',
    price: 65,
    description: 'Direct entry passport to the floor. Hard woven serialized band with RFID chip lock.',
    sizes: ['UNIVERSAL METALLIC SLIDER'],
    badge: 'MAX LEVEL ADMISSION',
    badgeType: 'vip',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeZ8qiU99mRWiu240CsZsb4F-5G9LYn7E_bhlFtWpcwDboVSrdx2Qw-uMmW1WH_nGdugdoYU6RmSV_VwCpNT11Cb9UAc2y2sO8v3ClbY8d3VLaBzPWCH9Byt_Tfe3owEfbyY3bmGkiDvRN4dDm9WWJwErhj8RPHo-asratp55wuxTFDOgXLfIwI1byjMqCibrFcfgbk2dfCzlZzI3GAihscv3Ydk5sSnNv2VogpAbuxtGNiQqlWrl9NQ',
    category: 'passes',
    checklist: [
      'Early barricade & soundcheck pit perimeter access',
      'Heavy serialized laminated commemorative badge',
      'Priority fast-track merch lane at venue entrance'
    ]
  },
  {
    id: 'merch-pins',
    lot: 'SOLID ZINC ALLOY',
    title: "'BRONX HARDCORE' Knuckle Ring Heavy Duty Enamel Pin Set",
    subtitle: 'HARDWARE ACCESSORIES',
    price: 20,
    description: 'Set of 4 double-clutched heavy enamel pins. Cast in aged gunmetal and blood red. Back-stamped with individual tour authentication numbers.',
    sizes: ['4-PIECE COLLECTOR BOX'],
    badge: 'SOLID ZINC ALLOY',
    badgeType: 'alloy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASWfl4sqfKVNA-QYG82yYzcNVTD9iDdgGIW8WnCzkYjZmq6F5NDQdi6F9r2R88T2ZDPshgsgkG5K8SskO-v1E0FjxLcDoAfaAxmAPloAq1gWK0MMd3B5CVGhOLCOGVLDfOKbPHs6xjcm3aD21hIIgbPzpfTGm_qu1-HLEjhJoG7T8Lp-Bd5lWXyJYKAhC0D4yvW3vWFFj2v-A17-u5ufMFNpSnDdoMw1CIIJOiMVlA-7SoeiVMUlezmA',
    category: 'hardware'
  }
];

export const CREW_MEMBERS: CrewMember[] = [
  {
    unitId: 'UNIT 01',
    name: 'ROCCO "ANVIL" V.',
    role: 'VOCAL COMMAND // FRONTMAN',
    specialty: 'Bronx street bark, guttural sub-octave low slams, unhinged physical crowd control, zero mic stand policy.',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo3-I-n7wLE-vYNA_jXfD0Fj-ltsnZ_0CEDucF3bxJezRVZ9Hgse749KydCYF9UAwp8gzprY4aBDWc9FR4_snbeLphJw_-i3yodxgstbFx-9o6V71X7eALoykKzJRZ8PBVfl8iSXI79OdpQFYPj8ayLTuYNqQXRTgY_SVly40dkzy5l-oF-iLK5X5gTueZ1Iya41oIkYY77fmEImgBucrJaPlknYe-hUOuh4hg6LAyVnJ4BQU5TW8FFQ'
  },
  {
    unitId: 'UNIT 02',
    name: 'MALIK VANCE',
    role: 'LEAD WARHEAD // GUITAR',
    specialty: '8-String Drop-F chugs, dissonant groove squeals, abrasive high-feedback panic chords, rhythmic blunt-force trauma.',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUhFHoFqHjYV1CNwhVSGKcixBZ_LzyxzBdY7_9Vdi8W9MbbKFWj2UexiGFztqio4PhP5yy1CP2ucYorUFTk_r1xr6IeAM1QlVL0WyHGhiGEMQGuDI1_k9SOUwNVRVAgDuadtLfzNicqr_bGnubLS2NdIRgvVcXd__ZqbPyovOQGpbv94yHlT-OQhTn-br7EVNOMRxhUC3FYA_TEWUTcG-KoeNAtKj63PniI_pE2qkQe3z_1OEKZD9w6g'
  },
  {
    unitId: 'UNIT 03',
    name: 'HECTOR "THUD" REYES',
    role: 'SEISMIC FREQUENCY // BASS',
    specialty: 'Overdriven subterranean clank pushed through dual Ampeg SVT full rigs, punishing mid-range attack, ribcage reverberation.',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOzd-Nlg9pcYMW0O_gkAcvUuZBFqe4xtloSfGtFNw_DZrbajXNVWmYqtP2y07I03nwJafSr0t5qK-4p6JY3KC0_0b2-VSL6iBZ01lQE9A_Q00azU1mkIKjOlSTAM1z4saxIEwyBfoBpZEKedT7xuBW5XO_7K6SDaaCAC7rHhiEYMKPXMijxsnMWQSoi5oaeCQp1QQdCxntCeCmBYfAcLVP4P7KJzdt7eNX4M2OgJ8fi7bBEfVL1PjbJw'
  },
  {
    unitId: 'UNIT 04',
    name: 'DANTE CRUZ',
    role: 'KINETIC ENGINE // DRUMS',
    specialty: '280 BPM grind blast beats transitioning abruptly into swinging Texas two-step beats and ungodly halftime breakdown slugs.',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACV2E7JXuVBgDa2FGzv1vOhO23j1ZC7gOy0ZFHp5PtqnANYlogbtuu8UqJ0-nWtlfAM4AS2q-A0feg1f5Jwt7KB-9jWAgM-0oHNNEbNpFivRp-34sRUJ27dHf7golwZAsmV1kRfb1r911lGFDqvVhtE0BsuIE7BfXyASahearyOQH_pNTf9BjS8mKgitWMizKxWPjpfI1ksqGe_yz3WbmgIMr1bNZjiKuFwSbQQN2e1SOpWJNZ0xG3-A'
  }
];

export const PIT_RULES: PitRule[] = [
  {
    article: 'ARTICLE 01 // STAGE ACCESS',
    title: 'STAGE DIVES SANCTIONED',
    level: 'SANCTIONED',
    content: 'Stage dives welcome. Climb up, give back the mic, fly off. No lingering for phone selfies. Zero hesitation or get thrown off.'
  },
  {
    article: 'ARTICLE 02 // CASUALTY CODE',
    title: 'PROTECT THE FALLEN',
    level: 'VITAL LAW',
    content: 'If someone hits the floor in the cyclone, three bodies immediately shield them until they are vertical. Hardcore is community, not cowardice.'
  },
  {
    article: 'ARTICLE 03 // BARRICADES',
    title: 'NO CORPORATE SECURITY',
    level: 'ABSOLUTE',
    content: 'No corporate security intervention. We police our own pits. Overzealous venue bouncers putting hands on kids will be confronted by the band immediately from the stage.'
  }
];
