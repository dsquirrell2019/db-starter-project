const User = require("../models/User");

exports.list = async (req, res) => {
    try {
      const userRef = await User.findOne({"_id": user.id}).populate('saved_exercises');
      res.render('saved-exercises', {exercises: userRef.saved_exercises});
    } catch (e) {
      console.log(e);
      res.json({result: 'could not find user favorites'}); 
    }
}