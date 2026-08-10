import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper to initialize Gemini SDK safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
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
      return res.status(400).json({ error: "toolType is required" });
    }

    const ai = getGeminiClient();

    let prompt = "";
    let systemInstruction = "You are a world-class social media strategist, YouTube growth expert, and viral content creator. Produce crisp, high-converting, creative content without filler phrases like 'Sure, here is your content'. Output well-formatted response.";

    if (toolType === "youtube_title") {
      prompt = `Generate 5 high-CTR YouTube title ideas for:
Topic/Idea: "${inputs.topic || ''}"
Niche: ${inputs.niche || 'General'}
Target Audience: ${inputs.audience || 'General Viewers'}
Desired Tone: ${inputs.tone || 'High CTR'}

For each title, provide:
1. The catchy Title string (under 60 characters preferred)
2. Estimated CTR Score (out of 100)
3. Psychological Trigger / Angle (e.g. Curiosity, Fear Of Missing Out, Direct Benefit, Controversy)
4. Suggested Thumbnail Text (2-4 words MAX to pair with this title)

Return the response as a JSON object with this exact structure:
{
  "titles": [
    {
      "title": "Title text here",
      "ctrScore": 94,
      "angle": "Curiosity Gap",
      "thumbnailText": "DON'T DO THIS",
      "characterCount": 42
    }
  ],
  "proTip": "A 1-sentence growth tip for this video concept"
}`;
    } else if (toolType === "caption_generator") {
      prompt = `Write a viral social media caption for:
Topic/Concept: "${inputs.topic || ''}"
Target Platform: ${inputs.platform || 'Instagram'}
Tone of Voice: ${inputs.tone || 'Engaging'}
Call to Action: ${inputs.cta || 'Engage in comments'}
Key Takeaways/Context: "${inputs.context || ''}"

Please format the response with:
- An attention-grabbing Hook line (first sentence)
- Well-spaced body content with relevant emojis and line breaks
- Clear Call-To-Action (CTA)
- 5 targeted, high-performing hashtags at the bottom

Return a JSON object:
{
  "hook": "First line hook here",
  "fullCaption": "Full formatted caption ready to copy...",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "engagementScore": "Estimated 9/10",
  "bestTimeToPostAdvice": "Short 1-line tip on when to post this"
}`;
    } else if (toolType === "script_outline") {
      prompt = `Create a complete video script outline for:
Topic: "${inputs.topic || ''}"
Format/Length: ${inputs.format || 'YouTube (5-10 min)'}
Target Audience: ${inputs.audience || 'General'}
Core Goal: ${inputs.goal || 'Educational & Entertaining'}

Provide a structured Markdown breakdown containing:
1. **HOOK (0:00 - 0:05)**: Pattern interrupt verbal line + Visual/B-roll cue.
2. **THE PROMISE (0:05 - 0:20)**: Why they should watch until the end.
3. **CORE SEGMENTS**:
   - **Segment 1**: Key Point + On-Screen Graphic/B-Roll suggestion + Script notes.
   - **Segment 2**: Key Point + On-Screen Graphic/B-Roll suggestion + Script notes.
   - **Segment 3**: Key Point + On-Screen Graphic/B-Roll suggestion + Script notes.
4. **RETENTION BOOST / MID-VIDEO RE-HOOK**: A surprise element or question.
5. **CALL TO ACTION & OUTRO**: Natural segue into next video or subscribe prompt.

Return the response as JSON:
{
  "title": "Working Title",
  "estimatedDuration": "Format duration",
  "markdownScript": "Markdown content here...",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}`;
    } else if (toolType === "viral_hooks") {
      prompt = `Generate 5 viral video hooks for short-form video (Reels/TikTok/Shorts):
Video Concept: "${inputs.topic || ''}"
Value/Target Outcome: "${inputs.value || ''}"

Provide 5 different angles:
1. **Pattern Interrupt** (Stop scrolling, unexpected statement)
2. **Bold Claim** (Results-first, shocking stat or outcome)
3. **Story Teaser** (Relatable struggle to solution)
4. **Secret/Hack** ("The hidden setting nobody talks about...")
5. **Mistake Avoidance** ("Stop doing this immediately if you want...")

Return JSON:
{
  "hooks": [
    {
      "angleName": "Pattern Interrupt",
      "verbalHook": "Exact line to speak in first 2 seconds",
      "visualAction": "On-screen motion/gesture/b-roll idea",
      "textOverlay": "3-word text on screen"
    }
  ]
}`;
    } else if (toolType === "hashtag_generator") {
      prompt = `Generate an SEO keyword and hashtag package for:
Topic/Niche: "${inputs.topic || ''}"
Platform: ${inputs.platform || 'Instagram & TikTok'}

Provide:
1. **Massive Reach Hashtags** (1M+ posts) - 5 tags
2. **Targeted Niche Hashtags** (50k - 500k posts) - 5 tags
3. **Low Competition / High Conversion Hashtags** (<50k posts) - 5 tags
4. **Top 10 SEO Search Keywords** for caption/transcript optimization

Return JSON:
{
  "massiveReach": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "targetedNiche": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "lowCompetition": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "seoKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5", "keyword 6", "keyword 7", "keyword 8", "keyword 9", "keyword 10"],
  "copyAllHashtagsString": "#tag1 #tag2 ... (all 15 combined)"
}`;
    } else if (toolType === "content_repurposer") {
      prompt = `Repurpose this core content into 4 distinct social media formats:
Source Content: "${inputs.sourceText || ''}"

Generate:
1. **Twitter/X Thread**: 4-5 connected tweets.
2. **LinkedIn Post**: Professional story/insight format with bullet points and strong spacing.
3. **Instagram Carousel Outline**: 5 Slide breakdown (Slide 1 Hook, Slide 2-4 Value, Slide 5 CTA).
4. **Short Video Script (Reel/Short)**: 30-40 second talking head script.

Return JSON:
{
  "twitterThread": ["Tweet 1 text...", "Tweet 2 text...", "Tweet 3 text...", "Tweet 4 text...", "Tweet 5 text..."],
  "linkedInPost": "Full formatted LinkedIn post...",
  "instagramCarousel": [
    { "slideNumber": 1, "title": "Slide Title", "content": "Bullet points or text" },
    { "slideNumber": 2, "title": "Slide Title", "content": "Bullet points or text" },
    { "slideNumber": 3, "title": "Slide Title", "content": "Bullet points or text" },
    { "slideNumber": 4, "title": "Slide Title", "content": "Bullet points or text" },
    { "slideNumber": 5, "title": "Slide Title", "content": "CTA Slide content" }
  ],
  "shortVideoScript": "Short video script..."
}`;
    } else {
      // Fallback
      prompt = `Generate creative content based on request: ${JSON.stringify(inputs)}`;
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
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI content",
    });
  }
});

async function startServer() {
  // Vite middleware for development mode
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
