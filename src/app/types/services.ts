type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  heroImage: string;
  intro: string;
  whoItsFor: string[];
  highlights: string[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
};