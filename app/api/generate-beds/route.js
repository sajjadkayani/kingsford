import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OUTPUT_DIR = path.join(process.cwd(), "public/beds");
const REFERENCE_DIR = path.join(process.cwd(), "reference");
const PROGRESS_FILE = path.join(process.cwd(), "progress.json");

const REFERENCE_IMAGES = {
  wingback: "wingback.png",
  ottoman: "ottoman.png",
  panel: "panel.png",
  sleigh: "sleigh.png",
  divan: "divan.png",
  chesterfield: "chesterfield.png",
  "low-profile": "low-profile.png",
};

const STYLE_DESCRIPTIONS = {
  wingback: "wingback bed with tall dramatic winged headboard",
  ottoman: "ottoman bed with lift-up storage base",
  panel: "panel bed with clean straight headboard",
  sleigh: "sleigh bed with curved scroll headboard and footboard",
  divan: "divan bed with storage base",
  chesterfield: "chesterfield bed with deep diamond button tufted headboard",
  "low-profile": "low profile bed with minimal flat platform headboard",
};

const FABRIC_DESCRIPTIONS = {
  velvet: "rich soft velvet upholstery fabric with subtle sheen",
  linen: "natural woven linen upholstery fabric with textured weave",
  chenille: "soft textured chenille upholstery fabric with warm pile",
  "faux-leather": "sleek smooth faux leather upholstery with modern finish",
};

const LEG_DESCRIPTIONS = {
  chrome: "polished chrome silver metal legs",
  gold: "brushed gold brass metal legs",
  wooden: "natural oak wooden legs with light wood grain finish",
};

const STYLES = [
  "wingback",
  "ottoman",
  "panel",
  "sleigh",
  "divan",
  "chesterfield",
  "low-profile",
];
const FABRICS = ["velvet", "linen", "chenille", "faux-leather"];
const LEGS = ["chrome", "gold", "wooden"];

const ALL_JOBS = [];
for (const style of STYLES) {
  for (const fabric of FABRICS) {
    for (const legs of LEGS) {
      ALL_JOBS.push({ style, fabric, legs });
    }
  }
}

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
  }
  return { completed: [], failed: [] };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function getKey(job) {
  return `${job.style}-${job.fabric}-${job.legs}`;
}

async function generateImage(job) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
    generationConfig: { responseModalities: ["Text", "Image"] },
  });

  const refPath = path.join(REFERENCE_DIR, REFERENCE_IMAGES[job.style]);
  if (!fs.existsSync(refPath))
    throw new Error(`Reference not found: ${refPath}`);

  const base64Image = fs.readFileSync(refPath).toString("base64");

  const prompt = `
Using the provided reference image as your EXACT guide:
- Keep IDENTICAL: camera angle, lighting, background, bed proportions, headboard shape
- Bed style: ${STYLE_DESCRIPTIONS[job.style]}
- Change fabric to: ${FABRIC_DESCRIPTIONS[job.fabric]}
- Change legs to: ${LEG_DESCRIPTIONS[job.legs]}
- Background: match reference exactly
- Quality: professional furniture product photography, photorealistic, 4K
- No text, watermarks or logos
`;

  const result = await model.generateContent([
    { inlineData: { mimeType: "image/png", data: base64Image } },
    { text: prompt },
  ]);

  const parts = result.response.candidates[0].content.parts;
  const imagePart = parts.find((p) =>
    p.inlineData?.mimeType?.startsWith("image"),
  );
  if (!imagePart) throw new Error("No image returned");

  return Buffer.from(imagePart.inlineData.data, "base64");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── GET — check progress ──────────────────────────────────────────────────────
export async function GET() {
  const progress = loadProgress();
  const pending = ALL_JOBS.filter((job) => {
    const key = getKey(job);
    const filePath = path.join(OUTPUT_DIR, `${key}.png`);
    return !progress.completed.includes(key) && !fs.existsSync(filePath);
  });

  return Response.json({
    total: ALL_JOBS.length,
    completed: progress.completed.length,
    failed: progress.failed.length,
    pending: pending.length,
    completedList: progress.completed,
    failedList: progress.failed,
  });
}

// ── POST — run a batch ────────────────────────────────────────────────────────
export async function POST(request) {
  const body = await request.json();
  const limit = body.limit || 15; // how many to generate this run

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(REFERENCE_DIR, { recursive: true });

  const progress = loadProgress();

  const pending = ALL_JOBS.filter((job) => {
    const key = getKey(job);
    const filePath = path.join(OUTPUT_DIR, `${key}.png`);
    return !progress.completed.includes(key) && !fs.existsSync(filePath);
  }).slice(0, limit);

  if (pending.length === 0) {
    return Response.json({
      message: "All done!",
      completed: progress.completed.length,
    });
  }

  const results = { success: [], failed: [] };

  for (let i = 0; i < pending.length; i++) {
    const job = pending[i];
    const key = getKey(job);
    const filename = `${key}.png`;
    const outPath = path.join(OUTPUT_DIR, filename);

    try {
      const buffer = await generateImage(job);
      fs.writeFileSync(outPath, buffer);

      progress.completed.push(key);
      progress.failed = progress.failed.filter((f) => f !== key);
      saveProgress(progress);

      results.success.push(key);

      if (i < pending.length - 1) await delay(4000);
    } catch (err) {
      if (!progress.failed.includes(key)) progress.failed.push(key);
      saveProgress(progress);
      results.failed.push({ key, error: err.message });
      await delay(4000);
    }
  }

  return Response.json({
    generated: results.success.length,
    failed: results.failed.length,
    success: results.success,
    errors: results.failed,
    totalDone: progress.completed.length,
    totalLeft: ALL_JOBS.length - progress.completed.length,
  });
}
