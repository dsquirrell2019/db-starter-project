
const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");


/**
 * constants
 */
 //const uri = "mongodb://localhost:27017/workout";
//const uri =  "mongodb+srv://admin:8GIShxMTFUvkY9PI@cluster0.lvl66.mongodb.net/wine?retryWrites=true&w=majority"
const uri = "mongodb+srv://admin:xnYbV1x0DTk1K3sd@cluster0.8nprw.mongodb.net/workout?retryWrites=true&w=majority"
const client = new MongoClient(uri); 
async function main() {
    try {
      await client.connect();
      const db = client.db();
      const results = await db.collection("exercises").find({}).count();
  
      /**
       * If existing records then delete the current collections
       */
      if (results) {
        db.dropDatabase();
      }
  
      /**
       * This is just a fun little loader module that displays a spinner
       * to the command line
       */
      const load = loading("importing your workouts!!").start();
  
      /**
       * Import the JSON data into the database
       */
  
      const data = await fs.readFile(path.join(__dirname, "workout.json"), "utf8");
      await db.collection("exercises").insertMany(JSON.parse(data));
  
      /**
       * This perhaps appears a little more complex than it is. Below, we are
       * grouping the wine tasters and summing their total tastings. Finally,
       * we tidy up the output so it represents the format we need for our new collection
       */
  
      const mucslesRef = await db.collection("exercises").aggregate([
        { $match: { muscle_name: { $ne: null } } },
        {
          $group: {
            _id: "$muscle_name",
            exercises: { $sum: 1 },
          },
  
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            exercises: '$tastings'
          },
        },
      ]);
      /**
       * Below, we output the results of our aggregate into a
       * new collection
       */
      const muscles = await mucslesRef.toArray();
      await db.collection("muscles").insertMany(muscles);
  
   
      load.stop();
      console.info(
        'Exercise and muscles collections created.' 
      );
  
  
      process.exit();
    } catch (error) {
      console.error("error:", error);
      process.exit();
    }
  }
  
  main();