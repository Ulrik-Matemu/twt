// app/data/services.ts

export type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  heroImage: string;
  tagline: string;
  intro: string;
  whoItsFor: string[];
  highlights: string[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
};

export const services: Service[] = [
  {
    id: "safe-capture-of-wild-animals",
    slug: "safe-capture-of-wild-animals",
    title: "Safe Capture of Wild Animals",
    shortDescription:
      "Professional, humane capture of wildlife across East Africa — protecting both people and animals with precision field operations.",
    heroImage: "/services/safe-capture.jpg",
    tagline: "Precision. Care. Zero Harm.",
    intro:
      "When wild animals enter human spaces — or humans enter theirs — the encounter must be managed with expertise and calm. Our safe capture services deploy trained field teams using the latest immobilization and containment protocols to resolve conflict situations without harm to the animal or bystanders. From lone predators straying into villages to herd animals blocking critical infrastructure, we bring decades of experience to every callout.",
    whoItsFor: [
      "Private property and estate owners",
      "Farming and agricultural communities",
      "National parks and conservation authorities",
      "Local government and municipal agencies",
      "Research institutions requiring live specimens",
      "Wildlife sanctuaries and rehabilitation centers",
    ],
    highlights: [
      "TAWA-compliant humane capture methods",
      "Chemical immobilization by certified wildlife veterinarians",
      "24/7 emergency response availability",
      "Post-capture animal health assessment",
      "Full documentation and legal compliance support",
      "Minimal ecosystem disruption protocols",
    ],
    process: [
      {
        step: "01",
        title: "Situation Assessment",
        description:
          "Our team conducts a rapid field assessment to identify the species, behavioral state, risk level, and surrounding environment before any intervention.",
      },
      {
        step: "02",
        title: "Strategy & Equipment",
        description:
          "We select the appropriate capture method — net, trap, or chemical immobilization — and prepare all equipment, safety perimeters, and transport arrangements.",
      },
      {
        step: "03",
        title: "Controlled Capture",
        description:
          "Our certified handlers execute the capture calmly and efficiently, monitoring the animal's vital signs throughout the entire process.",
      },
      {
        step: "04",
        title: "Post-Capture Management",
        description:
          "Depending on the case, the animal is stabilized, assessed by a veterinarian, and either released, relocated, or transferred to a care facility.",
      },
    ],
    faqs: [
      {
        question: "Are your methods legal and approved by wildlife authorities?",
        answer:
          "Yes. All capture operations are conducted under valid permits from the Tanzania Wildlife Management Authority (TAWA) and comply with East African wildlife protection law.",
      },
      {
        question: "Can you respond to emergencies at night or on weekends?",
        answer:
          "Absolutely. Wildlife situations don't follow business hours. Our emergency response line is available around the clock, every day of the year.",
      },
      {
        question: "What animals can you safely capture?",
        answer:
          "Our team is trained to handle the full spectrum of East African wildlife — from small reptiles to large mammals including lions, elephants, hippos, and buffalo.",
      },
      {
        question: "Will the animal be harmed during capture?",
        answer:
          "Animal welfare is central to every operation. We use the minimum intervention necessary and all chemical agents are administered at precise, safe dosages by qualified veterinary professionals.",
      },
    ],
    seo: {
      metaTitle: "Safe Wild Animal Capture Services | Tanzania Wildlife Trappers",
      metaDescription:
        "Expert, humane wild animal capture in Tanzania and East Africa. TAWA-licensed field teams for farms, communities, parks, and institutions. Available 24/7.",
    },
  },
  {
    id: "wild-animal-rescue",
    slug: "wild-animal-rescue",
    title: "Wild Animal Rescue",
    shortDescription:
      "Rapid-response rescue operations for injured, stranded, or distressed wildlife — returning animals safely to their natural habitat.",
    heroImage: "/services/rescue.jpg",
    tagline: "Every Life Counts.",
    intro:
      "Injured wildlife, animals caught in snares, orphaned young, or creatures displaced by flooding and fire — all require immediate, skilled intervention. Tanzania Wildlife Trappers operates a dedicated rescue division that responds fast, stabilizes animals in the field, and coordinates onward care with veterinary partners across the region. Our rescue work combines compassion with technical precision, bridging the critical gap between an animal in crisis and its path to recovery.",
    whoItsFor: [
      "Members of the public who discover injured wildlife",
      "Conservation NGOs and field research teams",
      "Game lodge operators and safari companies",
      "Local communities near wildlife corridors",
      "Anti-poaching units removing snared animals",
    ],
    highlights: [
      "Rapid deployment rescue teams",
      "On-site triage and stabilization",
      "Snare and trap removal expertise",
      "Coordination with wildlife veterinary clinics",
      "Orphan care referral and intake management",
      "Rescue documentation for conservation databases",
    ],
    process: [
      {
        step: "01",
        title: "Emergency Contact",
        description:
          "You report a distressed animal via our hotline or contact form. Our team gathers the location, species if known, and nature of the situation.",
      },
      {
        step: "02",
        title: "Rapid Deployment",
        description:
          "The nearest available rescue team is dispatched immediately, equipped for field triage, capture, and transport.",
      },
      {
        step: "03",
        title: "On-Site Stabilization",
        description:
          "Our handlers assess the animal's condition, control pain and stress, remove any snares or entanglements, and prepare for safe transport.",
      },
      {
        step: "04",
        title: "Handover & Recovery",
        description:
          "The animal is transferred to a partner veterinary facility or suitable care center. We track recovery outcomes and coordinate release when cleared.",
      },
    ],
    faqs: [
      {
        question: "How quickly can a rescue team reach me?",
        answer:
          "Response times depend on your location. In Dar es Salaam and major towns we can respond within hours. Remote areas may require coordination with regional partners but we mobilize immediately.",
      },
      {
        question: "What should I do while waiting for the team?",
        answer:
          "Keep people and pets away from the animal. Do not attempt to feed, restrain, or move it unless it is in immediate mortal danger. Our team will guide you by phone.",
      },
      {
        question: "Do you rescue all species including reptiles and birds?",
        answer:
          "Yes. Our rescue teams are trained across mammal, reptile, and avian species, including venomous snakes, large raptors, and marine species in coastal areas.",
      },
    ],
    seo: {
      metaTitle: "Wild Animal Rescue Services Tanzania | Tanzania Wildlife Trappers",
      metaDescription:
        "Emergency wild animal rescue across Tanzania and East Africa. Rapid response for injured, snared, or distressed wildlife. Available 24/7.",
    },
  },
  {
    id: "wildlife-treatment-and-care",
    slug: "wildlife-treatment-and-care",
    title: "Wildlife Treatment and Care",
    shortDescription:
      "Specialist veterinary treatment and rehabilitation care for injured and recovering wildlife, delivered by certified professionals in the field and in clinic.",
    heroImage: "/services/treatment.jpg",
    tagline: "From Trauma to Recovery.",
    intro:
      "After capture or rescue, many animals require professional medical treatment before they can safely return to the wild. Our wildlife treatment and care services are delivered in partnership with certified wildlife veterinarians and rehabilitation specialists. We manage everything from wound care and fracture stabilization to disease treatment, nutritional rehabilitation, and behavioral conditioning — giving each animal the best possible chance of a full recovery and successful reintegration.",
    whoItsFor: [
      "Wildlife rescue operations needing veterinary follow-through",
      "Game reserves managing injured or sick animals",
      "Conservation projects with on-site medical needs",
      "Wildlife sanctuaries requiring specialist consultation",
      "Research programs involving health monitoring",
    ],
    highlights: [
      "Field and clinic-based treatment capacity",
      "Certified wildlife veterinarians and technicians",
      "Surgical and non-surgical intervention",
      "Nutritional rehabilitation programs",
      "Behavioral recovery monitoring",
      "Pre-release fitness assessment and conditioning",
    ],
    process: [
      {
        step: "01",
        title: "Medical Assessment",
        description:
          "A thorough clinical examination identifies injuries, disease, nutritional status, and psychological stress levels.",
      },
      {
        step: "02",
        title: "Treatment Plan",
        description:
          "Our veterinary team designs an individualized treatment and rehabilitation plan appropriate for the species and condition.",
      },
      {
        step: "03",
        title: "Active Care",
        description:
          "Treatment is administered in a low-stress environment, minimizing human contact where beneficial to long-term wild behavior.",
      },
      {
        step: "04",
        title: "Release or Placement",
        description:
          "When the animal meets health and behavioral criteria, we coordinate a monitored release or, if wild release is not viable, a suitable placement.",
      },
    ],
    faqs: [
      {
        question: "Where do animals receive treatment — in the field or at a clinic?",
        answer:
          "Both. Minor treatment can be administered on-site. Animals requiring extended care are transported to partner veterinary facilities with appropriate holding capacity.",
      },
      {
        question: "How long does a typical rehabilitation take?",
        answer:
          "It varies enormously by species, injury severity, and age. Some animals recover within days; others require weeks or months of managed rehabilitation.",
      },
      {
        question: "Do you treat orphaned young animals?",
        answer:
          "Yes. Orphaned animals are one of our most complex and rewarding cases. We provide or coordinate specialist hand-rearing programs designed to preserve wild instincts ahead of release.",
      },
    ],
    seo: {
      metaTitle: "Wildlife Treatment & Rehabilitation Tanzania | Tanzania Wildlife Trappers",
      metaDescription:
        "Expert wildlife medical treatment and rehabilitation in Tanzania. Certified veterinarians, field and clinic care, pre-release assessment. Partner with TWT today.",
    },
  },
  {
    id: "problem-animal-control",
    slug: "problem-animal-control",
    title: "Problem Animal Control for Farms & Communities",
    shortDescription:
      "Practical, humane solutions for human-wildlife conflict on agricultural land and in communities — protecting livelihoods without harming wildlife.",
    heroImage: "/services/problem-animal.jpeg",
    tagline: "Conflict Resolved. Coexistence Restored.",
    intro:
      "Human-wildlife conflict is one of the greatest challenges facing conservation and rural communities across East Africa. When elephants raid crops, lions take livestock, or hippos block waterways, the consequences for families can be devastating — and retaliatory killing is often the result. Tanzania Wildlife Trappers intervenes with humane, professional problem animal control strategies that protect communities and farms while keeping wildlife alive and where it belongs.",
    whoItsFor: [
      "Smallholder and commercial farmers",
      "Pastoral and agro-pastoral communities",
      "Village governments and district authorities",
      "Agricultural insurance providers",
      "NGOs working in human-wildlife conflict mitigation",
    ],
    highlights: [
      "Rapid response to crop raiding and livestock predation",
      "Non-lethal deterrence systems and barrier installation",
      "Problem animal translocation where appropriate",
      "Community early-warning network setup",
      "Conflict documentation for compensation claims",
      "Long-term coexistence strategy development",
    ],
    process: [
      {
        step: "01",
        title: "Conflict Assessment",
        description:
          "We investigate the pattern of incidents, species involved, habitat interface, and socio-economic impact to understand the full picture.",
      },
      {
        step: "02",
        title: "Immediate Intervention",
        description:
          "Where animals are actively present, we deploy deterrence or capture measures to protect life and property without unnecessary harm to the animal.",
      },
      {
        step: "03",
        title: "Structural Solutions",
        description:
          "We design and help implement physical and behavioral deterrents — from chili fences and beehive barriers to movement corridors and early warning systems.",
      },
      {
        step: "04",
        title: "Community Engagement",
        description:
          "We work with local leadership to build tolerance, understanding, and reporting systems that create lasting coexistence.",
      },
    ],
    faqs: [
      {
        question: "Can problem animals be permanently moved away from our area?",
        answer:
          "Translocation is possible for certain species and situations, but long-term deterrence strategies are usually more effective. We assess each case individually and recommend the most appropriate solution.",
      },
      {
        question: "Do you provide documentation for government compensation schemes?",
        answer:
          "Yes. We produce formal conflict incident reports that can support applications to the Tanzania Wildlife Management Authority and other bodies for livestock or crop loss compensation.",
      },
      {
        question: "Is lethal control ever used?",
        answer:
          "Only as an absolute last resort in cases where human life is at imminent risk and no other intervention is viable — and only with full legal authorization. Our default approach is always non-lethal.",
      },
    ],
    seo: {
      metaTitle: "Problem Animal Control for Farms & Communities | Tanzania Wildlife Trappers",
      metaDescription:
        "Humane human-wildlife conflict solutions for farmers and communities in Tanzania. Crop raiding, livestock predation, and coexistence strategies by expert field teams.",
    },
  },
  {
    id: "wildlife-management-support",
    slug: "wildlife-management-support",
    title: "Wildlife Management Support",
    shortDescription:
      "Strategic and operational wildlife management consulting for game reserves, conservation areas, and protected land managers across East Africa.",
    heroImage: "/services/management.jpg",
    tagline: "Science-Led. Field-Proven.",
    intro:
      "Effective wildlife management is the foundation of a healthy ecosystem and a sustainable conservation enterprise. Tanzania Wildlife Trappers provides expert management support services to game reserve managers, private conservancies, and protected area authorities — drawing on decades of field knowledge to help clients make informed decisions about population dynamics, habitat carrying capacity, disease control, and animal welfare standards.",
    whoItsFor: [
      "Private game reserve and conservancy managers",
      "National park and protected area authorities",
      "Tourism operators managing wildlife areas",
      "Conservation NGOs and international organizations",
      "Government wildlife departments",
    ],
    highlights: [
      "Wildlife population surveys and census support",
      "Carrying capacity and habitat assessment",
      "Disease monitoring and management planning",
      "Translocation planning and execution",
      "Management plan review and development",
      "Stakeholder consultation and reporting",
    ],
    process: [
      {
        step: "01",
        title: "Baseline Survey",
        description:
          "We conduct systematic field surveys to establish accurate population counts, species distribution, and habitat condition baselines.",
      },
      {
        step: "02",
        title: "Analysis & Planning",
        description:
          "Survey data is analyzed against ecological benchmarks to identify management priorities and opportunities.",
      },
      {
        step: "03",
        title: "Implementation Support",
        description:
          "We work alongside your team to implement management actions — from controlled burns and waterpoint management to selective translocation.",
      },
      {
        step: "04",
        title: "Monitoring & Reporting",
        description:
          "Ongoing monitoring ensures management actions are delivering results. We provide clear, actionable reports for stakeholders and licensing authorities.",
      },
    ],
    faqs: [
      {
        question: "Do you work on small private conservancies, not just national parks?",
        answer:
          "Absolutely. A significant portion of our management support work is with private game farms and conservancies of all sizes. We adapt our approach to the scale and resources of each client.",
      },
      {
        question: "Can you help us develop a new wildlife management plan?",
        answer:
          "Yes. We assist with the full development of five-year management plans, including the stakeholder engagement and regulatory submission processes required by Tanzanian law.",
      },
    ],
    seo: {
      metaTitle: "Wildlife Management Support Services | Tanzania Wildlife Trappers",
      metaDescription:
        "Expert wildlife management consulting for game reserves, conservancies, and protected areas in Tanzania and East Africa. Surveys, planning, and hands-on support.",
    },
  },
  {
    id: "zoo-licensing-and-permit-advisory",
    slug: "zoo-licensing-and-permit-advisory",
    title: "Zoo Licensing & Permit Advisory",
    shortDescription:
      "Expert guidance through Tanzania's wildlife licensing and permitting frameworks for zoos, sanctuaries, educational facilities, and private collections.",
    heroImage: "/services/zoo-licensing.png",
    tagline: "Navigate Compliance. Open with Confidence.",
    intro:
      "Establishing or operating a zoo, wildlife sanctuary, or animal education center in Tanzania involves navigating a complex web of national and international regulations. Tanzania Wildlife Trappers provides specialist advisory services to help clients understand, apply for, and maintain the licenses and permits required to operate legally and ethically — from TAWA facility licenses to CITES import and export documentation.",
    whoItsFor: [
      "Entrepreneurs establishing new zoo facilities",
      "Existing zoological gardens seeking compliance upgrades",
      "Wildlife education center operators",
      "Private wildlife collection holders",
      "Hospitality groups integrating wildlife experiences",
    ],
    highlights: [
      "TAWA zoo and wildlife facility licensing",
      "CITES import, export, and transit permits",
      "Facility standards assessment and gap analysis",
      "Application preparation and submission support",
      "Ongoing compliance monitoring",
      "Staff accreditation and regulatory training",
    ],
    process: [
      {
        step: "01",
        title: "Regulatory Audit",
        description:
          "We review your facility, species list, and operations against current TAWA and CITES requirements to identify any compliance gaps.",
      },
      {
        step: "02",
        title: "Application Strategy",
        description:
          "We develop a clear, prioritized plan for obtaining the necessary permits and licenses in the correct sequence.",
      },
      {
        step: "03",
        title: "Documentation & Submission",
        description:
          "Our team prepares all required documentation to the standard expected by Tanzanian wildlife authorities and supports submission through official channels.",
      },
      {
        step: "04",
        title: "Compliance Maintenance",
        description:
          "Regulations evolve. We provide ongoing monitoring and alert services to ensure your facility remains fully compliant over time.",
      },
    ],
    faqs: [
      {
        question: "How long does the zoo licensing process typically take in Tanzania?",
        answer:
          "Processing times vary depending on the facility type and completeness of the application. Well-prepared applications to TAWA typically take 3–6 months. We help you avoid delays by getting documents right the first time.",
      },
      {
        question: "Can you help us source legally acquired animals for our zoo?",
        answer:
          "Yes. We can advise on legal acquisition channels, facilitate inter-facility transfers, and ensure all movement documentation meets CITES and national regulatory requirements.",
      },
      {
        question: "What if our facility doesn't currently meet standards?",
        answer:
          "We begin with an honest compliance audit and develop a phased improvement plan. We work with you — not against you — to reach the required standards.",
      },
    ],
    seo: {
      metaTitle: "Zoo Licensing & Wildlife Permit Advisory Tanzania | Tanzania Wildlife Trappers",
      metaDescription:
        "Expert zoo licensing and CITES permit advisory for Tanzania and East Africa. TAWA compliance, application support, and ongoing regulatory guidance.",
    },
  },
  {
    id: "wildlife-handling-and-staff-training",
    slug: "wildlife-handling-and-staff-training",
    title: "Wildlife Handling & Staff Training",
    shortDescription:
      "Hands-on professional training programs for rangers, game scouts, veterinary staff, and conservation workers in safe, humane wildlife handling.",
    heroImage: "/services/training.jpg",
    tagline: "Train the Hands That Protect the Wild.",
    intro:
      "The safety of your team and the welfare of the animals they work with depend entirely on the quality of their training. Tanzania Wildlife Trappers delivers practical, immersive training programs built on decades of real field experience. Our courses cover everything from basic animal safety awareness to advanced chemical immobilization for wildlife veterinary technicians — all taught by active field professionals who still do this work every day.",
    whoItsFor: [
      "Wildlife rangers and game scouts",
      "Veterinary technicians and field assistants",
      "Safari guide training programs",
      "Conservation NGO field teams",
      "Wildlife research institutions",
      "Anti-poaching unit personnel",
    ],
    highlights: [
      "Species-specific safe handling techniques",
      "Chemical immobilization theory and practice",
      "Animal restraint and transport methods",
      "Emergency field response protocols",
      "Personal safety and risk management",
      "CPR and wildlife first aid certification support",
    ],
    process: [
      {
        step: "01",
        title: "Needs Assessment",
        description:
          "We evaluate your team's current knowledge level, the species they work with, and the specific operational risks they face.",
      },
      {
        step: "02",
        title: "Curriculum Design",
        description:
          "A customized training program is developed — classroom, field simulation, or live animal components based on your requirements.",
      },
      {
        step: "03",
        title: "Delivered Training",
        description:
          "Courses are delivered at your facility or ours, led by certified instructors with current field experience in East African wildlife operations.",
      },
      {
        step: "04",
        title: "Assessment & Certification",
        description:
          "Participants are assessed at the end of the program. Those who meet the standard receive a Tanzania Wildlife Trappers certificate of completion.",
      },
    ],
    faqs: [
      {
        question: "Can training be delivered at our remote field station?",
        answer:
          "Yes. We regularly deliver training in remote locations across Tanzania. Travel, accommodation, and logistics costs are factored into the program quote.",
      },
      {
        question: "How many participants can attend a single course?",
        answer:
          "For safety and quality, hands-on practical sessions are capped at 12 participants. Classroom-based modules can accommodate larger groups.",
      },
      {
        question: "Do you offer refresher training for experienced staff?",
        answer:
          "Absolutely. We offer modular refresher programs covering specific skills or covering regulatory and technique updates for experienced professionals.",
      },
    ],
    seo: {
      metaTitle: "Wildlife Handling & Staff Training Tanzania | Tanzania Wildlife Trappers",
      metaDescription:
        "Professional wildlife handling training for rangers, vets, and conservation teams in Tanzania. Practical, field-led courses covering safe capture, immobilization, and emergency response.",
    },
  },
  {
    id: "wildlife-adaptation-and-human-interaction-training",
    slug: "wildlife-adaptation-and-human-interaction-training",
    title: "Wildlife Adaptation & Human Interaction Training",
    shortDescription:
      "Specialist behavioral conditioning programs for wildlife transitioning to managed environments, and community education to reduce human-wildlife conflict.",
    heroImage: "/services/adaptation.jpg",
    tagline: "Teaching Both Sides of the Fence.",
    intro:
      "Helping wildlife adapt to new environments — whether after rescue, relocation, or introduction to a managed facility — requires deep behavioral expertise. At the same time, communities living alongside wildlife need education and practical tools to reduce fear, prevent conflict, and coexist sustainably. Tanzania Wildlife Trappers delivers specialist programs on both sides of this equation, combining applied animal behavior science with culturally grounded community engagement.",
    whoItsFor: [
      "Wildlife rehabilitation centers preparing animals for release",
      "Zoos and sanctuaries managing newly acquired animals",
      "Rural communities in wildlife buffer zones",
      "Schools and educational programs near protected areas",
      "Tourism operators seeking responsible wildlife interaction protocols",
    ],
    highlights: [
      "Behavioral conditioning for captive and transitioning animals",
      "Pre-release wild behavior reinforcement",
      "Community human-wildlife coexistence workshops",
      "School and youth conservation education programs",
      "Customized curriculum for community education facilitators",
      "Fear reduction and incident prevention training",
    ],
    process: [
      {
        step: "01",
        title: "Behavioral Baseline",
        description:
          "For animals, we assess current behavioral patterns, stress responses, and adaptations needed for the target environment.",
      },
      {
        step: "02",
        title: "Program Design",
        description:
          "A conditioning or education program is designed with clear behavioral objectives and measurable success criteria.",
      },
      {
        step: "03",
        title: "Delivered Sessions",
        description:
          "Animal conditioning sessions or community workshops are delivered by our behavioral specialists over an agreed program schedule.",
      },
      {
        step: "04",
        title: "Outcome Review",
        description:
          "We review outcomes against behavioral targets and community feedback, adjusting the program as needed for lasting results.",
      },
    ],
    faqs: [
      {
        question: "Can you help rehabilitated animals 'unlearn' dependence on humans?",
        answer:
          "Yes. This is one of our most important specializations. We use graduated desensitization and wild reinforcement techniques to reduce human dependence before release.",
      },
      {
        question: "Do you deliver community education in local languages?",
        answer:
          "Yes. Our community education programs are delivered in Swahili and can incorporate local community languages where needed, using facilitators with deep local knowledge.",
      },
    ],
    seo: {
      metaTitle: "Wildlife Adaptation & Human Interaction Training | Tanzania Wildlife Trappers",
      metaDescription:
        "Behavioral adaptation training for wildlife and community education programs to reduce human-wildlife conflict in Tanzania and East Africa.",
    },
  },
  {
    id: "zoo-setup-and-wildlife-advisory",
    slug: "zoo-setup-and-wildlife-advisory",
    title: "Expert Zoo Setup & Wildlife Advisory",
    shortDescription:
      "End-to-end expert advisory for designing, establishing, and operating world-class zoo and wildlife facilities across East Africa.",
    heroImage: "/services/zoo-setup.png",
    tagline: "Build It Right. From the Ground Up.",
    intro:
      "Creating a zoo or wildlife facility that meets the highest standards of animal welfare, visitor experience, and operational efficiency is a complex, multi-year endeavor. Tanzania Wildlife Trappers provides comprehensive advisory services to investors, tourism groups, government agencies, and conservation organizations embarking on this journey — from initial concept and site selection through to species acquisition, enclosure design review, staff recruitment, and opening operations.",
    whoItsFor: [
      "Investors and developers planning zoo or wildlife park facilities",
      "Tourism companies expanding into wildlife experiences",
      "Government bodies establishing public zoological institutions",
      "Conservation organizations building education centers",
      "Existing facilities undergoing major expansion or renovation",
    ],
    highlights: [
      "Concept development and feasibility assessment",
      "Site selection and habitat compatibility analysis",
      "Enclosure design and animal welfare review",
      "Species selection strategy and acquisition planning",
      "Staffing structure and recruitment advisory",
      "SOPs and operational framework development",
    ],
    process: [
      {
        step: "01",
        title: "Vision & Feasibility",
        description:
          "We work with your team to define the facility's vision, assess site conditions, and develop an honest feasibility analysis covering wildlife welfare, regulatory, and commercial dimensions.",
      },
      {
        step: "02",
        title: "Design Advisory",
        description:
          "We review facility and enclosure designs against international animal welfare standards and East African best practice, providing detailed recommendations.",
      },
      {
        step: "03",
        title: "Species & Acquisition Planning",
        description:
          "We develop a species plan aligned with your facility's purpose and capacity, and advise on legal acquisition pathways including captive breeding programs and inter-facility transfers.",
      },
      {
        step: "04",
        title: "Operational Launch Support",
        description:
          "From staff training to opening-day protocols, we provide hands-on support through your facility's launch and initial operational phase.",
      },
    ],
    faqs: [
      {
        question: "How early in the project should we engage TWT advisory?",
        answer:
          "As early as possible — ideally at the concept or site selection stage. Early advisory prevents costly design and regulatory mistakes and ensures the facility is built correctly from the start.",
      },
      {
        question: "Can you advise on international accreditation for our zoo?",
        answer:
          "Yes. We can guide you toward the standards required by bodies such as the World Association of Zoos and Aquariums (WAZA) and regional equivalents, and support your accreditation journey.",
      },
      {
        question: "Do you assist with animal sourcing internationally?",
        answer:
          "We advise on international acquisition through legal channels including studbook programs, species survival plans, and reputable captive collections, ensuring full CITES compliance.",
      },
    ],
    seo: {
      metaTitle: "Zoo Setup & Wildlife Facility Advisory Tanzania | Tanzania Wildlife Trappers",
      metaDescription:
        "Expert end-to-end advisory for zoo and wildlife facility development in Tanzania and East Africa. Feasibility, design review, species planning, and operational launch support.",
    },
  },
];