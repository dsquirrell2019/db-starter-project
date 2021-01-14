const Exercise = require("../models/Exercise");
const Muscles = require("../models/Muscles");

exports.list = async (req, res) => {
  const message = req.query.message;
  try {
    const exercises = await Exercise.find({});
    res.render("exercises", { 
        exercises: exercises, 
        message: message 
      });
  } catch (e) {
    res.status(404).send({ message: "could not list exercises" });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const exercise = await Exercise.find({id});
    const muscles = await Muscles.find({});
    if(!exercise) throw error ('cannot find exercise');    
    res.render('update-exercise', { 
      exercise: exercise, 
      reps:req.body.reps,
      sets:req.body.sets,
      weight:req.body.weight,
      difficulty:req.body.difficulty,
      muscles:muscles,
      id: id,
      errors: {} 
    });
  } catch (e) {
    console.log(e);
    if(e.errors) {
      res.render('create-exercises', {errors:e.errors})
      return;
    }
    res.status(404).send({
      message: `could find exercise ${id}.`,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const muscle = await Muscles.findById(req.body.muscle_id);
    await Exercise.create({
      exercise: req.body.exercise, 
      weight: req.body.weight, 
      reps: req.body.reps, 
      sets: req.body.sets, 
      difficulty: req.body.difficulty,
      muscle_name:muscle.name,
      muscle_id:req.body.muscle_id
    })

    res.redirect('/exercise/?message=exercise has been created')
    } catch (e) {
      console.log(e.errors);
      res.render('create-exercises', {errors: e.errors});
     
  }
}

exports.createView = async (req, res) => {
  const id = req.params.id;
  try {
    const exercise = await Exercise.find({id});
    const reps = await Exercise.find({});
    const sets =await Exercise.find({});
    const weight = await Exercise.find({});
    const difficulty = await Exercise.find({});
    const muscles = await Muscles.find({});
    res.render("create-exercises", {
      exercise: exercise,
      weight: weight,
      reps:reps,
      sets:sets,
      difficulty: difficulty,
      muscles:muscles,
      errors: {}
    });

  } catch (e) {
    res.status(404).send({
      message: `could not generate create data`,
    });
  }
}

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    await Exercise.findByIdAndRemove(id);
    res.redirect("/exercise");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const exercise = await Exercise.updateOne({_id:id},req.body);
    res.redirect('/exercise/?message=exercise has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find exercise ${id}.`,
    });
  }
};


 