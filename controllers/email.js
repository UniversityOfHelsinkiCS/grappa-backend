"use strict";

const EmailReminder = require("../services/EmailReminder");
const SocketIOServer = require("../services/SocketIOServer");

const Thesis = require("../models/Thesis");

const errors = require("../config/errors");

module.exports.sendReminder = (req, res, next) => {
  let savedEmails;

  Thesis
    .findOne(req.body.thesisId)
    .then(thesis => {
      if (!thesis) {
        throw new errors.NotFoundError("No Thesis found with the provided thesisId.");
      } else {
        switch (req.body.reminderType) {
          case "EthesisReminder":
            return EmailReminder.sendEthesisReminder(thesis, thesis.CouncilMeeting);
          case "GraderEvalReminder":
            return EmailReminder.sendProfessorReminder(thesis);
          case "PrintReminder":
            return EmailReminder.sendPrintPersonReminder(thesis);
          case "StudentRegistrationNotification":
            if (req.user.role === "admin") {
              return EmailReminder.sendStudentNotification(thesis);
            } else {
              throw new errors.AuthenticationError("Student notifications only by admins.");
            }
          case "SupervisingProfessorNotification":
            return EmailReminder.sendSupervisingProfessorNotification(thesis);
          default:
            // should never end up here as bodyValidations forbid that
            throw new errors.BadRequestError("Invalid reminderType.");
        }
      }
    })
    .then(emailStatus => {
      if (emailStatus instanceof Array) {
        savedEmails = emailStatus;
      } else {
        savedEmails = [emailStatus]
      }
      return SocketIOServer.broadcast(["admin"], [{
        type: "SEND_REMINDER_SUCCESS",
        payload: savedEmails,
        notification: `Admin ${req.user.fullname} sent a Reminder`,
      }], req.user)
    })
    .then(() => {
      res.status(200).send(savedEmails);
    })
    .catch(err => next(err));
};
