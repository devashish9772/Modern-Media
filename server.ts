import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper to initialize Gemini SDK safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// AI Generation Route
app.post("/api/generate", async (req, res) => {
  try {
    const { toolType, inputs } = req.body;

    if (!toolType) {
      return res.status(400).json({ success: false, error: "toolType is required" });
    }

    const ai = getGeminiClient();
    const lang = inputs.language || "English";

    let prompt = "";
    const systemInstruction = `You are Modern Media's elite AI Content Strategist & Media Producer. Output language MUST BE: ${lang}. Produce crisp, high-converting, viral content without conversational filler (like "Sure, here is your output"). Always return strict, valid JSON without extra markdown backticks if possible, or standard clean JSON.`;

    switch (toolType) {
      case "youtube_title": {
        prompt = `Generate AT LEAST 10 high-CTR YouTube title suggestions in ${lang} for:
Video Topic: "${inputs.topic || ''}"
Keywords: "${inputs.keywords || ''}"
Category: "${inputs.category || 'General'}"
Tone: "${inputs.tone || 'High CTR'}"
Target Audience: "${inputs.audience || 'General Viewers'}"

Generate at least 10 titles distributed across these 5 required categories:
1. "SEO" (SEO-friendly)
2. "Curiosity" (Curiosity-based / Gap)
3. "Professional" (Clean, authoritative)
4. "Short" (Punchy, under 45 chars)
5. "Emotional" (Relatable / High impact)

For each title, provide:
- title: string
- ctrScore: number (between 85 and 99)
- angle: string (e.g. "Curiosity Gap", "Keyword Dominance", "Pain Point")
- thumbnailText: string (2-4 punchy words for thumbnail overlay)
- categoryType: strictly one of ["SEO", "Curiosity", "Professional", "Short", "Emotional"]

Return JSON object:
{
  "titles": [
    {
      "title": "Title here...",
      "ctrScore": 96,
      "angle": "Curiosity Gap",
      "thumbnailText": "STOP DOING THIS",
      "categoryType": "Curiosity"
    }
  ],
  "proTip": "A 1-2 sentence pro growth tip for this video topic."
}`;
        break;
      }

      case "caption_generator": {
        prompt = `Generate engaging, platform-tailored social media captions in ${lang} for:
Topic/Idea: "${inputs.topic || ''}"
Platform Focus: "${inputs.platform || 'All Platforms (Instagram, YouTube, Facebook, Shorts, Reels)'}"
Desired Tone: "${inputs.tone || 'Engaging & Authentic'}"

Generate 5 distinct caption variations, each customized for:
1. Instagram
2. YouTube (Video / Community)
3. Facebook
4. YouTube Shorts
5. Instagram Reels

Return JSON object:
{
  "captions": [
    {
      "platform": "Instagram",
      "hook": "Scroll-stopping first line...",
      "text": "Full caption body formatted with line breaks, emojis, and valuable insights...",
      "cta": "Call to action line...",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }
  ]
}`;
        break;
      }

      case "description_generator": {
        prompt = `Generate a complete, high-ranking video description package in ${lang} for:
Topic: "${inputs.topic || ''}"
Platform: "${inputs.platform || 'YouTube'}"
Keywords: "${inputs.keywords || ''}"
Tone: "${inputs.tone || 'Professional & Informative'}"

Include:
1. SEO-friendly description (Detailed 2-3 paragraph description with keywords embedded)
2. Short description (2-sentence summary for preview cards / social shares)
3. Long description (Extended version with timestamp outline markers)
4. Call-to-action (Subscribe, comment, and link prompts)
5. Relevant keywords list (10 comma-separated keywords)
6. Relevant hashtags list (8-10 targeted hashtags)

Return JSON object:
{
  "seoDescription": "Full SEO description...",
  "shortDescription": "2-sentence punchy summary...",
  "longDescription": "Extended breakdown with chapter markers...",
  "callToAction": "Clear call to action string...",
  "keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}`;
        break;
      }

      case "hashtag_generator": {
        prompt = `Generate an optimized hashtag strategy in ${lang} for:
Topic/Niche: "${inputs.topic || ''}"
Platform: "${inputs.platform || 'Instagram / TikTok'}"

Group hashtags into 3 volume tiers:
1. Popular (High volume / broad reach, 5-8 tags)
2. Niche (Targeted community tags, 5-8 tags)
3. Long-tail (Specific low-competition conversion tags, 5-8 tags)

Also generate a combined copyAllString containing all hashtags separated by spaces.

Return JSON object:
{
  "popular": ["#popular1", "#popular2"],
  "niche": ["#niche1", "#niche2"],
  "longTail": ["#longtail1", "#longtail2"],
  "copyAllString": "#popular1 #popular2 #niche1 #niche2 #longtail1 #longtail2"
}`;
        break;
      }

      case "video_idea_generator": {
        const count = inputs.count || 5;
        prompt = `Generate ${count} unique, high-potential video/reel concepts in ${lang} for:
Topic/Niche: "${inputs.topic || ''}"
Platform: "${inputs.platform || 'YouTube / Reels / Shorts'}"

For each idea, provide:
- title: Catchy proposed video title
- hook: 3-second opening visual/verbal hook
- concept: Brief description of the plot, storytelling angle, or takeaway
- format: Recommended format (e.g., Talking Head with B-Roll, Screen Recording, Vlog Style, Skit, Side-by-Side Comparison)

Return JSON object:
{
  "ideas": [
    {
      "title": "Proposed Title",
      "hook": "Opening hook...",
      "concept": "Concept details...",
      "format": "Suggested format"
    }
  ]
}`;
        break;
      }

      case "script_generator": {
        prompt = `Write a complete, professional video script in ${lang} for:
Format/Style: "${inputs.style || inputs.platform || 'YouTube'}" (e.g. YouTube, Shorts, Reels, Documentary, Educational, Storytelling, Review)
Topic: "${inputs.topic || ''}"
Duration: "${inputs.duration || '5 minutes'}"
Tone: "${inputs.tone || 'Engaging & Authoritative'}"
Target Audience: "${inputs.audience || 'General Creators'}"

Structure the script cleanly with these exact sections:
- HOOK: Pattern-interrupt line and visual action
- INTRODUCTION: Theme statement, promise of value, and intro
- MAIN CONTENT: Step-by-step breakdown with visual/B-roll cues
- ENDING: Conclusion summary and retention loop
- CTA: Direct call to action (subscribe, comment, click link)

Return JSON object:
{
  "title": "Script Title",
  "platform": "${inputs.style || 'YouTube'}",
  "duration": "${inputs.duration || '5 mins'}",
  "hook": "Hook text & visual cue...",
  "introduction": "Intro content...",
  "mainContent": "Main body breakdown with timestamps & B-roll...",
  "ending": "Ending summary...",
  "callToAction": "Call to action..."
}`;
        break;
      }

      case "thumbnail_prompt": {
        prompt = `Generate an ultra-detailed AI image-generation prompt (for Midjourney v6 / DALL-E 3) in ${lang} for a high-CTR YouTube thumbnail based on:
Video Topic: "${inputs.topic || ''}"
Main Subject: "${inputs.subject || 'Expressive Creator holding tech gadget'}"
Mood/Vibe: "${inputs.mood || 'Dramatic & High Energy'}"
Style: "${inputs.style || '3D Digital Art / Photorealistic Hyper-detailed'}"
Platform: "${inputs.platform || 'YouTube Thumbnail'}"

DO NOT use copyrighted characters or imitate living artists' exact signature styles.

Break down the image parameters:
- composition: Framing, placement, rule of thirds
- subject: Foreground focal point, clothes, stance
- background: Background elements, environment, depth blur
- lighting: Studio lighting, rim light, glow effects
- cameraAngle: Wide angle, low angle, eye level
- colors: Vibrant color palette (e.g. Neon Amber & Deep Cyan)
- facialExpression: Expressive face (e.g. Shocked, Intense Focus)
- typographyPlacement: Recommended text placement & 2-3 word bold text
- aspectRatio: "16:9"
- detailInstructions: Complete consolidated prompt string ready to copy into Midjourney/DALL-E.

Return JSON object:
{
  "prompt": "Full consolidated prompt string...",
  "composition": "Composition details...",
  "subject": "Subject details...",
  "background": "Background details...",
  "lighting": "Lighting details...",
  "cameraAngle": "Camera angle...",
  "colors": "Color palette...",
  "facialExpression": "Facial expression...",
  "typographyPlacement": "Text overlay placement...",
  "aspectRatio": "16:9",
  "detailInstructions": "Rendering engine parameters (--ar 16:9 --v 6.0 --style raw)"
}`;
        break;
      }

      case "seo_keyword": {
        prompt = `Generate an exhaustive SEO Keyword research package in ${lang} for:
Topic: "${inputs.topic || ''}"
Platform: "${inputs.platform || 'YouTube & Google Search'}"

Generate:
1. Primary Keywords (5 high-volume seed keywords)
2. Secondary Keywords (8 supporting semantic keywords)
3. Long-Tail Keywords (8 specific query phrases)
4. Search-Intent Suggestions (5 user questions & problem intent queries)

Also provide copyAllString combining all keywords cleanly.

Return JSON object:
{
  "primaryKeywords": ["kw1", "kw2"],
  "secondaryKeywords": ["kw1", "kw2"],
  "longTailKeywords": ["kw1", "kw2"],
  "searchIntentSuggestions": ["query 1", "query 2"],
  "copyAllString": "kw1, kw2, kw3..."
}`;
        break;
      }

      case "content_hook": {
        prompt = `Generate 6 high-converting opening hooks in ${lang} for:
Topic: "${inputs.topic || ''}"
Target Platform: "${inputs.platform || 'Shorts / Reels / TikTok'}"

Provide 1 hook for each of these 6 required categories:
1. "Curiosity"
2. "Question"
3. "Story"
4. "Emotional"
5. "Educational"
6. "Unexpected fact"

Return JSON object:
{
  "hooks": [
    {
      "category": "Curiosity",
      "platform": "${inputs.platform || 'Reels'}",
      "hookText": "Opening spoken line...",
      "reason": "Why this hook triggers dopamine and stops scrolling"
    }
  ]
}`;
        break;
      }

      case "content_improver": {
        prompt = `Analyze and improve this content text in ${lang}:
Original Text: "${inputs.originalText || ''}"
Improvement Goal: "${inputs.option || 'Make it more engaging, concise & professional'}"

Provide:
1. improvedText: Fully rewritten, polished text
2. changesMade: List of 3-4 specific edits (e.g. "Removed passive voice", "Enhanced hook punchiness", "Optimized line breaks")
3. summary: Short 1-sentence explanation of why the improved version performs better.

Return JSON object:
{
  "originalText": "${inputs.originalText || ''}",
  "improvedText": "Enhanced text...",
  "changesMade": ["Edit 1", "Edit 2", "Edit 3"],
  "summary": "Summary of enhancements..."
}`;
        break;
      }

      default: {
        prompt = `Generate creative media output for: ${JSON.stringify(inputs)}`;
        break;
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const textOutput = response.text || "{}";
    let parsedData = {};
    try {
      parsedData = JSON.parse(textOutput);
    } catch (e) {
      parsedData = { rawText: textOutput };
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    const errorMessage = error?.status === 429 || error?.message?.includes("quota")
      ? "AI usage limit reached. Please try again later or configure another supported API/model."
      : error.message || "Failed to generate AI content.";

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

// AI Chat Route for Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userMessage } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are Modern Media's AI Media Assistant. You specialize in YouTube growth, social media strategy, video scripting, SEO, thumbnail prompts, and content planning. Give concise, actionable, creator-focused advice with clear bullet points, title ideas, or script frameworks when asked.`;

    const formattedHistory = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // Add current user message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: userMessage || 'Hello' }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: formattedHistory,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || "I'm here to help with your media content strategy!";
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    const errorMessage = error?.status === 429 || error?.message?.includes("quota")
      ? "AI usage limit reached. Please try again later or configure another supported API/model."
      : error.message || "Failed to generate AI chat response.";

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
