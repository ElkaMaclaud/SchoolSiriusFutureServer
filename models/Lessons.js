const { Schema, model } = require("mongoose");

const Lesssons = new Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },

  description: { type: String, required: true, ref: "Lesson"  },
});

module.exports = model("Lessons", Lesssons);
