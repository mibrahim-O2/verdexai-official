const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: (v) => v.length === 4,
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, default: "" },
});

const testMcqPoolSchema = new mongoose.Schema(
  {
    jobPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    generatedByAI: { type: Boolean, default: true },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.TestMcqPool ||
  mongoose.model("TestMcqPool", testMcqPoolSchema);