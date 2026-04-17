// app/data/projects.ts

export type Project = {
  id: string;
  slug: string;
  category: "Relocation" | "Rescue" | "Conflict Control" | "Conservation" | "Training";
  tag: string;
  title: string;
  location: string;
  region: string;
  year: string;
  duration: string;
  species: string[];
  outcome: string;
  heroImage: string;
  summary: string;
  featured?: boolean;
  stats: { label: string; value: string }[];
};

export const projects: Project[] = [
  {
    id: "rufiji-elephant-corridor",
    slug: "rufiji-elephant-corridor",
    category: "Relocation",
    tag: "Large Mammal Relocation",
    title: "The Rufiji Corridor Relocation",
    location: "Rufiji River Basin, Selous Game Reserve",
    region: "Southern Tanzania",
    year: "2023",
    duration: "14 days",
    species: ["African Elephant"],
    outcome: "Successful",
    heroImage: "/projects/rufiji-elephants.jpg",
    summary:
      "A herd of 22 elephants had established a destructive feeding pattern along a critical agricultural corridor bordering the Selous Game Reserve, causing severe crop losses to four farming communities. Over 14 days, our team planned and executed the largest translocation operation in TWT's recent history — safely relocating the entire herd 80km north into undisturbed reserve territory.",
    featured: true,
    stats: [
      { label: "Animals Relocated", value: "22" },
      { label: "Operation Duration", value: "14 Days" },
      { label: "Distance Covered", value: "80 km" },
      { label: "Communities Protected", value: "4" },
    ],
  },
  {
    id: "ngorongoro-lion-conflict",
    slug: "ngorongoro-lion-conflict",
    category: "Conflict Control",
    tag: "Predator Management",
    title: "Ngorongoro Lion Conflict",
    location: "Ngorongoro Conservation Area",
    region: "Northern Tanzania",
    year: "2023",
    duration: "6 days",
    species: ["African Lion"],
    outcome: "Successful",
    heroImage: "/projects/ngorongoro-lion.jpg",
    summary:
      "A coalition of three male lions repeatedly broke through boma fencing to take livestock from a Maasai community on the NCA boundary. We deployed non-lethal deterrence systems, installed reinforced boma barriers, and facilitated a community compensation and early-warning program that has held for over eight months.",
    stats: [
      { label: "Lions Managed", value: "3" },
      { label: "Bomas Reinforced", value: "11" },
      { label: "Livestock Lost Since", value: "0" },
      { label: "Months Conflict-Free", value: "8+" },
    ],
  },
  {
    id: "selous-wild-dog-rescue",
    slug: "selous-wild-dog-rescue",
    category: "Rescue",
    tag: "Emergency Rescue",
    title: "Selous Wild Dog Pack Rescue",
    location: "Selous Game Reserve",
    region: "Southern Tanzania",
    year: "2022",
    duration: "3 days",
    species: ["African Wild Dog"],
    outcome: "Successful",
    heroImage: "/projects/wild-dogs.jpg",
    summary:
      "Anti-poaching rangers discovered a pack of seven African wild dogs — one of Africa's most endangered canids — with three individuals caught in wire snares. We deployed an emergency rescue team within 6 hours of the callout. All three snared animals were freed, medically assessed, and returned to the pack without permanent injury.",
    stats: [
      { label: "Dogs Rescued", value: "3" },
      { label: "Response Time", value: "6 hrs" },
      { label: "Pack Size", value: "7" },
      { label: "Permanent Injury", value: "None" },
    ],
  },
  {
    id: "ruaha-hippo-waterpoint",
    slug: "ruaha-hippo-waterpoint",
    category: "Conservation",
    tag: "Habitat Management",
    title: "Ruaha Hippo Waterpoint Survey",
    location: "Ruaha National Park",
    region: "Central Tanzania",
    year: "2022",
    duration: "21 days",
    species: ["Hippopotamus", "Nile Crocodile", "African Fish Eagle"],
    outcome: "Completed",
    heroImage: "/projects/hippo-waterpoint.jpg",
    summary:
      "The prolonged dry season had concentrated an unusually high density of hippos around three remaining waterpoints in the park's eastern section, creating dangerous competition and increasing human-wildlife encounters near park boundaries. We conducted a 21-day waterpoint survey, documented population stress indicators, and delivered a management plan to the park authority.",
    stats: [
      { label: "Waterpoints Surveyed", value: "3" },
      { label: "Hippos Documented", value: "340+" },
      { label: "Survey Days", value: "21" },
      { label: "Report Delivered", value: "Yes" },
    ],
  },
  {
    id: "arusha-leopard-capture",
    slug: "arusha-leopard-capture",
    category: "Rescue",
    tag: "Urban Wildlife Response",
    title: "Arusha Urban Leopard Capture",
    location: "Arusha Municipality",
    region: "Northern Tanzania",
    year: "2023",
    duration: "2 days",
    species: ["Leopard"],
    outcome: "Successful",
    heroImage: "/projects/arusha-leopard.jpg",
    summary:
      "A young male leopard entered the Arusha urban fringe at night and became cornered in an industrial compound, injuring two workers attempting to chase it out. Our team responded within two hours, safely immobilised the animal at dawn, conducted a full health assessment, and released it in suitable leopard territory 60km from the city.",
    stats: [
      { label: "Response Time", value: "2 hrs" },
      { label: "Animal Condition", value: "Healthy" },
      { label: "Release Distance", value: "60 km" },
      { label: "Public Injuries", value: "0 by TWT" },
    ],
  },
  {
    id: "tarangire-giraffe-training",
    slug: "tarangire-giraffe-training",
    category: "Training",
    tag: "Ranger Training",
    title: "Tarangire Ranger Handling Program",
    location: "Tarangire National Park",
    region: "Northern Tanzania",
    year: "2023",
    duration: "5 days",
    species: ["Giraffe", "Zebra", "Wildebeest"],
    outcome: "Completed",
    heroImage: "/projects/tarangire-training.jpg",
    summary:
      "TANAPA commissioned TWT to deliver a structured wildlife handling and emergency response training program for 24 rangers assigned to Tarangire National Park. The five-day program covered species-specific handling, chemical immobilisation awareness, on-field triage, and conflict situation management with live-field practical components.",
    stats: [
      { label: "Rangers Trained", value: "24" },
      { label: "Program Days", value: "5" },
      { label: "Modules Completed", value: "8" },
      { label: "Pass Rate", value: "100%" },
    ],
  },
  {
    id: "kilombero-crocodile-conflict",
    slug: "kilombero-crocodile-conflict",
    category: "Conflict Control",
    tag: "Conflict Management",
    title: "Kilombero Valley Crocodile Conflict",
    location: "Kilombero Valley",
    region: "South-Central Tanzania",
    year: "2022",
    duration: "8 days",
    species: ["Nile Crocodile"],
    outcome: "Successful",
    heroImage: "/projects/kilombero-croc.jpg",
    summary:
      "Seasonal flooding pushed a population of Nile crocodiles into active rice-farming channels in the Kilombero Valley, resulting in four livestock attacks and a near-miss with a child. We deployed capture and relocation teams, removed eight problem individuals from the farming channels, and delivered community education sessions on waterway safety.",
    stats: [
      { label: "Crocodiles Relocated", value: "8" },
      { label: "Attacks Since", value: "0" },
      { label: "Villages Covered", value: "3" },
      { label: "Education Sessions", value: "6" },
    ],
  },
  {
    id: "mikumi-orphan-cheetah",
    slug: "mikumi-orphan-cheetah",
    category: "Rescue",
    tag: "Orphan Rehabilitation",
    title: "Mikumi Orphan Cheetah Rehabilitation",
    location: "Mikumi National Park",
    region: "Eastern Tanzania",
    year: "2022",
    duration: "90 days",
    species: ["Cheetah"],
    outcome: "Successful",
    heroImage: "/projects/mikumi-cheetah.jpg",
    summary:
      "A female cheetah cub, approximately 6 weeks old, was found alone near a poacher's snare line in Mikumi. Our team managed an intensive 90-day rehabilitation program with strict minimal human-contact protocols to preserve wild hunting instincts. The cub was successfully released in a monitored soft-release area and has been confirmed territory-holding for three months.",
    stats: [
      { label: "Rehab Duration", value: "90 Days" },
      { label: "Release Weight", value: "28 kg" },
      { label: "Months Post-Release", value: "3+" },
      { label: "Wild Status", value: "Confirmed" },
    ],
  },
  {
    id: "serengeti-zebra-census",
    slug: "serengeti-zebra-census",
    category: "Conservation",
    tag: "Population Survey",
    title: "Serengeti Zebra Population Survey",
    location: "Serengeti National Park",
    region: "Northern Tanzania",
    year: "2023",
    duration: "30 days",
    species: ["Plains Zebra", "Blue Wildebeest", "Thomson's Gazelle"],
    outcome: "Completed",
    heroImage: "/projects/serengeti-zebra.jpg",
    summary:
      "Commissioned by TANAPA and a conservation research partner, TWT led a 30-day ground and aerial survey of zebra populations across the Serengeti's southern corridor — providing baseline data for a five-year management plan. The survey documented 67,400 individuals and identified three previously unrecorded movement corridors.",
    stats: [
      { label: "Zebra Documented", value: "67,400" },
      { label: "Survey Area", value: "4,200 km²" },
      { label: "New Corridors Found", value: "3" },
      { label: "Survey Days", value: "30" },
    ],
  },
];