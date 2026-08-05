export type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  category: string;
  salary: string;
  posted: string;
  source: string;
  type: string;
  level: string;
  skills: string[];
  missing: string[];
  match: number;
};

export const jobs: Job[] = [
  {
    id: 1,
    title: "Account Manager",
    company: "Quanta",
    location: "Hyderabad, IN",
    category: "Sales",
    salary: "$74k - $140k",
    posted: "9d ago",
    source: "Company Site",
    type: "Onsite",
    level: "Entry",
    skills: ["Statistics", "Tableau", "Marketing", "TypeScript"],
    missing: ["SQL"],
    match: 94,
  },
  {
    id: 2,
    title: "Customer Support Specialist",
    company: "Voltage",
    location: "Hyderabad, IN",
    category: "Support",
    salary: "$110k - $139k",
    posted: "18d ago",
    source: "LinkedIn",
    type: "Remote",
    level: "Senior",
    skills: ["Python", "Tableau", "Communication", "TypeScript", "Figma"],
    missing: ["Power BI"],
    match: 94,
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "Quanta",
    location: "Singapore",
    category: "Support",
    salary: "$60k - $120k",
    posted: "11d ago",
    source: "Company Site",
    type: "Hybrid",
    level: "Mid",
    skills: ["AWS", "Docker", "CI/CD", "Linux"],
    missing: ["Kubernetes"],
    match: 88,
  },
  {
    id: 4,
    title: "Finance Analyst",
    company: "Brightfield",
    location: "Berlin, DE",
    category: "Finance",
    salary: "$44k - $138k",
    posted: "2d ago",
    source: "LinkedIn",
    type: "Onsite",
    level: "Entry",
    skills: ["Excel", "Accounting", "SQL", "Forecasting"],
    missing: ["Power BI"],
    match: 84,
  },
  {
    id: 5,
    title: "Digital Marketing Manager",
    company: "Acme Corp",
    location: "London, UK",
    category: "Marketing",
    salary: "$91k - $142k",
    posted: "20d ago",
    source: "Wellfound",
    type: "Remote",
    level: "Mid",
    skills: ["SEO", "CRM", "Analytics", "Copywriting"],
    missing: ["Performance Marketing"],
    match: 81,
  },
  {
    id: 6,
    title: "Senior Software Engineer",
    company: "Quanta",
    location: "Singapore",
    category: "Engineering",
    salary: "$55k - $132k",
    posted: "4d ago",
    source: "Indeed",
    type: "Hybrid",
    level: "Senior",
    skills: ["React", "Node.js", "TypeScript", "System Design"],
    missing: ["AWS"],
    match: 79,
  },
];

export const trendingRoles = [
  { rank: 1, role: "Data Analyst", openings: "12,400", growth: "+38%", momentum: 76 },
  { rank: 2, role: "Software Engineer", openings: "28,900", growth: "+29%", momentum: 58 },
  { rank: 3, role: "Digital Marketing Manager", openings: "8,600", growth: "+24%", momentum: 48 },
  { rank: 4, role: "Sales Executive", openings: "15,200", growth: "+21%", momentum: 42 },
  { rank: 5, role: "UI/UX Designer", openings: "7,400", growth: "+19%", momentum: 37 },
  { rank: 6, role: "Customer Support Specialist", openings: "9,800", growth: "+16%", momentum: 30 },
  { rank: 7, role: "HR Executive", openings: "5,300", growth: "+14%", momentum: 26 },
  { rank: 8, role: "Finance Analyst", openings: "6,100", growth: "+12%", momentum: 22 },
];

export const hiringByCategory = [
  { category: "Engineering", count: 38400, percent: 100 },
  { category: "Data", count: 21800, percent: 57 },
  { category: "Sales", count: 19200, percent: 50 },
  { category: "Marketing", count: 14600, percent: 38 },
  { category: "Design", count: 9700, percent: 25 },
  { category: "Finance", count: 8200, percent: 21 },
  { category: "HR", count: 5400, percent: 14 },
];

export const skills = [
  "Python",
  "SQL",
  "Excel",
  "React",
  "Power BI",
  "Communication",
  "Tableau",
  "TypeScript",
  "Figma",
  "Marketing",
];
