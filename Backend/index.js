const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const url = "/api/persons/";

app.get("/", (req, res) => {
  res.send("<h1>persons</h1>");
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<h1>Phonebook has info for ${persons.length} people</br> ${date}</h1>`);
});

app.get(url, (req, res) => {
  res.json(persons);
});

app.get(url + ":id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) {
    res.statusMessage = `person ${id} doesn't exist`;
    res.status(400).end();
  } else {
    res.json(person);
  }
});

// app.delete(url + ":id", (req, res) => {
//   const id = Number(req.params.id);
//   persons = persons.filter((p) => p.id !== id);
//   res.status(204).end();
// });

const generateRandom = () => {
  return Math.floor(Math.random() * 999999);
};
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
  } else if (persons.find((p) => p.name == body.name)) {
    outputError(res, "Name must be unique");
  }

  const person = {
    id: generateRandom(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`les gooooo ${PORT}`);
});
