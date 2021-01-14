const mongoose = require("mongoose");
const { Schema } = mongoose;

const muscleSchema = new Schema(
  {
    exercises:{ type: Number, default: 0 },
    name: {type: String, required:[true, 'Name is required']},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Muscle", muscleSchema);
