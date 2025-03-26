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
  category: string;
}

export interface ProjectsData {
  projects: Project[];
}
