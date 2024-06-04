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
  "mongodb+srv://rahmannnnn:ghani123@ekeris.uv559ut.mongodb.net/ekeris?retryWrites=true&w=majority"
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
      [searchby]: { $regex: new RegExp(keyword.toLowerCase(), "i") },
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
        [searchby]: {
          $regex: new RegExp(keyword.toLowerCase(), "i"),
        },
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

app.put("/users/detail/:username", async (req, res) => {
  const { username } = req.params;
  const { name: newName, username: newUsername, password } = req.body;

  // check username, if password same, change username and name
  let found = false;
  await UserModel.findOne({
    username: username,
  })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          found = true;
        } else {
          res.status(403).json({
            error: "Password yang anda masukkan salah.",
          });
        }
      } else {
        res.status(403).json({
          error: "Pengguna tidak ditemukan.",
        });
      }
    })
    .catch((error) => res.json({ error: error }));

  let isEquals = true;
  if (found) {
    await UserModel.findOne({ username: newUsername }).then((user) => {
      if (user) {
        if (username === newUsername) {
          isEquals = false;
        } else {
          res.status(403).json({
            error: "Username sudah digunakan oleh orang lain.",
          });
        }
      } else {
        isEquals = false;
      }
    });
  }

  if (!isEquals) {
    await UserModel.findOneAndUpdate(
      { username },
      { name: newName, username: newUsername, updatedAt: new Date().getTime() }
    )
      .then(() => res.json({ name: newName, username: newUsername }))
      .catch((error) => res.json({ error: error }));
  }
});

app.put("/users/password/:username", async (req, res) => {
  const { username } = req.params;
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword, newPassword);

  let found = false;
  await UserModel.findOne({ username: username })
    .then(async (user) => {
      if (user.password === oldPassword) {
        found = true;
      } else {
        res.status(403).json({
          error: "Password yang anda masukkan salah.",
        });
      }
    })
    .catch((error) => res.json({ error: error }));

  if (found) {
    await UserModel.findOneAndUpdate(
      { username },
      { password: newPassword, updatedAt: new Date().getTime() }
    )
      .then((result) => res.json(result))
      .catch((error) => res.json({ error: error }));
  }
});

app.get("/users/:username", (req, res) => {
  const { username } = req.params;

  UserModel.findOne({
    username: username,
  })
    .then((user) => {
      if (user) {
        res.json({
          name: user.name,
          username: user.username,
        });
      } else {
        res.status(403).json({
          error: "Pengguna tidak ditemukan.",
        });
      }
    })
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
          name: user.name,
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

app.post("/register", async (req, res) => {
  const { name, username, password } = req.body;

  await UserModel.findOne({
    username: username,
  }).then(async (user) => {
    if (user) {
      res.status(403).json({
        error: "Maaf, username sudah digunakan. Silakan gunakan username lain.",
      });
    } else {
      await UserModel.create({
        ...{ name, username, password },
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      })
        .then(() =>
          res.json({
            name,
            username,
          })
        )
        .catch((error) => res.json({ error: error }));
    }
  });
});

app.listen(3001, () => {
  console.log("server is running");
});
