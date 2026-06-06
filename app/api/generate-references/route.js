import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const REFERENCE_DIR = path.join(process.cwd(), "reference");

const REFERENCE_PROMPTS = {
  wingback: `
    Wingback bed with tall dramatic winged headboard, 
    neutral grey velvet upholstery, chrome legs,
    pure white studio background, front 3/4 angle,
    professional furniture product photography, 4K
  `,
  ottoman: `
    Ottoman bed with lift-up storage base,
    neutral grey velvet upholstery, chrome legs,
    pure white studio background, front 3/4 angle,
    professional furniture product photography, 4K
  `,
  panel: `
    Panel bed with clean straight tall headboard,
    neutral grey velvet upholstery, chrome legs,
    pure white studio background, front 3/4 angle,
    professional furniture product photography, 4K
  `,
  sleigh: `
    Sleigh bed with curved scroll headboard and footboard,
    neutral grey velvet upholstery, chrome legs,
    pure white studio background, front 3/4 angle,
    professional furniture product photography, 4K
  `,
  divan: `
    Divan bed with storage drawers on sides,
    neutral grey velvet upholstery, no legs,
    pure white studio background, front 3/4 angle,
    professional furniture product photography, 4K
  `,
  chesterfield: `
    Chesterfield bed with deep diamond button tufted headboard,
    neutral grey velvet upholstery, chrome legs,
    pure white studio background, front 3/4 angle,
    professional furniture product photography, 4K
  `,
  "low-profile": `
    Low profile bed with minimal flat platform headboard,
    neutral grey velvet upholstery, gold legs,
    pure white studio background, front 3/4 angle,
    professional furniture product photography, 4K
  `,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST() {
  fs.mkdirSync(REFERENCE_DIR, { recursive: true });

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-preview-image-generation",
    generationConfig: { responseModalities: ["Text", "Image"] },
  });

  const results = { success: [], failed: [] };

  const styles = Object.keys(REFERENCE_PROMPTS);

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    const filename = `${style}.png`;
    const outPath = path.join(REFERENCE_DIR, filename);

    if (fs.existsSync(outPath)) {
      console.log(`⏭  Skipping ${filename} — already exists`);
      results.success.push(style);
      continue;
    }

    console.log(`⏳ Generating reference: ${filename}`);

    try {
      const result = await model.generateContent([
        { text: REFERENCE_PROMPTS[style] },
      ]);

      const parts = result.response.candidates[0].content.parts;
      const imagePart = parts.find((p) =>
        p.inlineData?.mimeType?.startsWith("image"),
      );

      if (!imagePart) throw new Error("No image returned");

      fs.writeFileSync(
        outPath,
        Buffer.from(imagePart.inlineData.data, "base64"),
      );
      results.success.push(style);
      console.log(`✅ Saved ${filename}`);

      if (i < styles.length - 1) await delay(4000);
    } catch (err) {
      console.error(`❌ ${filename}: ${err.message}`);
      results.failed.push({ style, error: err.message });
      await delay(4000);
    }
  }

  return Response.json({
    message: "Reference generation complete",
    success: results.success,
    failed: results.failed,
  });
}
