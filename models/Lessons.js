const { Schema, model } = require("mongoose");

const Lesssons = new Schema({
  lessonName: { type: String, required: true },
  date: { type: String, required: true },
});

module.exports = model("Lessons", Lesssons);
