const Interview = require("../../models/Interview");
const Application = require("../../models/Application");
const JobPost = require("../../models/JobPost");
const User = require("../../models/User");
const asyncHandler = require("../../utils/asyncHandler");
const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendInterviewEmail(candidate, interview, job) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const transporter = createTransporter();
    const dateStr = new Date(interview.interviewDate).toLocaleString("en-PK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Karachi",
    });

    await transporter.sendMail({
      from: `"VerdexAI" <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      subject: `Interview Scheduled — ${job.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Interview Scheduled</h2>
          <p>Dear <strong>${candidate.name}</strong>,</p>
          <p>Your interview for the position of <strong>${job.title}</strong> (${job.department}) has been scheduled.</p>

          <div style="margin: 24px 0; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #2563eb;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px;">Date & Time:</td>
                <td style="padding: 6px 0;">${dateStr} (PKT)</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Duration:</td>
                <td style="padding: 6px 0;">${interview.durationMinutes} minutes</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Platform:</td>
                <td style="padding: 6px 0;">${interview.meetingPlatform}</td>
              </tr>
              ${interview.meetingLink ? `
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">Meeting Link:</td>
                <td style="padding: 6px 0;">
                  <a href="${interview.meetingLink}" style="color: #2563eb;">${interview.meetingLink}</a>
                </td>
              </tr>
              ` : ""}
              ${interview.notes ? `
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Notes:</td>
                <td style="padding: 6px 0;">${interview.notes}</td>
              </tr>
              ` : ""}
            </table>
          </div>

          <p>Please make sure to join on time. Log in to your VerdexAI dashboard to view full interview details.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">This is an automated notification from VerdexAI.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send interview email:", err.message);
  }
}

// POST /api/v1/assessment/interview/schedule   (HR only)
const scheduleInterview = asyncHandler(async (req, res) => {
  const {
    applicationId,
    interviewDate,
    durationMinutes,
    meetingLink,
    meetingPlatform,
    notes,
  } = req.body;

  if (!applicationId || !interviewDate) {
    return res.status(400).json({
      success: false,
      error: "applicationId and interviewDate are required.",
    });
  }

  const application = await Application.findById(applicationId).populate("jobPostId");
  if (!application) {
    return res.status(404).json({ success: false, error: "Application not found." });
  }
  if (application.jobPostId.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }

  // Check if interview already scheduled for this application
  const existing = await Interview.findOne({ applicationId });
  if (existing) {
    // Update instead of creating new
    existing.interviewDate = interviewDate;
    existing.durationMinutes = durationMinutes || 30;
    existing.meetingLink = meetingLink || "";
    existing.meetingPlatform = meetingPlatform || "Google Meet";
    existing.notes = notes || "";
    existing.status = "rescheduled";
    await existing.save();

    const candidate = await User.findById(application.candidateId);
    if (candidate) sendInterviewEmail(candidate, existing, application.jobPostId);

    return res.json({ success: true, interview: existing, rescheduled: true });
  }

  const interview = await Interview.create({
    applicationId,
    candidateId: application.candidateId,
    jobPostId: application.jobPostId._id,
    hrId: req.user._id,
    interviewDate,
    durationMinutes: durationMinutes || 30,
    meetingLink: meetingLink || "",
    meetingPlatform: meetingPlatform || "Google Meet",
    notes: notes || "",
  });

  // Update application status
  application.status = "interview_scheduled";
  await application.save();

  // Send email
  const candidate = await User.findById(application.candidateId);
  if (candidate) sendInterviewEmail(candidate, interview, application.jobPostId);

  res.status(201).json({ success: true, interview });
});

// GET /api/v1/assessment/interview/my   (Candidate only)
const getMyInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ candidateId: req.user._id })
    .populate("jobPostId", "title department")
    .populate("hrId", "name email")
    .sort({ interviewDate: 1 });

  res.json({ success: true, interviews });
});

// GET /api/v1/assessment/interview/hr   (HR only — their scheduled interviews)
const getHrInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ hrId: req.user._id })
    .populate("candidateId", "name email")
    .populate("jobPostId", "title department")
    .sort({ interviewDate: 1 });

  res.json({ success: true, interviews });
});

// PATCH /api/v1/assessment/interview/:id/status   (HR only)
const updateInterviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["scheduled", "completed", "cancelled", "rescheduled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status." });
  }

  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    return res.status(404).json({ success: false, error: "Interview not found." });
  }
  if (interview.hrId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: "Not authorized." });
  }

  interview.status = status;
  await interview.save();

  res.json({ success: true, interview });
});

module.exports = {
  scheduleInterview,
  getMyInterviews,
  getHrInterviews,
  updateInterviewStatus,
};