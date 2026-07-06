export const DATA_LAST_REVIEWED = "2026-07-06";

export const DATA_SOURCES = [
  {
    name: "FIFA World Cup 2026 official tournament hub",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
    usedFor: "Host city and tournament context"
  },
  {
    name: "FIFA host cities media release",
    url: "https://inside.fifa.com/media-releases/fifa-world-cup-2026-host-cities",
    usedFor: "Host city list cross-check"
  },
  {
    name: "Wikidata and venue public pages",
    url: "https://www.wikidata.org/",
    usedFor: "Approximate coordinates, capacities, and venue metadata"
  },
  {
    name: "OpenStreetMap public transit context",
    url: "https://www.openstreetmap.org/",
    usedFor: "Transit-mode planning assumptions around venues"
  }
];

export const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "es", label: "Spanish" },
  { id: "fr", label: "French" }
];

export const ROLES = [
  { id: "fan", label: "Fan" },
  { id: "volunteer", label: "Volunteer" },
  { id: "organizer", label: "Organizer" },
  { id: "venue-staff", label: "Venue staff" }
];

export const SCENARIOS = [
  {
    id: "baseline",
    label: "Live baseline",
    summary: "Normal matchday movement with expected pre-match waves.",
    modifiers: { queue: 0, density: 0, transit: 0, heat: 0, incidents: 0, waste: 0, accessibility: 0 }
  },
  {
    id: "ingress-rush",
    label: "Ingress rush",
    summary: "Late-arriving fans compress near the primary gate line.",
    modifiers: { queue: 18, density: 18, transit: 12, heat: 0, incidents: 1, waste: 6, accessibility: 6 }
  },
  {
    id: "transit-delay",
    label: "Transit delay",
    summary: "Rail or shuttle disruption increases curbside pressure.",
    modifiers: { queue: 8, density: 10, transit: 30, heat: 0, incidents: 1, waste: 3, accessibility: 8 }
  },
  {
    id: "heat-advisory",
    label: "Heat advisory",
    summary: "High heat index drives water, shade, and medical demand.",
    modifiers: { queue: 5, density: 8, transit: 5, heat: 22, incidents: 2, waste: 8, accessibility: 10 }
  },
  {
    id: "accessibility-surge",
    label: "Accessibility surge",
    summary: "Accessible shuttle and elevator demand rises before kickoff.",
    modifiers: { queue: 7, density: 7, transit: 9, heat: 2, incidents: 0, waste: 2, accessibility: 28 }
  },
  {
    id: "weather-hold",
    label: "Weather hold",
    summary: "Lightning or severe rain hold keeps fans in protected areas.",
    modifiers: { queue: 12, density: 25, transit: 18, heat: -4, incidents: 2, waste: 8, accessibility: 12 }
  },
  {
    id: "waste-overflow",
    label: "Waste overflow",
    summary: "Concession peak creates recycling and compost overflow risk.",
    modifiers: { queue: 4, density: 8, transit: 2, heat: 0, incidents: 0, waste: 30, accessibility: 2 }
  }
];

