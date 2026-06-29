require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const requestLogger = require("./middleware/requestLogger");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Core middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, message: "VerdexAI backend is running." });
});

app.use("/api/v1/auth", require("./modules/auth/auth.routes"));
app.use("/api/v1/jobs", require("./modules/jobs/jobs.routes"));
app.use("/api/v1/applications", require("./modules/applications/applications.routes"));
// app.use("/api/v1/ai", require("./modules/ai/ai.routes"));
// app.use("/api/v1/assessment", require("./modules/assessment/assessment.routes"));
// app.use("/api/v1/pipeline", require("./modules/pipeline/pipeline.routes"));
// app.use("/api/v1/notifications", require("./modules/notifications/notifications.routes"));
// app.use("/api/v1/admin", require("./modules/admin/admin.routes"));

// 404 + error handling (must stay last)
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`VerdexAI backend listening on port ${PORT}`);
  });
}

startServer();