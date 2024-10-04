import * as testContentImports from '../test-content';

export interface TestContent {
  title: string;
  description: string;
  alt: string;
  link: string;
  linkText: string;
  content: string;
  quiz: string;
}

export const testContent: TestContent[] = Object.values(testContentImports).flat();