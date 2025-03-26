interface AboutContent {
  title: string;
  description: string;
}

interface AboutData {
  content: AboutContent[];
}

export type { AboutContent, AboutData };

interface TextSectionProps {
  children?: React.ReactNode;
  title?: string;
  italicText?: string;
  descriptionSection1?: string;
  descriptionSection2?: string;
  descriptionSection3?: string;
}

export type { TextSectionProps };
