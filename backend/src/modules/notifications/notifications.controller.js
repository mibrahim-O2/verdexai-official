const { Resend } = require("resend");
const asyncHandler = require("../../utils/asyncHandler");

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "VerdexAI <onboarding@resend.dev>";
const TO_EMAIL = process.env.EMAIL_TO || "mibrahimkhalid306@gmail.com";

// POST /api/v1/contact
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    reply_to: email,
    subject: `[VerdexAI Contact] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">${subject}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
          <strong>Message:</strong>
          <p style="margin-top: 8px; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">Sent from VerdexAI landing page</p>
      </div>
    `,
  });

  res.json({ success: true, message: "Message sent successfully." });
});

module.exports = { submitContact };