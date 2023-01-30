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
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS"
//   );
//   next();
// });

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.post("/api/defaultBoxes",)

//Update Box State
app.get("/api/state", async (req, res, next) => {
  const id = req.query.id; // $_GET["id"]
  let rand = Math.floor(Math.random() * Object.keys(enumState).length);
  let randStateValue = enumState[Object.keys(enumState)[rand]];
  const state = await stateModel.findOneAndUpdate(
    { id },
    { state: randStateValue },
    {
      upsert: true,
      multi: false,
    }
  );
  res.send(state);
});

// Route to get all the data from the database
app.get("/api/alldata", async (req, res) => {
  try {
    const data = await stateModel.find();
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/data", async (req, res) => {
  try {
    const data = await stateModel.find();
    console.log(data[0].state);

    // const id = req.query.id; // $_GET["id"]
    // let rand = Math.floor(Math.random() * Object.keys(enumState).length);
    // let randStateValue = enumState[Object.keys(enumState)[rand]];
    // const state = await stateModel.findOneAndUpdate(
    //   { id },
    //   { state: randStateValue },
    //   {
    //     upsert: true,
    //     multi: false,
    //   }
    // );

    //TODO update the mongoDB like previous method

    data.forEach((item, index) => {
      console.log(
        `enumstate: ${enumState[data[index].state] || enumState.ERROR}`
      );
      data[index].state = data[index].state || enumState.ERROR;
    });

    // Return data to the client
    res.json(data);
  } catch (ERROR) {
    res.sendStatus(400).json({ message: "cannot fetch data" });
  }
});

cron.schedule("*/" + "0,5 * * * * *", async function () {
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
