const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/Users");
const RecordModel = require("./models/Records");
const HistoryModel = require("./models/Histories");

const app = express();
app.use(
  cors({
    origin: ["https://ekeris.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

mongoose.connect(
  "mongodb+srv://rahmannnnn:ghani123@ekeris.uv559ut.mongodb.net/ekeris"
);

app.get("/", (req, res) => {
  res.json("Hello");
});

app.get("/records", (req, res) => {
  const { page, size, keyword } = req.query;
  let { searchby } = req.query;
  if (!searchby) {
    searchby = "name";
  }

  if (!page && !size && !keyword) {
    RecordModel.find()
      .populate("histories")
      .then((record) => {
        res.json(record);
      })
      .catch((error) => res.json({ error: error }));
  }

  if (!page && !size && keyword) {
    RecordModel.find({
      [searchby]: { $regex: new RegExp("^" + keyword.toLowerCase(), "i") },
    })
      .populate("histories")
      .then((record) => {
        res.json(record);
      })
      .catch((error) => res.json({ error: error }));
  }

  if (page && size && !keyword) {
    const offset = (page - 1) * size;

    RecordModel.paginate({}, { offset, limit: size, populate: "histories" })
      .then((record) => {
        res.json(record);
      })
      .catch((error) => res.json({ error: error }));
  }

  if (page && size && keyword) {
    const offset = (page - 1) * size;

    RecordModel.paginate(
      {
        [searchby]: { $regex: new RegExp("^" + keyword.toLowerCase(), "i") },
      },
      { offset, limit: size, populate: "histories" }
    )
      .then((record) => {
        res.json(record);
      })
      .catch((error) => res.json({ error: error }));
  }
});

app.get("/records/:_id", (req, res) => {
  const { _id } = req.params;

  RecordModel.findById(_id)
    .populate("histories")
    .then((record) => {
      res.json(record);
    })
    .catch((error) => res.json({ error: error }));
});

app.post("/records", async (req, res) => {
  const { body } = req;
  const { medical_record_number } = body;

  let result = {};
  await RecordModel.find({ medical_record_number: medical_record_number })
    .then((res) => {
      result = { ...res };
    })
    .catch((err) => res.json({ error: err }));

  if (Object.keys(result).length !== 0) {
    res.status(403).json({
      error:
        "Maaf, nomor rekam medis sudah digunakan. Silakan gunakan nomor rekam medis lain.",
    });
  } else {
    await RecordModel.create({
      ...body,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    })
      .then((result) => res.json(result))
      .catch((error) => res.json({ error: error }));
  }
});

app.post("/records/bulk", async (req, res) => {
  // Array of record
  const { body } = req;

  await RecordModel.insertMany(
    body.map((item) => {
      return {
        ...item,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
    })
  )
    .then((result) => res.json(result))
    .catch((error) => res.json({ error: error }));
});

app.put("/records/:_id", async (req, res) => {
  const { _id } = req.params;

  RecordModel.findByIdAndUpdate(
    { _id },
    { ...req.body, updatedAt: new Date().getTime() }
  )
    .then((result) => res.json(result))
    .catch((error) => res.json({ error: error }));
});

app.delete("/records/:_id", async (req, res) => {
  const { _id } = req.params;
  await RecordModel.findByIdAndDelete({ _id: _id })
    .then(async (result) => {
      const { histories } = result;

      await HistoryModel.deleteMany({ _id: histories });
      return res.json(result);
    })
    .catch((error) => res.json({ error: error }));
});

app.get("/histories", (req, res) => {
  HistoryModel.find()
    .populate("records")
    .then((record) => res.json(record))
    .catch((error) => res.json({ error }));
});

app.post("/histories", async (req, res) => {
  const { body } = req;
  const { recordId } = body;

  await HistoryModel.create({
    ...body,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  })
    .then(async (result) => {
      await RecordModel.findByIdAndUpdate(
        recordId,
        { $push: { histories: result._id } },
        { new: true, useFindAndModify: false }
      ).then(() => res.json(result));
    })
    .catch((error) => res.json({ error: error }));
});

app.delete("/histories/:_id", async (req, res) => {
  const { _id } = req.params;

  await HistoryModel.findByIdAndDelete(_id)
    .then(async (result) => {
      const { recordId } = result;
      await RecordModel.findByIdAndUpdate(
        recordId,
        { $pull: { histories: result._id } },
        { new: true, useFindAndModify: false }
      ).then(() => res.json(result));
    })
    .catch((error) => res.json({ error: error }));
});

app.put("/histories/:_id", (req, res) => {
  const { _id } = req.params;
  HistoryModel.findByIdAndUpdate(
    { _id },
    { ...req.body, updatedAt: new Date().getTime() }
  )
    .then((result) => res.json(result))
    .catch((error) => res.json({ error: error }));
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({
    username: username,
  }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json({
          username,
        });
      } else {
        res.status(403).json({
          error:
            "Maaf, kata sandi Anda salah. Silakan periksa kembali kata sandi Anda.",
        });
      }
    } else {
      res.status(403).json({ error: "Username tidak ditemukan." });
    }
  });
});

app.listen(3001, () => {
  console.log("server is running");
});
