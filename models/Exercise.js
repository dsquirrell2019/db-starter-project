const mongoose = require("mongoose");
const { Schema } = mongoose;

const exerciseSchema = new Schema(
  {
    exercise: {type: String, required:[true, 'Workout name is required']},
    weight: Number,
    reps: {type: Number, default:0},
    sets: {type: Number, default:0},
    difficulty: String,
    muscle_name:String,
    muscle_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Muscle",
    }
  },
  { timestamps: true }
);
exerciseSchema.index({'$**': 'text'});
module.exports = mongoose.model("Exercise", exerciseSchema);
