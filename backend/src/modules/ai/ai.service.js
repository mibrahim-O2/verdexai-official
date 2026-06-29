const pdfParse = require("pdf-parse");
const { generateText } = require("../../config/gemini");

// Extracts raw text from a PDF buffer
async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

function stripCodeFences(text) {
  return text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
}

// Uses the LLM to parse raw CV text into structured fields
async function parseCvText(cvText) {
  const prompt = `
You are a resume parser. Extract structured information from the following CV text.
Return ONLY valid JSON (no markdown, no code fences, no explanation) matching this exact shape:

{
  "name": "string",
  "email": "string or empty",
  "phone": "string or empty",
  "skills": ["string", "..."],
  "experienceYears": number,
  "education": "string summary",
  "summary": "2-3 sentence professional summary"
}

CV TEXT:
"""
${cvText.slice(0, 8000)}
"""
`;

  const responseText = await generateText(prompt);
  const cleaned = stripCodeFences(responseText.trim());

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI CV response as JSON:", cleaned);
    throw new Error("AI failed to parse the CV. Please try again or use a clearer PDF.");
  }
}

// Uses the LLM to score how well a parsed CV matches a job's requirements (0-100)
async function scoreCandidateAgainstJob(parsedCv, job) {
  const prompt = `
You are an expert technical recruiter. Score how well this candidate matches the job below.
Return ONLY a JSON object (no markdown, no explanation) matching this exact shape:

{
  "score": number (0-100),
  "reasoning": "1-2 sentence explanation of the score"
}

JOB TITLE: ${job.title}
JOB DEPARTMENT: ${job.department}
JOB DESCRIPTION: ${job.description}
JOB REQUIREMENTS: ${job.requirements}

CANDIDATE PROFILE:
Name: ${parsedCv.name}
Skills: ${(parsedCv.skills || []).join(", ")}
Experience: ${parsedCv.experienceYears} years
Education: ${parsedCv.education}
Summary: ${parsedCv.summary}
`;

  const responseText = await generateText(prompt);
  const cleaned = stripCodeFences(responseText.trim());

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI scoring response as JSON:", cleaned);
    return { score: 0, reasoning: "AI scoring failed for this application." };
  }
}

module.exports = { extractTextFromPdf, parseCvText, scoreCandidateAgainstJob };