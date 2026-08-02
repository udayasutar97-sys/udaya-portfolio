export type ProjectId =
  | "q-adapt"
  | "snowman-ai"
  | "face-emotion-recognition"
  | "community-events"
  | "block-ninja"
  | "sonic-air"
  | "weatherx";

export type ProjectVisual =
  | "quantum"
  | "brain"
  | "face"
  | "city"
  | "game"
  | "sound"
  | "weather";

export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
};

export type Project = {
  id: ProjectId;
  number: string;

  title: string;
  shortTitle: string;
  category: string;

  summary: string;
  overview: string;
  motivation: string;

  contribution: string[];
  technologies: string[];
  highlights: string[];

  status: string;
  visual: ProjectVisual;

  repository?: string;
  liveDemo?: string;
  researchPaper?: string;

  images: [
    ProjectImage,
    ProjectImage,
    ProjectImage,
  ];

  isVisible: boolean;
};

export const projects: Project[] = [
  {
    id: "q-adapt",
    number: "01",

    title: "Q-ADAPT",
    shortTitle: "Q-ADAPT",
    category: "QUANTUM COMPUTING",

    summary:
      "An adaptive quantum experimentation platform designed to evaluate circuit candidates and respond intelligently to changing noise conditions.",

    overview:
      "Q-ADAPT explores how quantum experiments can adapt when quantum hardware behaviour changes. The system evaluates alternative execution strategies, compares their output distributions and decides whether a candidate should be accepted, rejected or left unchanged.",

    motivation:
      "Real quantum hardware is affected by noise, drift and changing calibration conditions. I wanted to investigate whether an experimental workflow could respond dynamically instead of relying on one fixed circuit configuration.",

    contribution: [
      "Designed the adaptive experiment-selection workflow.",
      "Built simulation and IBM Quantum execution paths.",
      "Implemented per-class accept, reject and no-change decisions.",
      "Added drift experiments, candidate comparisons and total variation distance analysis.",
      "Created repeatable scripts for running experiments and generating summaries.",
    ],

    technologies: [
      "Python",
      "Qiskit",
      "Qiskit Aer",
      "IBM Quantum",
      "NumPy",
      "Matplotlib",
    ],

    highlights: [
      "Adaptive candidate evaluation",
      "Noise and drift analysis",
      "Simulation and hardware support",
      "Reproducible experiment pipeline",
    ],

    status: "IN DEVELOPMENT . RESEARCHING AND EXPERIMENTING",
    visual: "quantum",

    repository:
      "https://github.com/udayasutar97-sys/q-adapt-v3",

    images: [
      {
        src: "/images/q-adapt/q-adapt-01.png",
        alt: "Q-ADAPT adaptive experiment output and decision summary",
        caption:
          "Adaptive experiment execution and decision summary",
      },
      {
        src: "/images/q-adapt/q-adapt-02.png",
        alt: "Q-ADAPT noise drift and total variation distance graphs",
        caption:
          "Noise-drift response and TVD comparison",
      },
      {
        src: "/images/q-adapt/q-adapt-03.png",
        alt: "Q-ADAPT candidate evaluation and experiment results",
        caption:
          "Candidate search, acceptance and rejection analysis",
      },
    ],

    isVisible: true,
  },

  {
    id: "snowman-ai",
    number: "02",

    title: "SNOWMAN AI",
    shortTitle: "SNOWMAN AI",
    category: "ARTIFICIAL INTELLIGENCE",

    summary:
      "A modular AI system exploring memory, planning, model routing and multimodal interaction.",

    overview:
      "Snowman AI is an attempt to build an intelligent orchestration layer rather than a single chatbot interface. Its architecture is centred around coordinating models, retaining useful context and breaking complex goals into manageable actions.",

    motivation:
      "Most AI interfaces expose one model and one conversation. I wanted to explore the systems required behind a more capable assistant: memory, planning, routing, tool use and multimodal understanding.",

    contribution: [
      "Designed the modular system architecture.",
      "Explored model-routing and task-planning workflows.",
      "Built the interface and interaction system.",
      "Developed concepts for persistent memory and contextual retrieval.",
      "Structured the project for future tools and multimodal inputs.",
    ],

    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "AI Models",
      "Agent Systems",
    ],

    highlights: [
      "Modular AI architecture",
      "Model-routing concepts",
      "Planning and memory systems",
      "Multimodal design direction",
    ],

    status: "IN DEVELOPMENT . EXPLORING MORE EFFICIENT PIPELINES AND SYSTEMS",
    visual: "brain",

    repository:
      "https://github.com/udayasutar97-sys/snowman",

    images: [
      {
        src: "/images/snowman-ai/snowman-ai-01.png",
        alt: "Snowman AI main application interface",
        caption:
          "Primary AI workspace and interaction interface",
      },
      {
        src: "/images/snowman-ai/snowman-ai-02.png",
        alt: "Snowman AI model routing and architecture interface",
        caption:
          "Model routing and modular intelligence architecture",
      },
      {
        src: "/images/snowman-ai/snowman-ai-03.png",
        alt: "Snowman AI memory and planning workflow",
        caption:
          "Memory, planning and contextual workflow",
      },
    ],

    isVisible: true,
  },

  {
    id: "face-emotion-recognition",
    number: "03",

    title: "FACE EMOTION RECOGNITION",
    shortTitle: "EMOTION AI",
    category: "COMPUTER VISION",

    summary:
      "A real-time computer-vision system that detects faces and classifies visible facial expressions.",

    overview:
      "The project processes live visual input, locates faces and estimates the emotion represented by facial expressions. It combines browser-based interaction with a machine-learning inference pipeline.",

    motivation:
      "I wanted to understand how machines extract meaningful information from visual signals and how a trained model can be integrated into an interactive real-time application.",

    contribution: [
      "Integrated real-time camera input.",
      "Implemented face detection and emotion classification.",
      "Built the browser-based user interface.",
      "Displayed predictions dynamically during live inference.",
      "Experimented with model confidence and visual feedback.",
    ],

    technologies: [
      "JavaScript",
      "TensorFlow.js",
      "Computer Vision",
      "HTML",
      "CSS",
      "Browser APIs",
    ],

    highlights: [
      "Real-time camera processing",
      "Facial-expression classification",
      "Browser-based inference",
      "Interactive prediction display",
    ],

    status: "COMPLETED PROJECT",
    visual: "face",

    repository:
      "https://github.com/udayasutar97-sys/face-emotion-ai",

    images: [
      {
        src: "/images/emotion-ai/emotion-ai-01.png",
        alt: "Face emotion recognition live camera interface",
        caption:
          "Real-time camera analysis and face detection",
      },
      {
        src: "/images/emotion-ai/emotion-ai-02.png",
        alt: "Face emotion recognition prediction and confidence display",
        caption:
          "Emotion classification and confidence output",
      },
      {
        src: "/images/emotion-ai/emotion-ai-03.png",
        alt: "Face emotion recognition browser application",
        caption:
          "Interactive browser-based inference experience",
      },
    ],

    isVisible: true,
  },

  {
    id: "community-events",
    number: "04",

    title: "COMMUNITY EVENTS",
    shortTitle: "COMMUNITY EVENTS",
    category: "FULL-STACK ENGINEERING",

    summary:
      "A location-aware platform for discovering and organising events using maps, weather data and community interaction.",

    overview:
      "Community Events is a full-stack web application where users can create events, discover nearby activities and inspect event locations through an interactive map. It combines authentication, geocoding, weather information and social features.",

    motivation:
      "I wanted to build a complete product that connected multiple external services while still maintaining a clear and useful user experience.",

    contribution: [
      "Built authentication and user profiles.",
      "Implemented event creation, filtering and discovery.",
      "Integrated geocoding and interactive maps.",
      "Added hourly weather information for event locations.",
      "Developed comments and organiser activity views.",
    ],

    technologies: [
      "Python",
      "Django",
      "JavaScript",
      "Leaflet",
      "Nominatim",
      "Weather APIs",
    ],

    highlights: [
      "Complete full-stack application",
      "Location-aware event discovery",
      "Interactive maps and geocoding",
      "Live weather integration",
    ],

    status: "COMPLETED PROJECT",
    visual: "city",

    repository:
      "https://github.com/udayasutar97-sys/CS50-Capstone-Final-Project-.git",

    images: [
      {
        src: "/images/community-events/community-events-01.png",
        alt: "Community Events location-aware discovery page",
        caption:
          "Location-aware event discovery interface",
      },
      {
        src: "/images/community-events/community-events-02.png",
        alt: "Community Events interactive map and markers",
        caption:
          "Interactive event map and geocoding",
      },
      {
        src: "/images/community-events/community-events-03.png",
        alt: "Community Events details comments and weather page",
        caption:
          "Event information, comments and live weather",
      },
    ],

    isVisible: true,
  },

  {
    id: "block-ninja",
    number: "05",

    title: "BLOCK NINJA",
    shortTitle: "BLOCK NINJA",
    category: "GAME DEVELOPMENT",

    summary:
      "A fast-paced browser game built around timing, movement, reaction speed and score progression.",

    overview:
      "Block Ninja is a browser-based game in which the player responds to moving obstacles and changing gameplay conditions. The project focuses on real-time interaction, collision logic, movement systems and responsive feedback.",

    motivation:
      "I built Block Ninja to explore game loops, player input, collision detection and the interaction details that make a game feel responsive and enjoyable.",

    contribution: [
      "Designed the core gameplay loop.",
      "Implemented player controls and obstacle movement.",
      "Built collision detection and scoring logic.",
      "Created restart and game-state behaviour.",
      "Added responsive visual and interaction feedback.",
    ],

    technologies: [
      "JavaScript",
      "HTML",
      "CSS",
      "Game Logic",
      "Collision Detection",
      "Browser APIs",
    ],

    highlights: [
      "Real-time player interaction",
      "Collision and scoring system",
      "Responsive game controls",
      "Complete playable game loop",
    ],

    status: "COMPLETED PROJECT",
    visual: "game",
    liveDemo: "https://udayasutar97-sys.github.io/block-ninja/",
    repository:
      "https://github.com/udayasutar97-sys/block-ninja",

    images: [
      {
        src: "/images/block-ninja/block-ninja-01.png",
        alt: "Block Ninja main gameplay interface",
        caption:
          "Primary gameplay and player-control interface",
      },
      {
        src: "/images/block-ninja/block-ninja-02.png",
        alt: "Block Ninja obstacle movement during gameplay",
        caption:
          "Obstacle movement and collision mechanics",
      },
      {
        src: "/images/block-ninja/block-ninja-03.png",
        alt: "Block Ninja score and game over display",
        caption:
          "Score progression and game-state feedback",
      },
    ],

    isVisible: true,
  },

  {
    id: "sonic-air",
    number: "06",

    title: "SONIC BREEZE",
    shortTitle: "SONIC BREEZE",
    category: "ACOUSTICS & SIGNAL EXPERIMENTATION",
    liveDemo: "https://udayasutar97-sys.github.io/SONIC_BREEZE/",

    summary:
      "An experimental application that uses controlled sound output to investigate airflow produced by a speaker.",

    overview:
      "SONIC BREEZE provides minimum, medium and maximum operating modes that generate selected audio output through a speaker. The project explores how speaker movement and acoustic output can create physical air movement capable of interacting with a small flame.",

    motivation:
      "I wanted to experiment with the physical relationship between sound, speaker vibration and air displacement, turning an audio application into a real-world interactive demonstration.",

    contribution: [
      "Designed minimum, medium and maximum output modes.",
      "Experimented with audio frequencies and speaker response.",
      "Built the operating interface and mode controls.",
      "Tested physical airflow produced through speaker movement.",
      "Connected digital sound generation with a physical demonstration.",
    ],

    technologies: [
      "JavaScript",
      "Web Audio API",
      "HTML",
      "CSS",
      "Audio Frequencies",
      "Acoustic Experimentation",
    ],

    highlights: [
      "Real-world physical output",
      "Three selectable intensity modes",
      "Audio-frequency experimentation",
      "Interactive acoustic demonstration",
    ],

    status: "EXPERIMENTAL PROJECT",
    visual: "sound",

    repository:
      "https://github.com/udayasutar97-sys/SONIC_BREEZE",

    images: [
      {
        src: "/images/sonic-air/sonic-air-01.png",
        alt: "SONIC BREEZE interface with minimum medium and maximum modes",
        caption:
          "Starting Page",
      },
      {
        src: "/images/sonic-air/sonic-air-02.png",
        alt: "SONIC BREEZE audio frequency controls",
        caption:
          "Sound-output and frequency operating modes",
      },
      {
        src: "/images/sonic-air/sonic-air-03.png",
        alt: "SONIC BREEZE physical flame interaction demonstration",
        caption:
          "Physical airflow explanation",
      },
    ],

    isVisible: true,
  },

  {
    id: "weatherx",
    number: "07",

    title: "WEATHERX",
    shortTitle: "WEATHERX",
    category: "API & DATA VISUALISATION",
    liveDemo:"https://udayasutar97-sys.github.io/weatherx/",

    summary:
      "A responsive weather application that presents current conditions and forecast information through a clear interactive interface.",

    overview:
      "WeatherX retrieves weather information for a selected location and converts raw forecast data into an accessible visual experience. It focuses on API integration, asynchronous data handling and responsive interface design.",

    motivation:
      "I built WeatherX to practise working with live external data, handling changing application states and presenting complex forecast information in a simple form.",

    contribution: [
      "Integrated live weather information.",
      "Implemented location-based weather lookup.",
      "Built loading, error and successful-result states.",
      "Created responsive forecast and condition displays.",
      "Converted API data into readable interface components.",
    ],

    technologies: [
      "JavaScript",
      "Weather API",
      "HTML",
      "CSS",
      "Async Requests",
      "Responsive Design",
    ],

    highlights: [
      "Live weather information",
      "Location-based lookup",
      "Responsive forecast interface",
      "External API integration",
    ],

    status: "COMPLETED PROJECT",
    visual: "weather",

    repository:
      "https://github.com/udayasutar97-sys/weatherx",

    images: [
      {
        src: "/images/weatherx/weatherx-01.png",
        alt: "WeatherX current weather and location display",
        caption:
          "Current weather and location overview",
      },
      {
        src: "/images/weatherx/weatherx-02.png",
        alt: "WeatherX forecast and weather metrics",
        caption:
          "Forecast information and weather metrics",
      },
      {
        src: "/images/weatherx/weatherx-03.png",
        alt: "WeatherX responsive mobile and desktop layouts",
        caption:
          "Hourly and daily forecast with responsive design",
      },
    ],

    isVisible: true,
  },
];

export const visibleProjects = projects.filter(
  (project) => project.isVisible,
);

export function getProject(projectId: string) {
  return projects.find(
    (project) => project.id === projectId,
  );
}