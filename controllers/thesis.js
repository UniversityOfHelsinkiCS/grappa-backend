"use strict";

const Reminder = require("../services/EmailReminder");
const TokenGen = require("../services/TokenGenerator");

const Thesis = require("../models/Thesis");
const EthesisToken = require("../models/EthesisToken");
const ThesisProgress = require("../models/ThesisProgress");
const CouncilMeeting = require("../models/CouncilMeeting");
const StudyField = require("../models/StudyField");
const Grader = require("../models/Grader");

module.exports.findAllByUserRole = (req, res) => {
  Thesis
  .findAllByUserRole(req.user)
  .then(theses => {
    res.status(200).send(theses);
  })
  // .catch(err => {
  //   res.status(500).send({
  //     message: "Thesis findAllByUserRole produced an error",
  //     error: err,
  //   });
  // });
};

module.exports.saveOne = (req, res) => {
  let savedThesis;
  let savedGraders;
  let foundConnections;

  Thesis
  .findConnections(req.body)
  .then(connections => {
    if (connections[0] === null) {
      throw new TypeError("ValidationError: No such CouncilMeeting found");
    } else if (connections[1] === null) {
      throw new TypeError("ValidationError: No such StudyField found");
    }
    foundConnections = connections;
    if (req.body.graders === undefined) {
      return;
    }
    return Promise.all(
      req.body.graders.map(grader =>
        Grader.findOrCreate(grader)
      )
    );
  })
  .then((graders) => {
    savedGraders = graders;
    return Thesis.saveOne(req.body, foundConnections[0]);
  })
  .then(thesis => {
    console.log("joo");
    savedThesis = thesis;
    const token = TokenGen.generateEthesisToken(thesis.author, thesis.id);
    return Promise.all([
      EthesisToken.saveOne({
        thesisId: thesis.id,
        token,
      }),
      Reminder.sendStudentReminder(thesis.authorEmail, token, thesis.id),
      ThesisProgress.saveFromThesis(thesis),
      CouncilMeeting.linkThesis(foundConnections[0], thesis),
      Grader.linkThesisToGraders(savedGraders, thesis.id),
      Thesis.linkStudyField(thesis, foundConnections[1].id),
      Thesis.linkUser(thesis, req.user.id),
    ]);
  })
  .then(() => {
    console.log("joo");
    if (ThesisProgress.isGraderEvaluationNeeded(savedThesis.id, req.body.graders)) {
      return Reminder.sendProfessorReminder(savedThesis);
    } else {
      return ThesisProgress.setGraderEvalDone(savedThesis.id);
    }
  })
  .then(() => {
    res.status(200).send(savedThesis);
  });
  // .catch(err => {
  //   if (err.message.indexOf("ValidationError") !== -1) {
  //     res.status(400).send({
  //       message: "Thesis saveOne failed validation",
  //       error: err.message,
  //     });
  //   } else {
  //     res.status(500).send({
  //       message: "Thesis saveOne produced an error",
  //       error: err.message,
  //     });
  //   }
  // });
};

module.exports.updateOneAndConnections = (req, res) => {
  Thesis
   .update(req.body, { id: req.body.id })
  //  .then(thesis => ThesisProgress.setEthesisDone(thesis_id))
   .then(() => {
     res.status(200).send();
   })
   .catch(err => {
     res.status(500).send({
       message: "Thesis update produced an error",
       error: err,
     });
   });
};

module.exports.updateOneEthesis = (req, res) => {
  const thesis_id = TokenGen.decodeEthesisToken(req.body.token).thesisId;
  Thesis
   .update(req.body.thesis, { id: thesis_id })
   .then(thesis => ThesisProgress.setEthesisDone(thesis_id))
   .then(() => {
     res.status(200).send();
   })
   .catch(err => {
     res.status(500).send({
       message: "Thesis update produced an error",
       error: err,
     });
   });
};
