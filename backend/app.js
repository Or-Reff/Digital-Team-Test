// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const enumState = require("./enums/state.ts");
const cron = require("node-cron");

const stateModel = require("./models/stateModel");
const { default: mongoose } = require("mongoose");

const app = express();

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

// app.post("/api/defaultBoxes",)

app.get("/api/data", async (req, res) => {
  try {
    const shouldFetchAll = req.query.shouldFetchAll; // $_GET["shouldFetchAll"]
    console.log(shouldFetchAll);

    const filter = {};
    if(!req.shouldFetchAll) {
      filter.isUpdated = true;
    }

    res.status(200).send(await stateModel.find(filter).sort({id: 1}));
  } catch (ERROR) {
    res.sendStatus(400).json({ message: "cannot fetch data" });
  }
});

cron.schedule("*/" + "0,5 * * * * *", async function () {
  console.log("inside route");
  const enumStateHard = ["KWS_KERIDOS", "KWS_KERIDOS_YG", "UNKNOWN", "ERROR"];
  const docs = await stateModel.find();

  const promises = docs.map(async ({ _id, state }) => {
    const newState =
    enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
    return stateModel.updateOne(
      { _id },
      { $set: {
        state: newState,
        isUpdated: newState != state
       } },
      {
        upsert: true,
        multi: false,
        strict:false
      }
    );
  });

  Promise.all([promises])



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
