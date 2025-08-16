const Record = require('../models/Record');
const { distance } = require('fastest-levenshtein');
const validateMCQAnswers = async (req, res) => {
  try {
    const { recordId, answers } = req.body;

    const record = await Record.findById(recordId);
    if (!record) return res.status(404).json({ message: "Record not found" });

    let score = 0;

    for (let ans of answers) {
      const q = record.questions.find(q => q.question_number === ans.question_number && q.type === "MCQ");

      if (q && ans.answer.trim() === q.correct_answer.trim()) {
        score++;
      }
    }

    record.answers = answers;
    record.score = score;
    record.status = "COMPLETED";

    await record.save();

    res.status(200).json({ message: "MCQ answers submitted", score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const validateFITBAnswers = async (req, res) => {
  try {
    const { recordId, answers } = req.body;

    const record = await Record.findById(recordId);
    if (!record) return res.status(404).json({ message: "Record not found" });

    let score = 0;

    for (let ans of answers) {
      const q = record.questions.find(
        q => q.question_number === ans.question_number && q.type === "FITB"
      );

      if (q) {
        const correct = q.correct_answer.trim().toLowerCase();
        const user = ans.answer.trim().toLowerCase();

        // Accept answer if distance is small (e.g. ≤ 2)
        if (distance(correct, user) <= 2) {
          score++;
        }
      }
    }

    record.answers = answers;
    record.score = score;
    record.status = "COMPLETED";

    await record.save();

    res.status(200).json({ message: "FITB answers submitted", score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  validateMCQAnswers,
  validateFITBAnswers}