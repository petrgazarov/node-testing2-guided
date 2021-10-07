const express = require("express");

const Hobbits = require("./hobbits/hobbits-model.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

server.get("/hobbits", (req, res) => {
  Hobbits.getAll()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/hobbits/:id", (req, res, next) => {
  const { id } = req.params;

  Hobbits
    .getById(id)
    .then(hobbit => {
      if (hobbit) {
        res.json(hobbit);
      } else {
        res.status(404).json({ message: 'Hobbit not found' });
      }
    })
    .catch(next);
});

server.post("/hobbits", (req, res) => {
  res.end()
});

server.delete("/hobbits/:id", (req, res) => {
  res.end()
});

server.put("/hobbits/:id", (req, res) => {
  res.end()
});

module.exports = server;
