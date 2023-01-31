// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const enumState = require("./enums/state.ts");
const cron = require("node-cron");

const stateModel = require("./models/stateModel");
const { default: mongoose } = require("mongoose");
const { timestamp } = require("rxjs");

const app = express();

const enumStateHard = ["KWS_KERIDOS", "KWS_KERIDOS_YG", "UNKNOWN", "ERROR"];

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://orMongoAdmin:sGkkSwZgVXMMe3nq@cluster0.aftzbrv.mongodb.net/DigitalTeamTest"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**initializeData to mongoDB */
app.get("/api/initializeData", async (req, res) => {
  try {
    const stateData = [];
    console.log("statemodel.find:");
    console.log(await stateModel.count);
    if ((await stateModel.countDocuments({})) === 0) {
      console.log("new fetch");
      for (let i = 0; i < 45; i++) {
        const newState =
          enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
        stateData.push({ index: i, state: newState });
      }
      console.log(stateData);
      stateModel.insertMany(stateData, (error, docs) => {
        if (error) {
          console.error(error);
          res.status(400).json({ message: "Cannot fetch data" });
        } else {
          console.log(`Inserted ${docs.length} documents`);
          res.status(200);
        }
      });
    } else {
      /**update fetch incase of updating model only*/
      const newState =
        enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
      stateData.push({ index: i, state: newState });
      const promises = docs.map(async ({ _id, state }) => {
        const newState =
          enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
        return stateModel.updateOne(
          { _id },
          {
            $set: {
              state: newState,
              isUpdated: newState != state,
            },
          },
          {
            upsert: true,
            multi: false,
            strict: false,
          }
        );
      });

      Promise.all([promises]);
    }
  } catch (ERROR) {}
});
/**FetchData to the frontend UI */
app.get("/api/fetchData", async (req, res) => {
  try {
    const shouldFetchAll = req.query.shouldFetchAll; // $_GET["shouldFetchAll"]
    console.log(shouldFetchAll);

    const filter = {};
    if (!shouldFetchAll) {
      filter.isUpdated = true;
    }
    res.status(200).send(await stateModel.find(filter).sort({ id: 1 }));
  } catch (ERROR) {
    res.sendStatus(400).json({ message: "Cannot fetch data" });
  }
});
/**Cron schedule every 0.5 seconds to update the Database*/
cron.schedule("*/" + "0,5 * * * * *", async function () {
  console.log("Inside cron schedule");
  const docs = await stateModel.find();

  const promises = docs.map(async ({ _id, state }) => {
    const newState =
      enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
    return stateModel.updateOne(
      { _id },
      {
        $set: {
          state: newState,
          isUpdated: newState != state,
        },
      },
      {
        upsert: true,
        multi: false,
        strict: false,
      }
    );
  });

  Promise.all([promises]);

  // const bulk = stateModel.initializeUnorderdBulkOp();
  // docs.forEach((doc) => {
  //     bulk.find({_id:doc._id}).upsert().updateOne({ $set: {state: doc.state} });
  // });
  // await bulk.execute();
});

app.route("/api/update-state").put(async (req, res) => {
  console.log("inside route");
  const enumStateHard = ["KWS_KERIDOS", "KWS_KERIDOS_YG", "UNKNOWN", "ERROR"];
  const docs = await stateModel.find();

  const promises = docs.map(async (doc) => {
    const randStateValue =
      enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
    return await stateModel.updateOne(
      { _id: doc._id },
      { state: randStateValue },
      {
        upsert: true,
        multi: false,
      }
    );
  });

  const result = await Promise.all(promises);

  res.status(200).json({ result });
});
module.exports = app;
