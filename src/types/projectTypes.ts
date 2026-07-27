export interface CaseStudySection {
  title: string;
  text: string;
}

export interface CaseStudy {
  role: string;
  year: string;
  problem: string;
  approach: string;
  craft: CaseStudySection[];
  outcome: string;
  reflection: string;
}

export interface Project {
  id: number;
  title: string;
  name: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  features: string[];
  category?: string;
  caseStudy?: CaseStudy;
}

export interface ProjectsData {
  projects: Project[];
}
