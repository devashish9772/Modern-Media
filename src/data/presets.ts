import { PresetIdea } from '../types';

export const PRESET_IDEAS: PresetIdea[] = [
  {
    id: 'p1',
    title: 'AI Coding Tools Review',
    niche: 'Tech & AI',
    toolId: 'youtube_title',
    inputs: {
      topic: 'I tested 5 AI coding assistants for 30 days to see which one builds real fullstack web apps best.',
      niche: 'Tech & Programming',
      audience: 'Developers & Tech Enthusiasts',
      tone: 'Curiosity Gap',
    },
  },
  {
    id: 'p2',
    title: 'Minimalist Desk Setup',
    niche: 'Productivity',
    toolId: 'caption_generator',
    inputs: {
      topic: 'Clean aesthetic desk setup for remote software engineering and deep work',
      platform: 'Instagram',
      tone: 'Casual & Inspiring',
      cta: 'Save this post for setup inspiration!',
      context: 'Ergonomic light, wireless mechanical keyboard, cable management box, monitor arm',
    },
  },
  {
    id: 'p3',
    title: 'Morning Productivity Habits',
    niche: 'Self Improvement',
    toolId: 'viral_hooks',
    inputs: {
      topic: '5 morning habits that doubled my daily focus and energy',
      value: 'Stop feeling exhausted at 2 PM and get 4 hours of deep work done before noon',
    },
  },
  {
    id: 'p4',
    title: 'How to Build a SaaS App',
    niche: 'Software & Business',
    toolId: 'script_outline',
    inputs: {
      topic: 'How to build and launch a SaaS application from scratch with modern stack',
      format: 'YouTube (10-15 min)',
      audience: 'Intermediate Developers & Indie Hackers',
      goal: 'Actionable Step-by-Step Guide',
    },
  },
  {
    id: 'p5',
    title: 'Indie Hacker Story',
    niche: 'Business & Startup',
    toolId: 'content_repurposer',
    inputs: {
      sourceText: 'I built a simple micro-SaaS tool in 48 hours without spending money on marketing. By sharing my journey building in public on Twitter and Reddit, I got my first 100 paying customers in 2 weeks. The key lesson is solving 1 painful problem instead of building 5 average features.',
    },
  },
  {
    id: 'p6',
    title: 'Fitness & Home Workouts',
    niche: 'Fitness',
    toolId: 'hashtag_generator',
    inputs: {
      topic: 'Calisthenics full body workout routine at home without equipment',
      platform: 'Instagram & TikTok',
    },
  },
];
