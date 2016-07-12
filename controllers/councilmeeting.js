"use strict";

const CouncilMeeting = require("../models/CouncilMeeting");

module.exports.findAll = (req, res) => {
  CouncilMeeting
  .findAll()
  .then(cmeetings => {
    res.status(200).send(cmeetings);
  })
  .catch(err => {
    res.status(500).send({
      message: "CouncilMeeting findAll produced an error",
      error: err,
    });
  });
};

module.exports.saveOne = (req, res) => {
  CouncilMeeting
  .checkIfExists(req.body)
  .then(exists => {
    if (exists) {
      res.status(400).send({
        location: "CouncilMeeting saveOne checkIfExists true",
        message: "There already exists a meeting with the same date.",
        error: {},
      });
      return;
    } else {
      return CouncilMeeting.saveOne(req.body);
    }
  })
  .then(cmeeting => {
    res.status(200).send(cmeeting);
  })
  .catch(err => {
    res.status(500).send({
      location: "CouncilMeeting saveOne .catch",
      message: "Saving a CouncilMeeting caused an internal server error.",
      error: err,
    });
  });
};
