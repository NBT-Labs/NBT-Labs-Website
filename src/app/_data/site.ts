export type ServicePackage = {
  name: string;
  description: string;
  timing: string;
  price: string;
  featured?: boolean;
  includes: string[];
};

export const navItems = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/who-we-help", label: "Who we help" },
  { href: "/why-nbt", label: "Why NBT" },
  { href: "/case-studies", label: "Results" },
];

export const servicePackages: ServicePackage[] = [
  {
    name: "Process & Automation Audit",
    description:
      "A clear view of one core workflow, its hidden cost, and the best sequence of improvements.",
    timing: "2–3 weeks",
    price: "$4,500–$6,500",
    includes: [
      "Team interviews and workflow mapping",
      "Time, error, and handoff baseline",
      "Prioritized improvement roadmap",
      "Fixed-scope implementation proposal",
    ],
  },
  {
    name: "Odoo Core Launch",
    description:
      "A focused operating foundation for the workflows your team needs to run every day.",
    timing: "6–10 weeks",
    price: "$18,000–$30,000",
    featured: true,
    includes: [
      "Two to four core Odoo apps",
      "Roles, testing, and agreed data import",
      "Team training and documentation",
      "30 days of launch support",
    ],
  },
  {
    name: "Operations Transformation",
    description:
      "A multi-team implementation for a connected process that crosses systems and departments.",
    timing: "10–18 weeks",
    price: "$35,000–$65,000",
    includes: [
      "Four to eight Odoo apps",
      "Defined data migration",
      "One or two integrations or automations",
      "Training and go-live support",
    ],
  },
  {
    name: "Automation Sprint",
    description:
      "Remove a defined pocket of repetitive work without turning it into a never-ending project.",
    timing: "3–5 weeks",
    price: "$7,500–$15,000",
    includes: [
      "One to three production workflows",
      "Error handling and human review",
      "Monitoring and documentation",
      "Measured before-and-after baseline",
    ],
  },
  {
    name: "AI Operations Pilot",
    description:
      "Prove one bounded agent or knowledge use case on governed business data before scaling it.",
    timing: "5–8 weeks",
    price: "$15,000–$35,000",
    includes: [
      "One production use case",
      "Permissions and approval controls",
      "Evaluation, logging, and handoff",
      "Scale-or-stop recommendation",
    ],
  },
  {
    name: "Continuous Improvement",
    description:
      "Reserved monthly capacity to improve the system as the business and the opportunity evolve.",
    timing: "Monthly",
    price: "$2,500–$7,500/mo",
    includes: [
      "Monitoring and small enhancements",
      "Reserved delivery capacity",
      "Quarterly improvement roadmap",
      "Plain-language progress reporting",
    ],
  },
];

export const team = [
  {
    initials: "HS",
    name: "Hafid Saadi",
    role: "Automation and AI specialist",
    bio: "Trained at 42 Québec in software engineering, Hafid builds across Python, TypeScript, and automation tooling, with a focus on AI, process optimization, and DevOps.",
  },
  {
    initials: "SD",
    name: "Shawn Daswani",
    role: "Performance and technology strategy",
    bio: "An industrial engineer from Polytechnique Montréal, Shawn translates business processes into practical, working systems.",
  },
  {
    initials: "RD",
    name: "Reetesh Dooleea",
    role: "Full-stack engineering",
    bio: "A full-stack engineer with a B.Eng. in Software Engineering and M.Eng. in Computer Engineering, Reetesh brings deep frontend, backend, and cloud experience to reliable, user-centered systems.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Discovery call",
    timing: "Free · 20 minutes",
    copy: "We ask about your current process, the tools you use, and what is actually costing you time. There is no pitch. We simply figure out if we are a fit.",
    output: "A clear fit and next step",
  },
  {
    number: "02",
    title: "Process & automation audit",
    timing: "2–3 weeks",
    copy: "We map your current process, quantify the manual work, and hand you a prioritized roadmap that belongs to you, whether or not you hire us for the next step. The audit is free for founding clients.",
    output: "Your process map and prioritized roadmap",
  },
  {
    number: "03",
    title: "Implementation",
    timing: "Fixed price & timeline",
    copy: "We configure Odoo around your improved process, plus the automations and integrations identified in the audit. You know the cost and the go-live date before we start.",
    output: "A tested system with a fixed cost and date",
  },
  {
    number: "04",
    title: "Go live",
    timing: "Launch + training",
    copy: "Training and go-live support are included. We launch the improved process, support your team through the transition, and make sure the system works in the real world.",
    output: "A live system your team can use with confidence",
  },
  {
    number: "05",
    title: "Grow",
    timing: "Ongoing · as needed",
    copy: "Once the core is working, most clients add automation and AI incrementally, with a workflow here and an agent there. We handle this through a monthly retainer, not another big project.",
    output: "An incremental path to more automation and intelligence",
  },
];

export const contactTopics = ["General question", "Partnership", "Careers", "Other"];
