// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const enumState = require("./enums/state.ts");

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
app.get('/api/alldata', async (req, res) => {
  try {
    const data = await stateModel.find();
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/data", async(req, res) => {

  const data = await stateModel.find();
  console.log(data);

  //TODO update the mongoDB like previous method

  // // Update data every 0.5 second
  // setInterval(() => {
    data.forEach((item, index) => {
      data[index].state =
        data[index].state === "KWS_KERIDOS" ? "KWS_KERIDOS_YG" : "UNKNOWN";
    });
  // }, 500);

  // Return data to the client
  res.json(data);
});

module.exports = app;
