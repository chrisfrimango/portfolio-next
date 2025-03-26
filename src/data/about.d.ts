declare module "*/about.json" {
  export interface AboutContent {
    id: number;
    description: string;
  }

  export interface AboutData {
    content: AboutContent[];
  }

  const value: AboutData;
  export default value;
}
