// imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const enumState = require("./enums/state.ts");
const cron = require("node-cron");

const statesRoute = require("./routes/states");


const stateModel = require("./models/stateModel");
const { default: mongoose } = require("mongoose");


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


cron.schedule("*/" + "0,5 * * * * *", async function () {
  console.log("inside cron schedule");
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
});


app.use("/api/states", statesRoute);

module.exports = app;
