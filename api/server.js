const express = require("express");
const Hobbit = require("./hobbits/hobbits-model.js");

//----------------------------------------------------------------------------//
// Note that we are not "server.listen()"ing in this file. This is important,
// because the jest test files that we will define need to be able to get an
// instance of express with our defined/configured middleware and handlers, that
// is not listening on a port. If multiple tests tried to run using the same
// port, only the first one would be able to run and start listening.
//
// We use supertest in our test files to get a copy of the instance of express
// server that is exported from this file. Supertest automatically starts
// our express server on an "ephemeral" port
// (see https://en.wikipedia.org/wiki/Ephemeral_port).
//----------------------------------------------------------------------------//

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
        res.status(404).send({ message: 'Hobbit not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/hobbits", (req, res) => {
  Hobbit.insert(req.body)
    .then(hobbit => res.json(hobbit))
    .catch(error => {
      res.status(500).json(error);
    });
});

server.put("/hobbits/:id", (req, res) => {
  Hobbit.update(req.params.id, req.body)
    .then(hobbit => {
      if (hobbit) {
        res.json(hobbit);
      } else {
        res.status(404).send({ message: 'Hobbit not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.delete("/hobbits/:id", (req, res) => {
  Hobbit.remove(req.params.id)
    .then(result => {
      if (result) {
        res.json({ message: 'Success' });
      } else {
        res.status(404).send({ message: 'Hobbit not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = server;
