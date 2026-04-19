// app/data/countries.ts

export type CountryOperation = {
  slug: string;
  name: string;
  capital: string;
  region: string;
  flagEmoji: string;
  heroImage: string;
  heroCaption: string;
  tagline: string;
  intro: string;
  operationalSince: string;
  presenceType: string; // "Headquarters" | "Regional Office" | "Partner Network" | "Active Operations"
  contact: {
    office?: string;
    phone: string;
    email: string;
    whatsapp?: string;
  };
  stats: { value: string; label: string }[];
  ecosystems: {
    name: string;
    type: string;
    description: string;
    image: string;
    species: string[];
  }[];
  services: {
    title: string;
    available: boolean;
    notes?: string;
  }[];
  regulations: {
    authority: string;
    acronym: string;
    role: string;
    website?: string;
  }[];
  keySpecies: string[];
  challenges: {
    title: string;
    body: string;
  }[];
  partners: string[];
  quote: {
    text: string;
    attribution: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
};

export const countries: CountryOperation[] = [
  /* ─────────────────────────────────────────────
     TANZANIA  (Headquarters)
  ───────────────────────────────────────────── */
  {
    slug: "tanzania",
    name: "Tanzania",
    capital: "Dodoma",
    region: "East Africa",
    flagEmoji: "🇹🇿",
    heroImage: "/card-placeholder.png",
    heroCaption:
      "The Serengeti-Mara ecosystem — one of the last great wildlife migrations on Earth.",
    tagline: "Where Our Story Began.",
    intro:
      "Tanzania is the heartland of Tanzania Wildlife Trappers. Founded in Arusha in 1994, we have spent three decades building the most comprehensive professional wildlife operations network in the country. Tanzania's extraordinary biodiversity — from the Selous to the Serengeti, Ruaha to Tarangire — demands and deserves the highest standard of wildlife management expertise. This is where we are most deeply rooted, and where we set the standard for everything we do across the region.",
    operationalSince: "1994",
    presenceType: "Headquarters",
    contact: {
      office: "Arusha, Tanzania (Headquarters) · Dar es Salaam (Regional Office)",
      phone: "+255 700 000 000",
      email: "tanzania@tanzaniawildlifetrappers.com",
      whatsapp: "255700000000",
    },
    stats: [
      { value: "30+", label: "Years Operating" },
      { value: "1,200+", label: "Operations Completed" },
      { value: "18", label: "Protected Areas Served" },
      { value: "15+", label: "Vet Partners" },
    ],
    ecosystems: [
      {
        name: "Serengeti – Mara Ecosystem",
        type: "Savanna / Grassland",
        description:
          "The Serengeti is the stage for the world's largest terrestrial wildlife migration — 1.5 million wildebeest, 500,000 zebra, and 300,000 Thomson's gazelle moving in an annual circuit across the Tanzania-Kenya border. It is also home to one of Africa's densest lion populations and a stronghold for cheetah, leopard, and African wild dog.",
        image: "/countries/tz-serengeti.jpg",
        species: [
          "African Lion",
          "Cheetah",
          "African Wild Dog",
          "Plains Zebra",
          "Blue Wildebeest",
          "African Elephant",
        ],
      },
      {
        name: "Selous – Nyerere Ecosystem",
        type: "Miombo Woodland / Riverine Forest",
        description:
          "The Nyerere National Park and surrounding Selous Game Reserve form the largest protected area in Africa. It holds the continent's largest elephant population and the world's most significant wild dog stronghold. TWT has an extensive operational history in the Selous spanning over two decades.",
        image: "/countries/tz-selous.jpg",
        species: [
          "African Elephant",
          "African Wild Dog",
          "Hippopotamus",
          "Nile Crocodile",
          "Buffalo",
          "Sable Antelope",
        ],
      },
      {
        name: "Ruaha – Katavi Ecosystem",
        type: "Miombo / Seasonal Wetlands",
        description:
          "Central Tanzania's great wilderness, Ruaha holds East Africa's largest lion population and critical elephant corridors linking the southern and central highlands. The adjacent Katavi holds one of Africa's most undisturbed hippo and crocodile populations.",
        image: "/countries/tz-ruaha.jpg",
        species: [
          "African Lion",
          "African Elephant",
          "Greater Kudu",
          "Hippopotamus",
          "Roan Antelope",
          "Striped Hyena",
        ],
      },
    ],
    services: [
      { title: "Safe Capture of Wild Animals", available: true },
      { title: "Wild Animal Rescue", available: true },
      { title: "Wildlife Treatment & Care", available: true },
      { title: "Problem Animal Control", available: true },
      { title: "Wildlife Management Support", available: true },
      { title: "Zoo Licensing & Permit Advisory", available: true },
      { title: "Wildlife Handling & Staff Training", available: true },
      { title: "Wildlife Adaptation Training", available: true },
      { title: "Expert Zoo Setup & Advisory", available: true },
    ],
    regulations: [
      {
        authority: "Tanzania Wildlife Management Authority",
        acronym: "TAWA",
        role: "Primary regulatory authority for wildlife conservation and management outside national parks.",
      },
      {
        authority: "Tanzania National Parks",
        acronym: "TANAPA",
        role: "Manages all national parks and regulates wildlife operations within park boundaries.",
      },
      {
        authority: "Tanzania Veterinary Council",
        acronym: "TVC",
        role: "Licenses all veterinary practitioners including wildlife veterinarians.",
      },
      {
        authority: "National Environment Management Council",
        acronym: "NEMC",
        role: "Oversees environmental impact assessment and compliance for operations affecting ecosystems.",
      },
    ],
    keySpecies: [
      "African Elephant",
      "African Lion",
      "Leopard",
      "Cheetah",
      "African Wild Dog",
      "Hippopotamus",
      "Nile Crocodile",
      "Black Rhinoceros",
      "Giraffe",
      "Buffalo",
    ],
    challenges: [
      {
        title: "Human-Wildlife Conflict at Scale",
        body: "Tanzania's human population is growing at approximately 3% annually, and agricultural expansion is pushing deeper into wildlife corridors. Crop raiding by elephants, lion predation on livestock, and hippo encroachment on irrigation systems are now chronic issues across multiple regions — requiring systematic, long-term coexistence strategies rather than one-off interventions.",
      },
      {
        title: "Poaching Pressure on Key Species",
        body: "Despite significant anti-poaching progress, ivory and bushmeat poaching remain serious threats in parts of the Selous and the western corridor. Snare proliferation impacts non-target species including wild dogs, cheetahs, and pangolins. TWT works closely with anti-poaching units on snare removal and human-capacity support.",
      },
      {
        title: "Climate Variability and Drought",
        body: "Increasing climate variability is compressing dry season water sources, intensifying competition between wildlife and livestock, and driving animals into human-occupied areas in search of food and water. This is creating new conflict hotspots in areas that were previously stable.",
      },
    ],
    partners: [
      "Tanzania National Parks (TANAPA)",
      "Tanzania Wildlife Management Authority (TAWA)",
      "Frankfurt Zoological Society",
      "Wildlife Conservation Society – Tanzania",
      "African Wildlife Foundation",
      "Ruaha Carnivore Project",
    ],
    quote: {
      text: "Tanzania holds the largest contiguous block of wildlife habitat in East Africa. Protecting it is not just a conservation imperative — it is a moral one.",
      attribution: "TWT Founding Director",
    },
    seo: {
      metaTitle: "Wildlife Operations in Tanzania | Tanzania Wildlife Trappers",
      metaDescription:
        "Tanzania Wildlife Trappers' home country — 30+ years of professional wildlife capture, rescue, management, and training across Tanzania's greatest ecosystems.",
      keywords: [
        "wildlife operations Tanzania",
        "wildlife capture Tanzania",
        "TAWA licensed operator",
        "wildlife management Tanzania",
        "Serengeti wildlife services",
        "Selous wildlife operations",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     KENYA
  ───────────────────────────────────────────── */
  {
    slug: "kenya",
    name: "Kenya",
    capital: "Nairobi",
    region: "East Africa",
    flagEmoji: "🇰🇪",
    heroImage: "/card-placeholder.png",
    heroCaption:
      "The Maasai Mara — the northern reach of the Serengeti-Mara migration system.",
    tagline: "Where The Migration Crosses.",
    intro:
      "Kenya is TWT's most significant cross-border operational territory. The Serengeti-Mara ecosystem does not respect international boundaries, and neither do the challenges of managing wildlife within it. Our Kenya operations are delivered through a combination of direct deployments from our Tanzania base and a curated network of Kenyan wildlife professionals who work to our standards and protocols. We serve game reserves, conservancies, private landowners, and conservation organisations across the country.",
    operationalSince: "2008",
    presenceType: "Active Operations",
    contact: {
      office: "Nairobi Liaison (by appointment)",
      phone: "+254 700 000 000",
      email: "kenya@tanzaniawildlifetrappers.com",
      whatsapp: "254700000000",
    },
    stats: [
      { value: "15+", label: "Years in Kenya" },
      { value: "200+", label: "Operations Completed" },
      { value: "8", label: "Conservation Areas Served" },
      { value: "100%", label: "KWS Compliance" },
    ],
    ecosystems: [
      {
        name: "Maasai Mara – Serengeti System",
        type: "Savanna / Grassland",
        description:
          "The Mara is where the great migration climaxes — wildebeest and zebra crossing the Mara River in one of nature's most dramatic spectacles. Beyond the migration, the Mara ecosystem sustains extraordinary big cat densities: cheetahs, leopards, and lions at some of Africa's highest recorded concentrations.",
        image: "/countries/ke-mara.jpg",
        species: [
          "African Lion",
          "Cheetah",
          "Leopard",
          "Blue Wildebeest",
          "Plains Zebra",
          "Hippopotamus",
        ],
      },
      {
        name: "Laikipia Plateau",
        type: "Semi-Arid Grassland / Bush",
        description:
          "Laikipia is one of East Africa's most important conservation landscapes — a mosaic of private ranches, community conservancies, and wildlife corridors that supports Kenya's most diverse large mammal assemblage outside national parks. It holds critical populations of endangered African wild dogs, black rhinos, and the only viable northern white rhino population.",
        image: "/countries/ke-laikipia.jpg",
        species: [
          "African Wild Dog",
          "Black Rhinoceros",
          "Grevy's Zebra",
          "Reticulated Giraffe",
          "African Elephant",
          "Beisa Oryx",
        ],
      },
      {
        name: "Tsavo Ecosystem",
        type: "Semi-Arid Savanna / Thorn Scrub",
        description:
          "Kenya's largest protected area complex, Tsavo holds the largest elephant population in the country. Its vast landscape is also home to a significant lion population, red-dusted from the laterite soils, and critical migratory corridors between the coast and the interior.",
        image: "/countries/ke-tsavo.jpg",
        species: [
          "African Elephant",
          "African Lion",
          "Gerenuk",
          "Fringe-eared Oryx",
          "Hirola",
          "Lesser Kudu",
        ],
      },
    ],
    services: [
      { title: "Safe Capture of Wild Animals", available: true },
      { title: "Wild Animal Rescue", available: true },
      { title: "Wildlife Treatment & Care", available: true, notes: "Via KWS-licensed partner veterinarians" },
      { title: "Problem Animal Control", available: true },
      { title: "Wildlife Management Support", available: true },
      {
        title: "Zoo Licensing & Permit Advisory",
        available: true,
        notes: "KWS regulatory framework advisory",
      },
      { title: "Wildlife Handling & Staff Training", available: true },
      { title: "Wildlife Adaptation Training", available: true },
      {
        title: "Expert Zoo Setup & Advisory",
        available: true,
        notes: "Subject to KWS facility approval",
      },
    ],
    regulations: [
      {
        authority: "Kenya Wildlife Service",
        acronym: "KWS",
        role: "Primary authority for wildlife conservation, management, and all wildlife-related permits in Kenya.",
      },
      {
        authority: "Kenya Veterinary Board",
        acronym: "KVB",
        role: "Regulates all veterinary practice including wildlife veterinarians in Kenya.",
      },
      {
        authority: "National Environment Management Authority",
        acronym: "NEMA",
        role: "Environmental regulation, impact assessment, and compliance.",
      },
    ],
    keySpecies: [
      "African Elephant",
      "African Lion",
      "Leopard",
      "Cheetah",
      "African Wild Dog",
      "Black Rhinoceros",
      "Grevy's Zebra",
      "Hirola",
      "Reticulated Giraffe",
      "Hippopotamus",
    ],
    challenges: [
      {
        title: "Human-Wildlife Interface on Private Land",
        body: "Unlike Tanzania, a significant proportion of Kenya's wildlife lives outside formally protected areas on private ranches and community conservancies. This creates complex human-wildlife conflict dynamics on unprotected land, where the legal framework for intervention is different and community tolerance is the primary conservation variable.",
      },
      {
        title: "Drought and Water Stress",
        body: "Kenya's northern and eastern regions experience increasingly severe and frequent drought cycles. Water scarcity drives elephants, lions, and other species into farming communities in search of water and forage, creating dangerous and costly conflict situations that require both immediate response and long-term resilience planning.",
      },
      {
        title: "Conservancy Connectivity",
        body: "Kenya's extraordinary network of private and community conservancies only functions as a landscape-scale conservation system if wildlife can move between them. Fencing, settlement, and road development are fragmenting critical corridors — requiring active management of movement routes and mitigation of barrier effects.",
      },
    ],
    partners: [
      "Kenya Wildlife Service (KWS)",
      "Ol Pejeta Conservancy",
      "Lewa Wildlife Conservancy",
      "African Wildlife Foundation – Kenya",
      "Save the Elephants",
      "Cheetah Conservation Fund – East Africa",
    ],
    quote: {
      text: "Kenya's wildlife heritage is extraordinary. The challenge is keeping it viable as the landscape around it transforms at pace.",
      attribution: "TWT Kenya Operations Lead",
    },
    seo: {
      metaTitle: "Wildlife Operations in Kenya | Tanzania Wildlife Trappers",
      metaDescription:
        "TWT's Kenya operations — professional wildlife capture, rescue, conflict management, and training across the Maasai Mara, Laikipia, Tsavo, and beyond.",
      keywords: [
        "wildlife operations Kenya",
        "wildlife capture Kenya",
        "KWS licensed operator",
        "Maasai Mara wildlife services",
        "Laikipia wildlife management",
        "human wildlife conflict Kenya",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     UGANDA
  ───────────────────────────────────────────── */
  {
    slug: "uganda",
    name: "Uganda",
    capital: "Kampala",
    region: "East Africa",
    flagEmoji: "🇺🇬",
    heroImage: "/card-placeholder.png",
    heroCaption:
      "Bwindi Impenetrable Forest — the last great refuge of the mountain gorilla.",
    tagline: "The Pearl of Africa's Wildlife.",
    intro:
      "Uganda occupies a unique ecological position at the convergence of East African savanna and Central African forest ecosystems. This gives it a wildlife profile unlike any other country in East Africa — combining the primates of the forest interior with the savanna megafauna of the northern and western plains. TWT operates in Uganda through a dedicated partner network, providing specialist wildlife field services that complement the work of Uganda Wildlife Authority and conservation organisations across the country.",
    operationalSince: "2014",
    presenceType: "Partner Network",
    contact: {
      phone: "+256 700 000 000",
      email: "uganda@tanzaniawildlifetrappers.com",
      whatsapp: "256700000000",
    },
    stats: [
      { value: "10+", label: "Years in Uganda" },
      { value: "80+", label: "Operations Completed" },
      { value: "6", label: "Conservation Areas Served" },
      { value: "1,063", label: "Mountain Gorillas Protected" },
    ],
    ecosystems: [
      {
        name: "Bwindi – Mgahinga Gorilla Ecosystem",
        type: "Montane Rainforest",
        description:
          "Bwindi Impenetrable National Park and the adjacent Mgahinga Gorilla National Park together shelter more than half of the world's surviving mountain gorillas — approximately 460 individuals. The landscape also hosts significant populations of forest elephants, chimpanzees, L'Hoest's monkeys, and over 350 bird species. Working in this ecosystem requires specialist primate expertise and strict disease prevention protocols.",
        image: "/countries/ug-bwindi.jpg",
        species: [
          "Mountain Gorilla",
          "Chimpanzee",
          "Forest Elephant",
          "L'Hoest's Monkey",
          "African Golden Cat",
          "Giant Forest Hog",
        ],
      },
      {
        name: "Murchison Falls – Albert Nile System",
        type: "Savanna / Riverine Forest / Wetland",
        description:
          "Uganda's largest national park, Murchison Falls sits at the northern end of the Albertine Rift. The Nile flows through the park, creating a spectacular waterfall and a riverine system that sustains extraordinary concentrations of hippos, Nile crocodiles, and elephants. The northern bank supports Uganda's most significant lion population.",
        image: "/countries/ug-murchison.jpg",
        species: [
          "African Elephant",
          "African Lion",
          "Hippopotamus",
          "Nile Crocodile",
          "Rothschild's Giraffe",
          "Uganda Kob",
        ],
      },
      {
        name: "Queen Elizabeth – Virunga System",
        type: "Savanna / Wetland / Forest Edge",
        description:
          "Queen Elizabeth National Park is one of Uganda's most biologically diverse protected areas, encompassing savanna, wetlands, and forest habitats that support a remarkable breadth of species including tree-climbing lions, forest and savanna elephants, and one of Africa's highest hippopotamus densities.",
        image: "/countries/ug-queen-elizabeth.jpg",
        species: [
          "African Lion (tree-climbing)",
          "African Elephant",
          "Hippopotamus",
          "Chimpanzee",
          "African Buffalo",
          "Topi",
        ],
      },
    ],
    services: [
      { title: "Safe Capture of Wild Animals", available: true },
      { title: "Wild Animal Rescue", available: true },
      { title: "Wildlife Treatment & Care", available: true, notes: "Via UWA-licensed partner veterinarians" },
      { title: "Problem Animal Control", available: true },
      { title: "Wildlife Management Support", available: true },
      {
        title: "Zoo Licensing & Permit Advisory",
        available: true,
        notes: "Uganda Wildlife Authority framework",
      },
      { title: "Wildlife Handling & Staff Training", available: true },
      { title: "Wildlife Adaptation Training", available: true },
      {
        title: "Expert Zoo Setup & Advisory",
        available: false,
        notes: "Currently unavailable — contact us to discuss",
      },
    ],
    regulations: [
      {
        authority: "Uganda Wildlife Authority",
        acronym: "UWA",
        role: "Manages and regulates all protected areas and wildlife in Uganda, including permits for wildlife operations.",
      },
      {
        authority: "Uganda Veterinary Board",
        acronym: "UVB",
        role: "Regulates veterinary practice including wildlife veterinarians operating in Uganda.",
      },
      {
        authority: "National Environment Management Authority",
        acronym: "NEMA Uganda",
        role: "Environmental compliance and impact assessment for operations affecting Uganda's ecosystems.",
      },
    ],
    keySpecies: [
      "Mountain Gorilla",
      "Chimpanzee",
      "African Elephant",
      "African Lion",
      "Hippopotamus",
      "Rothschild's Giraffe",
      "Shoebill Stork",
      "Forest Elephant",
      "African Wild Dog",
      "African Buffalo",
    ],
    challenges: [
      {
        title: "Primate-Human Conflict",
        body: "Chimpanzees and baboons raiding crops along park boundaries are a persistent and complex conflict issue in Uganda. Unlike conflict with megafauna, primate conflict requires highly specialised behavioural approaches and long-term community engagement rather than physical deterrence solutions.",
      },
      {
        title: "Forest Elephant Corridor Fragmentation",
        body: "Uganda's forest elephant populations require connected forest habitats between the Albertine Rift protected areas. Agricultural expansion and settlement are fragmenting these corridors, forcing elephants into conflict situations in areas where communities have limited experience with the species.",
      },
      {
        title: "Disease Risk in Primate Operations",
        body: "Working near mountain gorillas and chimpanzees carries significant disease transmission risk in both directions. TWT's Uganda operations follow strict veterinary-level biosafety protocols — including respiratory protection, distance management, and health screening for all personnel — developed in partnership with UWA and gorilla veterinary specialists.",
      },
    ],
    partners: [
      "Uganda Wildlife Authority (UWA)",
      "International Gorilla Conservation Programme",
      "Chimpanzee Sanctuary & Wildlife Conservation Trust",
      "Wildlife Conservation Society – Uganda",
      "African Wildlife Foundation – Uganda",
      "Gorilla Doctors",
    ],
    quote: {
      text: "Uganda's forest ecosystems are irreplaceable. Working here demands a level of care and specialisation that goes beyond any other landscape we operate in.",
      attribution: "TWT Uganda Partner Lead",
    },
    seo: {
      metaTitle: "Wildlife Operations in Uganda | Tanzania Wildlife Trappers",
      metaDescription:
        "TWT's Uganda partner network — professional wildlife services across Bwindi, Murchison Falls, Queen Elizabeth, and Uganda's unique forest-savanna interface.",
      keywords: [
        "wildlife operations Uganda",
        "gorilla conservation Uganda",
        "UWA licensed operator",
        "wildlife capture Uganda",
        "Murchison Falls wildlife",
        "Bwindi wildlife services",
      ],
    },
  },

  /* ─────────────────────────────────────────────
     RWANDA
  ───────────────────────────────────────────── */
  {
    slug: "rwanda",
    name: "Rwanda",
    capital: "Kigali",
    region: "East Africa",
    flagEmoji: "🇷🇼",
    heroImage: "/card-placeholder.png",
    heroCaption:
      "Volcanoes National Park — home to the world's highest density of mountain gorillas.",
    tagline: "A Conservation Model For The Continent.",
    intro:
      "Rwanda has achieved something rare in contemporary conservation: a small, densely populated country that has made wildlife a cornerstone of national identity and economic strategy. The mountain gorillas of Volcanoes National Park are Rwanda's most internationally recognised asset, and the government's commitment to their protection is matched only by the sophistication of the management infrastructure that surrounds them. TWT engages in Rwanda through specialist advisory and training partnerships, contributing expertise in areas where our East African knowledge base adds direct value.",
    operationalSince: "2018",
    presenceType: "Partner Network",
    contact: {
      phone: "+250 700 000 000",
      email: "rwanda@tanzaniawildlifetrappers.com",
      whatsapp: "250700000000",
    },
    stats: [
      { value: "6+", label: "Years Engaged" },
      { value: "40+", label: "Operations Supported" },
      { value: "3", label: "Conservation Areas" },
      { value: "604", label: "Gorillas in Volcanoes NP" },
    ],
    ecosystems: [
      {
        name: "Volcanoes National Park",
        type: "Afromontane Forest",
        description:
          "Volcanoes National Park encompasses the Rwandan sector of the Virunga Massif — a chain of dormant and active volcanoes straddling the Rwanda-DRC-Uganda border. It is home to approximately 604 mountain gorillas across multiple habituated and unhabituated family groups, in addition to golden monkeys, forest buffalo, and a remarkable high-altitude endemic flora. It is one of the most intensively managed and monitored wildlife areas on Earth.",
        image: "/countries/rw-volcanoes.jpg",
        species: [
          "Mountain Gorilla",
          "Golden Monkey",
          "Forest Buffalo",
          "Black-fronted Duiker",
          "Rwenzori Turaco",
          "African Leopard",
        ],
      },
      {
        name: "Akagera National Park",
        type: "Savanna / Wetland Complex",
        description:
          "Akagera is one of East Africa's great conservation comeback stories. Heavily degraded after the 1994 genocide, the park has been systematically restored under Rwanda Development Board and African Parks management — with the reintroduction of lions in 2015 and black rhinos in 2017. It is now the only Big Five park in Rwanda and a model for collaborative conservation management.",
        image: "/countries/rw-akagera.jpg",
        species: [
          "African Lion",
          "Black Rhinoceros",
          "African Elephant",
          "Hippopotamus",
          "Zebra",
          "Topi",
        ],
      },
      {
        name: "Nyungwe – Cyamudongo Forest",
        type: "Montane Rainforest",
        description:
          "Nyungwe is one of Africa's oldest and most biodiverse montane rainforests, covering the Congo-Nile divide in Rwanda's southwestern highlands. It harbours 13 primate species including chimpanzees and Angola colobus monkeys in groups of up to 400 — the largest primate troops in East Africa.",
        image: "/countries/rw-nyungwe.jpg",
        species: [
          "Chimpanzee",
          "Angola Colobus",
          "Ruwenzori Colobus",
          "L'Hoest's Monkey",
          "African Leopard",
          "Giant Pangolin",
        ],
      },
    ],
    services: [
      { title: "Safe Capture of Wild Animals", available: true, notes: "By RDB special authorisation only" },
      { title: "Wild Animal Rescue", available: true },
      { title: "Wildlife Treatment & Care", available: true, notes: "In partnership with RDB and Gorilla Doctors" },
      { title: "Problem Animal Control", available: true },
      { title: "Wildlife Management Support", available: true },
      {
        title: "Zoo Licensing & Permit Advisory",
        available: true,
        notes: "RDB regulatory framework",
      },
      { title: "Wildlife Handling & Staff Training", available: true },
      { title: "Wildlife Adaptation Training", available: true },
      {
        title: "Expert Zoo Setup & Advisory",
        available: true,
        notes: "Subject to RDB approval",
      },
    ],
    regulations: [
      {
        authority: "Rwanda Development Board",
        acronym: "RDB",
        role: "Manages all national parks and wildlife in Rwanda. All wildlife operations require prior RDB authorisation.",
      },
      {
        authority: "African Parks Network",
        acronym: "APN",
        role: "Co-manages Akagera and Nyungwe under government partnership — a key stakeholder for operations in these areas.",
      },
      {
        authority: "Rwanda Environment Management Authority",
        acronym: "REMA",
        role: "Environmental regulatory oversight for operations affecting Rwanda's natural ecosystems.",
      },
    ],
    keySpecies: [
      "Mountain Gorilla",
      "Golden Monkey",
      "Chimpanzee",
      "African Lion",
      "Black Rhinoceros",
      "African Elephant",
      "Angola Colobus",
      "Forest Buffalo",
      "African Leopard",
      "Giant Pangolin",
    ],
    challenges: [
      {
        title: "Gorilla Disease Prevention",
        body: "Mountain gorillas are critically susceptible to human respiratory diseases. All personnel working near gorillas in Rwanda must follow RDB and IUCN protocols including minimum distance rules, respiratory protection, and health screening. TWT trains partner staff in gorilla proximity protocols as a condition of any engagement in Volcanoes National Park.",
      },
      {
        title: "Agricultural Encroachment on Park Boundaries",
        body: "Rwanda's high population density — one of the highest in Africa — means that national park boundaries are under constant pressure from agricultural expansion. Buffer zone management and community benefit-sharing are critical tools for maintaining the political and social sustainability of conservation in this context.",
      },
      {
        title: "Reintroduction Management",
        body: "Akagera's reintroduced lion and rhino populations require active management — monitoring, veterinary oversight, habitat assessment, and conflict response — as they establish themselves within the park system. TWT contributes specialist expertise to the management of these reintroduced populations.",
      },
    ],
    partners: [
      "Rwanda Development Board (RDB)",
      "African Parks Network – Rwanda",
      "Gorilla Doctors",
      "International Gorilla Conservation Programme",
      "Wildlife Conservation Society – Rwanda",
      "Dian Fossey Gorilla Fund",
    ],
    quote: {
      text: "Rwanda has shown what is possible when a government commits fully to conservation as a national priority. The results speak for themselves.",
      attribution: "TWT Rwanda Advisory Lead",
    },
    seo: {
      metaTitle: "Wildlife Operations in Rwanda | Tanzania Wildlife Trappers",
      metaDescription:
        "TWT's Rwanda engagement — specialist wildlife advisory, training, and field services across Volcanoes, Akagera, and Nyungwe, in partnership with RDB and African Parks.",
      keywords: [
        "wildlife operations Rwanda",
        "gorilla conservation Rwanda",
        "RDB wildlife services",
        "Volcanoes National Park",
        "Akagera wildlife management",
        "wildlife training Rwanda",
      ],
    },
  },
];