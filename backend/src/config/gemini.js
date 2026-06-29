const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set — AI features will fail.");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cheap, fast, good for structured JSON extraction
const MODEL = "gpt-4o-mini";

async function generateText(prompt) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}

module.exports = { generateText };