export const VENUES = [
  {
    id: "atlanta",
    city: "Atlanta",
    country: "United States",
    venueName: "Mercedes-Benz Stadium",
    fifaName: "Atlanta Stadium",
    capacity: 75000,
    timezone: "America/New_York",
    coordinates: { lat: 33.7553, lng: -84.4006 },
    pin: { x: 67, y: 59 },
    languages: ["en", "es"],
    transitModes: ["MARTA rail", "ride share", "event shuttle", "walking loop"],
    accessibility: ["step-free MARTA transfer", "low-sensory room", "accessible entry lanes", "caption boards"],
    sustainability: ["reusable cup return", "food donation staging", "LED venue operations", "compost sorting"],
    operations: {
      primaryIngress: "North Plaza",
      secondaryIngress: "International Boulevard",
      accessibleEntry: "Gate 2 accessible lane",
      transitHub: "GWCC/CNN Center station",
      medical: "Section 116 first aid",
      commandFocus: ["separate rail arrivals from ride-share flows", "protect pedestrian crossings near Northside Drive"],
      chokePoints: ["North Plaza turnstiles", "CNN Center bridge", "ride-share curb"]
    }
  },
  {
    id: "boston",
    city: "Boston",
    country: "United States",
    venueName: "Gillette Stadium",
    fifaName: "Boston Stadium",
    capacity: 65878,
    timezone: "America/New_York",
    coordinates: { lat: 42.0909, lng: -71.2643 },
    pin: { x: 82, y: 37 },
    languages: ["en", "es", "fr"],
    transitModes: ["commuter rail", "regional coach", "event shuttle", "parking tram"],
    accessibility: ["accessible parking tram", "drop-off zone", "assistive listening", "wheelchair seating"],
    sustainability: ["regional shuttle priority", "water refill tents", "recycling captains", "digital ticketing"],
    operations: {
      primaryIngress: "Patriot Place north walk",
      secondaryIngress: "South retail walk",
      accessibleEntry: "Bank of America Gate accessible check",
      transitHub: "Foxboro event rail platform",
      medical: "East concourse first aid",
      commandFocus: ["stage rail queues before full-time", "keep retail district walkways clear"],
      chokePoints: ["Patriot Place crossings", "north security plaza", "coach loading area"]
    }
  },
  {
    id: "dallas",
    city: "Dallas",
    country: "United States",
    venueName: "AT&T Stadium",
    fifaName: "Dallas Stadium",
    capacity: 94000,
    timezone: "America/Chicago",
    coordinates: { lat: 32.7473, lng: -97.0945 },
    pin: { x: 49, y: 62 },
    languages: ["en", "es"],
    transitModes: ["event shuttle", "ride share", "regional bus", "parking tram"],
    accessibility: ["accessible shuttle loop", "ADA drop-off", "elevator marshals", "visual paging"],
    sustainability: ["high-volume recycling", "shuttle-first messaging", "hydration refill", "back-of-house waste audit"],
    operations: {
      primaryIngress: "AT&T Way plaza",
      secondaryIngress: "Collins Street approach",
      accessibleEntry: "Entry A accessible lane",
      transitHub: "Arlington event shuttle hub",
      medical: "Main concourse medical bay",
      commandFocus: ["balance rideshare and shuttle arrivals", "meter entry at the largest plaza"],
      chokePoints: ["AT&T Way plaza", "Entry A bag check", "south parking tram stop"]
    }
  },
  {
    id: "guadalajara",
    city: "Guadalajara",
    country: "Mexico",
    venueName: "Estadio Akron",
    fifaName: "Guadalajara Stadium",
    capacity: 46232,
    timezone: "America/Mexico_City",
    coordinates: { lat: 20.6817, lng: -103.4626 },
    pin: { x: 44, y: 77 },
    languages: ["es", "en"],
    transitModes: ["Mi Macro bus", "event shuttle", "ride share", "pedestrian corridor"],
    accessibility: ["accessible shuttle", "priority lanes", "audio assistance desk", "wheelchair viewing"],
    sustainability: ["solar operations story", "recycling points", "local bus nudges", "food recovery"],
    operations: {
      primaryIngress: "Periferico plaza",
      secondaryIngress: "Avenida del Bosque approach",
      accessibleEntry: "Gate 3 priority lane",
      transitHub: "Periferico shuttle stop",
      medical: "Lower bowl medical post",
      commandFocus: ["translate all routing updates in Spanish first", "protect bus approaches from ride-share spillover"],
      chokePoints: ["Periferico crossing", "Gate 3", "west security fan-out"]
    }
  },
  {
    id: "houston",
    city: "Houston",
    country: "United States",
    venueName: "NRG Stadium",
    fifaName: "Houston Stadium",
    capacity: 72220,
    timezone: "America/Chicago",
    coordinates: { lat: 29.6847, lng: -95.4107 },
    pin: { x: 53, y: 69 },
    languages: ["en", "es"],
    transitModes: ["METRORail", "event shuttle", "ride share", "parking tram"],
    accessibility: ["rail step-free path", "ADA drop-off", "cooling room", "caption boards"],
    sustainability: ["rail-first prompts", "water refill", "recycling ambassadors", "shade tent placement"],
    operations: {
      primaryIngress: "Kirby Drive plaza",
      secondaryIngress: "Fannin Street rail approach",
      accessibleEntry: "Amegy Gate accessible lane",
      transitHub: "Stadium Park/Astrodome station",
      medical: "West concourse first aid",
      commandFocus: ["monitor heat stress", "keep rail entries separated from parking flows"],
      chokePoints: ["Kirby Drive crosswalks", "rail station stairs", "Amegy Gate bag check"]
    }
  },
  {
    id: "kansas-city",
    city: "Kansas City",
    country: "United States",
    venueName: "Arrowhead Stadium",
    fifaName: "Kansas City Stadium",
    capacity: 76416,
    timezone: "America/Chicago",
    coordinates: { lat: 39.0489, lng: -94.4839 },
    pin: { x: 55, y: 50 },
    languages: ["en", "es"],
    transitModes: ["event bus", "parking tram", "ride share", "pedestrian loop"],
    accessibility: ["ADA parking loop", "accessible gates", "elevator attendants", "sensory kits"],
    sustainability: ["tailgate waste zones", "recycling bag handout", "shuttle priority", "water refill carts"],
    operations: {
      primaryIngress: "Founder's Plaza",
      secondaryIngress: "Lancer Lane approach",
      accessibleEntry: "Gate 4 accessible lane",
      transitHub: "Truman Sports Complex shuttle hub",
      medical: "Field level first aid",
      commandFocus: ["control tailgate-to-turnstile surges", "pre-stage post-match parking exits"],
      chokePoints: ["Founder's Plaza", "parking lot tram stop", "Gate 4 elevators"]
    }
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    country: "United States",
    venueName: "SoFi Stadium",
    fifaName: "Los Angeles Stadium",
    capacity: 70240,
    timezone: "America/Los_Angeles",
    coordinates: { lat: 33.9535, lng: -118.3392 },
    pin: { x: 23, y: 67 },
    languages: ["en", "es"],
    transitModes: ["event shuttle", "Metro connector", "ride share", "walking district"],
    accessibility: ["ADA shuttle", "accessible rideshare", "sensory room", "caption boards"],
    sustainability: ["shuttle-first campaign", "cool roof awareness", "water refill", "zero-waste sorting"],
    operations: {
      primaryIngress: "Lake Park plaza",
      secondaryIngress: "Hollywood Park walk",
      accessibleEntry: "Entry 5 accessible lane",
      transitHub: "Metro shuttle hub",
      medical: "Level 3 medical room",
      commandFocus: ["protect shuttle transfer times", "separate rideshare from walking district"],
      chokePoints: ["Lake Park bridge", "Entry 5 security", "ride-share zone"]
    }
  },
  {
    id: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    venueName: "Estadio Azteca",
    fifaName: "Mexico City Stadium",
    capacity: 83000,
    timezone: "America/Mexico_City",
    coordinates: { lat: 19.3029, lng: -99.1505 },
    pin: { x: 49, y: 82 },
    languages: ["es", "en", "fr"],
    transitModes: ["Tren Ligero", "Metro connector", "event shuttle", "walking corridor"],
    accessibility: ["priority access lanes", "accessible shuttle", "audio desk", "wheelchair terraces"],
    sustainability: ["rail-first announcements", "reusable bottle checks", "food recovery", "sorting stations"],
    operations: {
      primaryIngress: "Calzada de Tlalpan approach",
      secondaryIngress: "Santa Ursula walk",
      accessibleEntry: "Gate 6 priority lane",
      transitHub: "Estadio Azteca light rail station",
      medical: "Gate 1 first aid",
      commandFocus: ["keep light rail exits moving", "broadcast Spanish and English updates together"],
      chokePoints: ["light rail bridge", "Gate 6", "Tlalpan crosswalks"]
    }
  },
  {
    id: "miami",
    city: "Miami",
    country: "United States",
    venueName: "Hard Rock Stadium",
    fifaName: "Miami Stadium",
    capacity: 65326,
    timezone: "America/New_York",
    coordinates: { lat: 25.958, lng: -80.2389 },
    pin: { x: 71, y: 76 },
    languages: ["en", "es", "fr"],
    transitModes: ["event shuttle", "regional rail connector", "ride share", "parking tram"],
    accessibility: ["accessible tram", "ADA drop-off", "cooling area", "caption boards"],
    sustainability: ["shade messaging", "water refill", "recycling staff", "transit bundling"],
    operations: {
      primaryIngress: "NW 199th Street plaza",
      secondaryIngress: "South parking approach",
      accessibleEntry: "Gate C accessible lane",
      transitHub: "Golden Glades shuttle hub",
      medical: "Gate D medical post",
      commandFocus: ["monitor heat and storm windows", "stage post-match shuttle boarding"],
      chokePoints: ["Gate C bag check", "NW 199th Street crossing", "shuttle boarding pens"]
    }
  },
  {
    id: "monterrey",
    city: "Monterrey",
    country: "Mexico",
    venueName: "Estadio BBVA",
    fifaName: "Monterrey Stadium",
    capacity: 53500,
    timezone: "America/Monterrey",
    coordinates: { lat: 25.6689, lng: -100.2444 },
    pin: { x: 49, y: 74 },
    languages: ["es", "en"],
    transitModes: ["Metrorrey connector", "event shuttle", "ride share", "pedestrian park route"],
    accessibility: ["priority gate", "accessible shuttle", "quiet room", "caption boards"],
    sustainability: ["park-and-ride prompts", "waste sorting", "water refill", "local food donation"],
    operations: {
      primaryIngress: "La Pastora park walk",
      secondaryIngress: "Avenida Pablo Livas approach",
      accessibleEntry: "Gate 4 priority lane",
      transitHub: "Expo shuttle connector",
      medical: "Upper concourse medical",
      commandFocus: ["route fans through shaded park paths", "protect accessible shuttle timing"],
      chokePoints: ["La Pastora bridge", "Gate 4", "ride-share curb"]
    }
  },
  {
    id: "new-york-new-jersey",
    city: "New York New Jersey",
    country: "United States",
    venueName: "MetLife Stadium",
    fifaName: "New York New Jersey Stadium",
    capacity: 82500,
    timezone: "America/New_York",
    coordinates: { lat: 40.8135, lng: -74.0745 },
    pin: { x: 80, y: 40 },
    languages: ["en", "es", "fr"],
    transitModes: ["NJ Transit rail", "coach bus", "event shuttle", "ride share"],
    accessibility: ["step-free shuttle path", "ADA drop-off", "assistive listening", "elevator dispatch"],
    sustainability: ["rail-first messaging", "compost teams", "recycling gates", "water refill"],
    operations: {
      primaryIngress: "MetLife Gate plaza",
      secondaryIngress: "Lot G approach",
      accessibleEntry: "Pepsi Gate accessible lane",
      transitHub: "Meadowlands rail station",
      medical: "HCLTech Gate first aid",
      commandFocus: ["protect final-day egress capacity", "keep rail station queue in managed lanes"],
      chokePoints: ["Meadowlands rail bridge", "MetLife Gate turnstiles", "Lot G bus loading"]
    }
  },
  {
    id: "philadelphia",
    city: "Philadelphia",
    country: "United States",
    venueName: "Lincoln Financial Field",
    fifaName: "Philadelphia Stadium",
    capacity: 69596,
    timezone: "America/New_York",
    coordinates: { lat: 39.9008, lng: -75.1675 },
    pin: { x: 78, y: 45 },
    languages: ["en", "es"],
    transitModes: ["SEPTA subway", "regional rail connector", "ride share", "walking loop"],
    accessibility: ["step-free subway connector", "ADA drop-off", "caption boards", "wheelchair seating"],
    sustainability: ["subway-first prompt", "solar venue story", "compost stations", "water refill"],
    operations: {
      primaryIngress: "Pattison Avenue plaza",
      secondaryIngress: "11th Street walk",
      accessibleEntry: "LifeBrand Gate accessible lane",
      transitHub: "NRG Station",
      medical: "Pepsi Plaza first aid",
      commandFocus: ["hold subway crowd in waves after full-time", "keep sports complex crossings open"],
      chokePoints: ["NRG Station stairs", "Pattison Avenue plaza", "LifeBrand Gate"]
    }
  },
  {
    id: "san-francisco-bay-area",
    city: "San Francisco Bay Area",
    country: "United States",
    venueName: "Levi's Stadium",
    fifaName: "San Francisco Bay Area Stadium",
    capacity: 70909,
    timezone: "America/Los_Angeles",
    coordinates: { lat: 37.403, lng: -121.97 },
    pin: { x: 18, y: 57 },
    languages: ["en", "es"],
    transitModes: ["VTA light rail", "regional rail connector", "bike valet", "ride share"],
    accessibility: ["light rail step-free path", "ADA shuttles", "sensory room", "caption boards"],
    sustainability: ["transit and bike prompts", "water reuse story", "sorting ambassadors", "solar monitoring"],
    operations: {
      primaryIngress: "Intel Gate plaza",
      secondaryIngress: "Tasman Drive approach",
      accessibleEntry: "Toyota Gate accessible lane",
      transitHub: "Great America light rail station",
      medical: "Main concourse medical room",
      commandFocus: ["separate light rail and bike valet paths", "manage sun-exposed queues"],
      chokePoints: ["Tasman Drive crosswalk", "Intel Gate", "light rail platform"]
    }
  },
  {
    id: "seattle",
    city: "Seattle",
    country: "United States",
    venueName: "Lumen Field",
    fifaName: "Seattle Stadium",
    capacity: 69000,
    timezone: "America/Los_Angeles",
    coordinates: { lat: 47.5952, lng: -122.3316 },
    pin: { x: 19, y: 36 },
    languages: ["en", "es"],
    transitModes: ["Link light rail", "Sounder train", "ferry connector", "walking district"],
    accessibility: ["step-free light rail", "ADA drop-off", "sensory room", "caption boards"],
    sustainability: ["rail and ferry prompts", "recycling captains", "water refill", "food donation"],
    operations: {
      primaryIngress: "Occidental Avenue approach",
      secondaryIngress: "King Street station walk",
      accessibleEntry: "North Gate accessible lane",
      transitHub: "Stadium light rail station",
      medical: "North concourse first aid",
      commandFocus: ["balance rail and ferry flows", "protect narrow historic district walks"],
      chokePoints: ["Occidental Avenue", "Stadium station bridge", "North Gate bag check"]
    }
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    venueName: "BMO Field",
    fifaName: "Toronto Stadium",
    capacity: 45500,
    timezone: "America/Toronto",
    coordinates: { lat: 43.6332, lng: -79.4186 },
    pin: { x: 66, y: 34 },
    languages: ["en", "fr", "es"],
    transitModes: ["GO Transit", "TTC streetcar", "bike valet", "walking loop"],
    accessibility: ["step-free GO route", "accessible streetcar", "quiet room", "caption boards"],
    sustainability: ["transit-first messaging", "bike valet", "recycling stewards", "water refill"],
    operations: {
      primaryIngress: "Exhibition Place gate",
      secondaryIngress: "Princes' Boulevard approach",
      accessibleEntry: "Gate 3 accessible lane",
      transitHub: "Exhibition GO station",
      medical: "East stand medical post",
      commandFocus: ["coordinate rail and streetcar arrivals", "support bilingual English and French announcements"],
      chokePoints: ["Exhibition GO tunnel", "Gate 3", "Princes' Boulevard"]
    }
  },
  {
    id: "vancouver",
    city: "Vancouver",
    country: "Canada",
    venueName: "BC Place",
    fifaName: "Vancouver Stadium",
    capacity: 54500,
    timezone: "America/Vancouver",
    coordinates: { lat: 49.2768, lng: -123.1119 },
    pin: { x: 20, y: 29 },
    languages: ["en", "fr", "es"],
    transitModes: ["SkyTrain", "regional bus", "bike valet", "walking district"],
    accessibility: ["step-free SkyTrain", "accessible drop-off", "sensory room", "caption boards"],
    sustainability: ["SkyTrain-first prompts", "bike valet", "waste sorting", "water refill"],
    operations: {
      primaryIngress: "Terry Fox Plaza",
      secondaryIngress: "Pacific Boulevard approach",
      accessibleEntry: "Gate C accessible lane",
      transitHub: "Stadium-Chinatown SkyTrain station",
      medical: "Gate H medical room",
      commandFocus: ["keep SkyTrain exits clear", "route fans around downtown event closures"],
      chokePoints: ["Terry Fox Plaza", "SkyTrain stairs", "Pacific Boulevard curb"]
    }
  }
];
