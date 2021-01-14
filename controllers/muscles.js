const Muscles = require("../models/Muscles");

exports.list = async (req, res) => {
  try {
    //console.log(req.query)
    const message = req.query.message;
    const muscles = await Muscles.find({});
    res.render("muscles", { 
        muscles: muscles, 
        message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list muscles" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    await Muscles.findByIdAndRemove(id);
    res.redirect("/muscles");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

  try {
    const muscles = new Muscles({ name: req.body.name });
    await muscles.save();
    res.redirect('/muscles/?message=muscle has been created')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-muscles', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const muscles = await Muscles.findById(id);
    res.render('update-muscles', { muscles: muscles, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find muscles ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const muscles = await Muscles.updateOne({ _id: id }, req.body);
    res.redirect('/muscles/?message=muscle has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find muscles ${id}.`,
    });
  }
};