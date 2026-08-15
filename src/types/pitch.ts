export type SlideLayout = 
  | 'title' 
  | 'problem' 
  | 'solution' 
  | 'market' 
  | 'product' 
  | 'business-model' 
  | 'traction' 
  | 'competition' 
  | 'team' 
  | 'financials' 
  | 'the-ask' 
  | 'quote' 
  | 'stats-grid' 
  | 'two-column' 
  | 'timeline';

export type DeckThemeId = 
  | 'midnight' 
  | 'minimal-light' 
  | 'silicon-slate' 
  | 'emerald-venture' 
  | 'crimson-bold' 
  | 'cyber-gradient';

export interface DeckTheme {
  id: DeckThemeId;
  name: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
  secondaryAccent: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  isDark: boolean;
  fontHeading: string;
  fontBody: string;
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  change?: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

export interface CompetitorComparison {
  feature: string;
  us: boolean | string;
  comp1: boolean | string;
  comp2: boolean | string;
  comp3: boolean | string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface Slide {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  tagline?: string;
  contentPoints?: string[];
  metrics?: MetricItem[];
  teamMembers?: TeamMember[];
  competitors?: {
    ourName: string;
    competitorNames: [string, string, string];
    rows: CompetitorComparison[];
  };
  marketSize?: {
    tam: string;
    tamDesc: string;
    sam: string;
    samDesc: string;
    som: string;
    somDesc: string;
  };
  chartData?: {
    type: 'bar' | 'area' | 'pie';
    title: string;
    data: ChartDataPoint[];
  };
  quote?: {
    text: string;
    author: string;
    role: string;
  };
  speakerNotes?: string;
  imageUrl?: string;
  imageCaption?: string;
  simulatedInvestorQuestions?: {
    question: string;
    suggestedAnswer: string;
  }[];
}

export interface PitchDeck {
  id: string;
  title: string;
  tagline: string;
  companyName: string;
  industry: string;
  targetAudience: string;
  fundingGoal?: string;
  themeId: DeckThemeId;
  slides: Slide[];
  createdAt: number;
  updatedAt: number;
  isPublic?: boolean;
  authorId?: string;
  authorEmail?: string;
}

export interface GenerateDeckRequest {
  companyName: string;
  industry: string;
  problemStatement: string;
  solutionStatement: string;
  businessModel?: string;
  targetMarket?: string;
  tractionOrStats?: string;
  fundingAsk?: string;
  tone?: 'investor-ready' | 'storytelling' | 'technical' | 'high-growth' | 'bold-visionary';
  themeId?: DeckThemeId;
  slideCount?: number;
}

export interface AIAssistRequest {
  action: 'rewrite' | 'shorten' | 'expand' | 'investor-questions' | 'speaker-notes' | 'market-calc';
  slide: Slide;
  deckContext: {
    companyName: string;
    industry: string;
    tagline: string;
  };
  instruction?: string;
}
