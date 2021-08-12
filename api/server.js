const express = require("express");

const Hobbit = require("./hobbits/hobbits-model.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

server.get("/hobbits", (req, res) => {
  Hobbit.getAll()
    .then(hobbits => {
      res.status(200).json(hobbits);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/hobbits/:id", (req, res) => {
  Hobbit.getById(req.params.id)
    .then(hobbit => {
      if (hobbit) {
        res.json(hobbit);
      } else {
        res.status(404).json({ message: 'Hobbit not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
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
