import type { Locale } from "@/lib/audit/types";

export type ServicePackage = {
  name: string;
  description: string;
  timing: string;
  price: string;
  featured?: boolean;
  includes: string[];
};

export type TeamMember = {
  initials: string;
  name: string;
  role: string;
  bio: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  timing: string;
  copy: string;
  output: string;
};

export const navItems = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/who-we-help", label: "Who we help" },
  { href: "/why-nbt", label: "Why NBT" },
  { href: "/case-studies", label: "Results" },
];

export const servicePackages: Record<Locale, ServicePackage[]> = {
  fr: [
    {
      name: "Audit de processus et d'automatisation",
      description:
        "Une vue claire d'un processus clé, de son coût caché et du meilleur ordre d'amélioration.",
      timing: "2 à 3 semaines",
      price: "4 500 $ – 6 500 $",
      includes: [
        "Entrevues avec l'équipe et cartographie du processus",
        "Mesure de départ : temps, erreurs, transferts",
        "Plan d'amélioration priorisé",
        "Soumission d'implantation à portée fixe",
      ],
    },
    {
      name: "Lancement du noyau Odoo",
      description:
        "Une base opérationnelle ciblée pour les processus que votre équipe utilise tous les jours.",
      timing: "6 à 10 semaines",
      price: "18 000 $ – 30 000 $",
      featured: true,
      includes: [
        "Deux à quatre applications Odoo de base",
        "Rôles, tests et import de données convenu",
        "Formation de l'équipe et documentation",
        "30 jours de soutien après le lancement",
      ],
    },
    {
      name: "Transformation des opérations",
      description:
        "Une implantation multiéquipe pour un processus connecté qui traverse les systèmes et les services.",
      timing: "10 à 18 semaines",
      price: "35 000 $ – 65 000 $",
      includes: [
        "Quatre à huit applications Odoo",
        "Migration de données définie",
        "Une ou deux intégrations ou automatisations",
        "Formation et soutien à la mise en service",
      ],
    },
    {
      name: "Sprint d'automatisation",
      description:
        "Éliminer un bloc précis de travail répétitif sans en faire un projet sans fin.",
      timing: "3 à 5 semaines",
      price: "7 500 $ – 15 000 $",
      includes: [
        "Un à trois processus en production",
        "Gestion des erreurs et révision humaine",
        "Surveillance et documentation",
        "Mesure avant-après chiffrée",
      ],
    },
    {
      name: "Projet pilote d'IA pour les opérations",
      description:
        "Valider un agent ou un cas d'usage documentaire bien délimité sur des données encadrées avant de l'étendre.",
      timing: "5 à 8 semaines",
      price: "15 000 $ – 35 000 $",
      includes: [
        "Un cas d'usage en production",
        "Droits d'accès et contrôles d'approbation",
        "Évaluation, journalisation et transfert",
        "Recommandation : étendre ou arrêter",
      ],
    },
    {
      name: "Amélioration continue",
      description:
        "Une capacité mensuelle réservée pour faire évoluer le système au rythme de l'entreprise.",
      timing: "Mensuel",
      price: "2 500 $ – 7 500 $/mois",
      includes: [
        "Surveillance et petites améliorations",
        "Capacité de livraison réservée",
        "Plan d'amélioration trimestriel",
        "Suivi d'avancement en langage clair",
      ],
    },
  ],
  en: [
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
  ],
};

export const team: Record<Locale, TeamMember[]> = {
  fr: [
    {
      initials: "HS",
      name: "Hafid Saadi",
      role: "Spécialiste de l'automatisation et de l'IA",
      bio: "Formé en génie logiciel à 42 Québec, Hafid travaille en Python, en TypeScript et avec des outils d'automatisation, avec un accent sur l'IA, l'optimisation des processus et le DevOps.",
    },
    {
      initials: "SD",
      name: "Shawn Daswani",
      role: "Stratégie de performance et de technologie",
      bio: "Ingénieur industriel de Polytechnique Montréal, Shawn traduit les processus d'affaires en systèmes concrets qui fonctionnent.",
    },
    {
      initials: "RD",
      name: "Reetesh Dooleea",
      role: "Développement full-stack",
      bio: "Développeur full-stack titulaire d'un B. Ing. en génie logiciel et d'une M. Ing. en génie informatique, Reetesh apporte une solide expérience frontend, backend et infonuagique à des systèmes fiables et centrés sur l'utilisateur.",
    },
  ],
  en: [
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
  ],
};

export const processSteps: Record<Locale, ProcessStep[]> = {
  fr: [
    {
      number: "01",
      title: "Appel de découverte",
      timing: "Gratuit · 20 minutes",
      copy: "On vous demande comment votre processus fonctionne aujourd'hui, quels outils vous utilisez et ce qui vous coûte réellement du temps. Aucune présentation de vente. On regarde simplement si on est les bonnes personnes pour vous.",
      output: "Un verdict clair et la prochaine étape",
    },
    {
      number: "02",
      title: "Audit de processus et d'automatisation",
      timing: "2 à 3 semaines",
      copy: "On cartographie votre processus actuel, on chiffre le travail manuel et on vous remet un plan priorisé qui vous appartient, que vous nous confiiez la suite ou non. L'audit est gratuit pour les clients fondateurs.",
      output: "Votre cartographie de processus et votre plan priorisé",
    },
    {
      number: "03",
      title: "Implantation",
      timing: "Prix et échéancier fixes",
      copy: "On configure Odoo autour de votre processus amélioré, avec les automatisations et les intégrations retenues à l'audit. Vous connaissez le coût et la date de mise en service avant qu'on commence.",
      output: "Un système testé, à coût et à date fixes",
    },
    {
      number: "04",
      title: "Mise en service",
      timing: "Lancement + formation",
      copy: "La formation et le soutien à la mise en service sont inclus. On lance le processus amélioré, on accompagne votre équipe pendant la transition et on s'assure que le système tient la route dans le vrai monde.",
      output: "Un système en service que votre équipe utilise avec confiance",
    },
    {
      number: "05",
      title: "Croître",
      timing: "En continu · selon les besoins",
      copy: "Une fois le noyau en place, la plupart des clients ajoutent de l'automatisation et de l'IA par petits morceaux : un processus ici, un agent là. On gère ça par forfait mensuel, pas par un autre gros projet.",
      output: "Un chemin graduel vers plus d'automatisation et d'intelligence",
    },
  ],
  en: [
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
  ],
};
