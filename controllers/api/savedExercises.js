const User = require("../../models/User");

exports.create = async (req, res) => {
      const exerciseId = req.body.id;
      if (  !exerciseId || req.session.userID) {
        res.json({result: 'error'});
      }
      try {
        await User.update({"_id": req.session.userID}, {$push:{saved_exercises: exerciseId}})
      } catch (e) {
        res.json({result: 'error could not create a favourite'}); 
      }
  }

