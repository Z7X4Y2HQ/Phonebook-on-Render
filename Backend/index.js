require("dotenv").config();
const Person = require("./Models/phonebook");
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.static("dist"));
app.use(express.json());

const url = "/api/persons/";

let total = 0;
Person.find({}).then((r) => {
  total = r.length;
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<h1>This Phonebook has info for ${total} people </br> ${date}</h1>`);
});

app.get(url, (req, res) => {
  Person.find({}).then((result) => {
    res.json(result);
  });
});

app.get(url + ":id", (req, res) => {
  Person.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => {
      res.send({ error: error.message });
    });
});

app.delete(url + ":id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

const outputError = (res, errorMsg) => {
  return res.status(400).json({
    error: errorMsg,
  });
};

app.post(url, (req, res) => {
  const body = req.body;

  if (!body.number && !body.name) {
    outputError(res, "Name and Number are missing");
  } else if (!body.name) {
    outputError(res, "Name is missing");
  } else if (!body.number) {
    outputError(res, "Number is missing");
  }

  const personObject = new Person({
    name: body.name,
    number: body.number,
  });

  personObject
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.status(400).send(error));
});

app.put(url + ":id", (req, res) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown Endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  res.status();
};

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening to app by express on port ${PORT}`);
});
