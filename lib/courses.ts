/** Other Azure certifications planned for this site. Shown as "coming soon" on the home page. */
export interface UpcomingCourse {
  code: string;
  title: string;
  level: "Fundamentals" | "Associate" | "Expert";
}

export const UPCOMING_COURSES: UpcomingCourse[] = [
  { code: "AZ-900", title: "Microsoft Azure Fundamentals", level: "Fundamentals" },
  { code: "AI-900", title: "Microsoft Azure AI Fundamentals", level: "Fundamentals" },
  { code: "AI-102", title: "Azure AI Engineer Associate", level: "Associate" },
  { code: "AZ-204", title: "Azure Developer Associate", level: "Associate" },
  { code: "AZ-104", title: "Azure Administrator Associate", level: "Associate" },
  { code: "DP-100", title: "Azure Data Scientist Associate", level: "Associate" },
];
