export interface Achievement {
  id: string;
  title: string;
  organization: string;
  category: string;
  description: string;
  metric: string;
  accent: string;
}

export const achievements: Achievement[] = [
  {
    id: "uiux",
    title: "World Rank #1",
    organization: "Global UI/UX Challenge WhiteHat Jr.",
    category: "Design",
    metric: "Highest Points Achieved",
    accent: "cyan",
    description:
      "Achieved the highest score globally in a competitive UI/UX design challenge.",
  },

  {
    id: "science",
    title: "Physics Fair Champion",
    organization: "School Physics Fair",
    category: "Innovation and Research",
    metric: "5 Consecutive Years",
    accent: "blue",
    description:
      "Winner of the annual science exhibition across all class groups for five consecutive years 4 of which were on Quantum Physics and Quantum Computing.",
  },

  {
    id: "computer",
    title: "Computer Fair Champion",
    organization: "School Technology Fair",
    category: "Programming",
    metric: "5 Consecutive Years",
    accent: "purple",
    description:
      "Won the annual computer exhibition and programming showcase for five consecutive years.",
  },

  {
    id: "rank",
    title: "Class Rank #1",
    organization: "Academic Excellence",
    category: "Academics",
    metric: "GPA 5.0 / 5.0",
    accent: "gold",
    description:
      "Maintained first rank in class while achieving a perfect GPA.",
  },

  {
    id: "blackbelt",
    title: "Black Belt",
    organization: "Taekwondo",
    category: "Martial Arts",
    metric: "Dan Certification",
    accent: "red",
    description:
      "Earned Black Belt through years of disciplined training and competition.",
  },

  {
    id: "state",
    title: "State Champion",
    organization: "Taekwondo",
    category: "Competition",
    metric: "State Level",
    accent: "orange",
    description:
      "State-level Taekwondo champion representing school and district.",
  },

  {
    id: "uci",
    title: "UCI Elite Cyclist",
    organization: "Cycling Federation",
    category: "Sport",
    metric: "Elite Category",
    accent: "green",
    description:
      "Competes in the UCI Elite category in road cycling events.",
  },

  {
    id: "tourde",
    title: "Tour de Thar",
    organization: "Cycling Federation of India",
    category: "National Race",
    metric: "State Representative",
    accent: "teal",
    description:
      "Represented the state in the prestigious Tour de Thar road cycling race.",
  },

  {
    id: "calc",
    title: "HarvardX Applied Calculus",
    organization: "Harvard University (HarvardX — edX)",
    category: "Advanced Coursework",
    metric: "Academic Performance • GPA :4.0 / 4.0",
    accent: "pink",
    description:
      "Successfully completed university-level Applied Calculus with a perfect GPA.",
  },

  {
  id: "qc1",
  title: "Quantum Computer Systems Design I",
  organization:
    "University of Chicago (UChicagoX — edX)",
  category: "Advanced Coursework",
  metric: "Academic Performance • GPA: 4.0 / 4.0",
  accent: "indigo",
  description:
    "Completed the first course in the advanced Quantum Computer Systems Design sequence with excellent academic performance.",
},

{
  id: "qc2",
  title: "Quantum Computer Systems Design II",
  organization:
    "University of Chicago (UChicagoX — edX)",
  category: "Advanced Coursework",
  metric: "Academic Performance • GPA: 3.0 / 4.0",
  accent: "violet",
  description:
    "Continued advanced study of quantum computer architecture, computation and system-design principles.",
},

{
  id: "qc3",
  title: "Quantum Computer Systems Design III",
  organization:
    "University of Chicago (UChicagoX — edX)",
  category: "Advanced Coursework",
  metric: "Academic Performance • GPA: 4.0 / 4.0",
  accent: "cyan",
  description:
    "Completed the final course in the advanced Quantum Computer Systems Design sequence with excellent academic performance.",
},

  {
    id: "cs50",
    title: "CS50 Web Programming",
    organization: "Harvard University(HarvardX-CS50W — edX)",
    category: "Advanced Coursework",
    metric: "Academic Performance • GPA: 4.0 / 4.0",
    accent: "blue",
    description:
      "Completed Harvard's CS50 Web Programming with Python and JavaScript with a perfect GPA.",
  },
];