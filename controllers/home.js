const Exercise = require('../models/Exercise');
const Muscle = require('../models/Muscles');
exports.list = async (req, res) => {
    console.log(req.session);
    try {
        const totalExercises = await Exercise.find({}).count();
        const totalMuscles = await Muscle.find({}).count();
        console.log("Connection succeeded.");
        console.log("Total Exercises in Database: " + totalExercises);
        console.log("Total Muscles in Database: " + totalMuscles);
        res.render("index");
        
    } catch (e) {
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}