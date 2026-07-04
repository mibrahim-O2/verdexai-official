const TestMcqPool = require("../../models/TestMcqPool");
const TestInvitation = require("../../models/TestInvitation");
const TestAttempt = require("../../models/TestAttempt");
const Application = require("../../models/Application");
const JobPost = require("../../models/JobPost");
const asyncHandler = require("../../utils/asyncHandler");
const { generateText } = require("../../config/gemini");

// Static fallback questions used when AI generation fails
const FALLBACK_QUESTIONS = [
  {
    question: "What does REST stand for in web development?",
    options: ["Representational State Transfer", "Remote Execution Service Technology", "Resource Endpoint State Transfer", "Rapid Event Stream Transfer"],
    correctAnswer: 0,
    explanation: "REST stands for Representational State Transfer, an architectural style for APIs.",
  },
  {
    question: "Which HTTP method is idempotent?",
    options: ["POST", "PATCH", "GET", "None of the above"],
    correctAnswer: 2,
    explanation: "GET is idempotent — calling it multiple times has the same effect as calling it once.",
  },
  {
    question: "What is the purpose of a JWT (JSON Web Token)?",
    options: ["Database encryption", "Stateless authentication", "File compression", "Network routing"],
    correctAnswer: 1,
    explanation: "JWT is used for stateless authentication by encoding user claims in a signed token.",
  },
  {
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Linked List", "Stack", "Tree"],
    correctAnswer: 2,
    explanation: "A Stack uses LIFO — the last element pushed is the first to be popped.",
  },
  {
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Question Language", "Stored Query Logic", "System Query Layer"],
    correctAnswer: 0,
    explanation: "SQL stands for Structured Query Language, used to manage relational databases.",
  },
  {
    question: "In Big O notation, what is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correctAnswer: 2,
    explanation: "Binary search halves the search space each step, giving O(log n) complexity.",
  },
  {
    question: "What is a React Hook?",
    options: ["A lifecycle method for class components", "A function that lets you use state in functional components", "A routing library", "A CSS-in-JS tool"],
    correctAnswer: 1,
    explanation: "React Hooks let you use state and other React features in functional components.",
  },
  {
    question: "What does NoSQL mean?",
    options: ["No Structured Query Language", "Not Only SQL", "New Optimized SQL", "Non-relational SQL"],
    correctAnswer: 1,
    explanation: "NoSQL means 'Not Only SQL' — it includes various non-relational database types.",
  },
  {
    question: "What is the purpose of an index in a database?",
    options: ["To store backup data", "To speed up query performance", "To encrypt data", "To define relationships"],
    correctAnswer: 1,
    explanation: "Database indexes speed up data retrieval by providing fast lookup paths.",
  },
  {
    question: "What is version control used for?",
    options: ["Managing server configurations", "Tracking code changes over time", "Compiling code", "Running tests automatically"],
    correctAnswer: 1,
    explanation: "Version control systems like Git track changes to code, enabling collaboration and history.",
  },
];

async function generateQuestionsWithAI(job) {
  const prompt = `
You are a technical assessment designer. Generate exactly 10 multiple-choice questions to test candidates for this job.
Return ONLY valid JSON (no markdown, no code fences) as an array of 10 objects with this exact shape:

[
  {
    "question": "string",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": 0,
    "explanation": "brief explanation"
  }
]

correctAnswer must be the index (0-3) of the correct option in the options array.

JOB TITLE: ${job.title}
JOB DEPARTMENT: ${job.department}
JOB REQUIREMENTS: ${job.requirements}
`;

  const responseText = await generateText(prompt);
  const cleaned = responseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
  const questions = JSON.parse(cleaned);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("AI returned invalid question format.");
  }

  return questions.slice(0, 10);
}

// POST /api/v1/assessment/invite   (HR only)
const inviteCandidate = asyncHandler(async (req, res) => {
  const { applicationId, timeLimitMinutes } = req.body;

  if (!applicationId) {
    return res.status(400).json({ success: false, error: "applicationId is required." });
  }

  const application = await Application.findById(applicationId).populate("jobPostId");
  if (!application) {
    return res.status(404).json({ success: false, error: "Application not found." });
  }
  if (application.jobPostId.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }

  // Check not already invited
  const existingInvite = await TestInvitation.findOne({ applicationId });
  if (existingInvite) {
    return res.status(409).json({ success: false, error: "Candidate already has a test invitation for this application." });
  }

  // Generate or reuse MCQ pool for this job
  let pool = await TestMcqPool.findOne({ jobPostId: application.jobPostId._id });

  if (!pool) {
    let questions;
    let generatedByAI = true;

    try {
      questions = await generateQuestionsWithAI(application.jobPostId);
    } catch (err) {
      console.error("AI question generation failed, using fallback:", err.message);
      questions = FALLBACK_QUESTIONS;
      generatedByAI = false;
    }

    pool = await TestMcqPool.create({
      jobPostId: application.jobPostId._id,
      generatedByAI,
      questions,
    });
  }

  const invitation = await TestInvitation.create({
    candidateId: application.candidateId,
    jobPostId: application.jobPostId._id,
    applicationId,
    mcqPoolId: pool._id,
    timeLimitMinutes: timeLimitMinutes || 30,
  });

  // Update application status to interview_scheduled
  application.status = "interview_scheduled";
  await application.save();

  res.status(201).json({ success: true, invitation });
});

