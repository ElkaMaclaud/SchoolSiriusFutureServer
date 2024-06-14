const { Schema, model } = require("mongoose");

const Lesssons = new Schema({
  lessonName: { type: String, required: true },
  date: { type: String, required: true },
  teacher: { type: String, required: true },
  paid: { type: Boolean },
  wasAbsent: { type: Boolean }
});

module.exports = model("Lessons", Lesssons);
