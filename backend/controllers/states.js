const stateModel = require("../models/stateModel");
exports.initializeData = async (req, res) => {
  try {
    const stateData = [];
    if ((await stateModel.countDocuments({})) === 0) {
      for (let i = 0; i < 45; i++) {
        const newState =
          enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
        stateData.push({ index: i, state: newState });
      }
      stateModel.insertMany(stateData, (error, docs) => {
        if (error) {
          console.log("3");
          return res.status(400).json({ message: "Cannot fetch data" });
        } else {
          console.log("4");

          return res
            .status(200)
            .json({ message: `Inserted ${docs.length} documents` });
        }
      });
    } else {
      console.log("5");

      return res.status(200).json({ message: `Already initialized data` });
    }
  } catch (ERROR) {}
}

exports.fetchData = async (req, res) => {
  try {
    const shouldFetchAll = req.query.shouldFetchAll; // $_GET["shouldFetchAll"]
    console.log(shouldFetchAll);

    const filter = {};
    if (!shouldFetchAll) {
      filter.isUpdated = true;
    }
    console.log("1");

    return res.status(200).send(await stateModel.find(filter).sort({ id: 1 }));
  } catch (error) {
    console.log("2");

    return res.sendStatus(400).json({ message: "Cannot fetch data" });
  }
}