// GET /api/v1/assessment/my-invitations   (Candidate only)
const getMyInvitations = asyncHandler(async (req, res) => {
  const invitations = await TestInvitation.find({ candidateId: req.user._id })
    .populate("jobPostId", "title department")
    .sort({ createdAt: -1 });

  res.json({ success: true, invitations });
});

// GET /api/v1/assessment/invitation/:id/questions   (Candidate only)
// Returns invitation + questions (without correct answers)
const getTestQuestions = asyncHandler(async (req, res) => {
  const invitation = await TestInvitation.findById(req.params.id)
    .populate("mcqPoolId")
    .populate("jobPostId", "title department");

  if (!invitation) {
    return res.status(404).json({ success: false, error: "Invitation not found." });
  }
  if (invitation.candidateId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }
  if (invitation.status === "completed") {
    return res.status(400).json({ success: false, error: "You have already completed this test." });
  }
  if (invitation.status === "expired" || new Date() > invitation.expiresAt) {
    invitation.status = "expired";
    await invitation.save();
    return res.status(400).json({ success: false, error: "This test invitation has expired." });
  }

  // Strip correct answers before sending to candidate
  const questionsForCandidate = invitation.mcqPoolId.questions.map((q) => ({
    _id: q._id,
    question: q.question,
    options: q.options,
  }));

  res.json({
    success: true,
    invitation: {
      _id: invitation._id,
      jobPost: invitation.jobPostId,
      timeLimitMinutes: invitation.timeLimitMinutes,
      expiresAt: invitation.expiresAt,
      status: invitation.status,
    },
    questions: questionsForCandidate,
  });
});

// POST /api/v1/assessment/submit   (Candidate only)
const submitTest = asyncHandler(async (req, res) => {
  const { invitationId, answers, timeTakenSeconds, tabSwitchCount } = req.body;

  if (!invitationId || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, error: "invitationId and answers array are required." });
  }

  const invitation = await TestInvitation.findById(invitationId).populate("mcqPoolId");
  if (!invitation) {
    return res.status(404).json({ success: false, error: "Invitation not found." });
  }
  if (invitation.candidateId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }
  if (invitation.status === "completed") {
    return res.status(400).json({ success: false, error: "Test already submitted." });
  }

  const questions = invitation.mcqPoolId.questions;
  let correct = 0;
  answers.forEach((ans, i) => {
    if (questions[i] && ans === questions[i].correctAnswer) correct++;
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((correct / totalQuestions) * 100);

  const attempt = await TestAttempt.create({
    invitationId,
    candidateId: req.user._id,
    jobPostId: invitation.jobPostId,
    answers,
    score: correct,
    totalQuestions,
    percentage,
    timeTakenSeconds: timeTakenSeconds || 0,
    tabSwitchCount: tabSwitchCount || 0,
  });

  invitation.status = "completed";
  await invitation.save();

  res.json({ success: true, attempt });
});

// GET /api/v1/assessment/results/:invitationId   (Candidate only — see own result)
const getResult = asyncHandler(async (req, res) => {
  const invitation = await TestInvitation.findById(req.params.invitationId)
    .populate("mcqPoolId")
    .populate("jobPostId", "title");

  if (!invitation) {
    return res.status(404).json({ success: false, error: "Invitation not found." });
  }
  if (invitation.candidateId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }

  const attempt = await TestAttempt.findOne({ invitationId: req.params.invitationId });
  if (!attempt) {
    return res.status(404).json({ success: false, error: "No attempt found." });
  }

  // Return with correct answers and explanations now that test is submitted
  const questions = invitation.mcqPoolId.questions;
  const reviewData = questions.map((q, i) => ({
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    candidateAnswer: attempt.answers[i],
    correct: attempt.answers[i] === q.correctAnswer,
  }));

  res.json({
    success: true,
    result: {
      jobTitle: invitation.jobPostId?.title,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      timeTakenSeconds: attempt.timeTakenSeconds,
      tabSwitchCount: attempt.tabSwitchCount,
      submittedAt: attempt.submittedAt,
      review: reviewData,
    },
  });
});

// GET /api/v1/assessment/job-results/:jobId   (HR only — see all attempts for their job)
const getJobResults = asyncHandler(async (req, res) => {
  const job = await JobPost.findById(req.params.jobId);
  if (!job) return res.status(404).json({ success: false, error: "Job not found." });
  if (job.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }

  const attempts = await TestAttempt.find({ jobPostId: req.params.jobId })
    .populate("candidateId", "name email")
    .sort({ percentage: -1 });

  res.json({ success: true, attempts });
});

module.exports = {
  inviteCandidate,
  getMyInvitations,
  getTestQuestions,
  submitTest,
  getResult,
  getJobResults,
};