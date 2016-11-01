"use strict";

const moment = require("moment");

const Sender = require("./EmailSender");
const TokenGen = require("../services/TokenGenerator");

const User = require("../models/User");
const Thesis = require("../models/Thesis");
const ThesisProgress = require("../models/ThesisProgress");
const ThesisReview = require("../models/ThesisReview");
const EmailStatus = require("../models/EmailStatus");
const EmailDraft = require("../models/EmailDraft");

const errors = require("../config/errors");

class EmailReminder {

  sendMail(toEmail, emailDraft, thesis, customBody, attachments) {
    let savedEmail;
    return Sender.sendEmail(toEmail, emailDraft.title, customBody, attachments)
      .then(() => EmailStatus.saveOne({
        lastSent: Date.now(),
        type: emailDraft.type,
        to: toEmail,
        EmailDraftId: emailDraft.id,
        ThesisId: thesis.id
      }))
      .then(email => {
        savedEmail = email;
        const update = {};
        update[`${emailDraft.type}Id`] = email.id;
        return ThesisProgress.update(update, { ThesisId: thesis.id });
      })
      .then(rows => savedEmail);
  }

  /**
   * Sends an email reminder to student about submitting their thesis to https://helda.helsinki.fi
   */
  sendEthesisReminder(thesis, councilmeeting) {
    let attachments;
    const token = TokenGen.generateEthesisToken(thesis);

    return ThesisReview.findOne({ ThesisId: thesis.id})
      .then(review => {
        attachments = [{
          filename: "thesis-review.pdf",
          content: new Buffer(review.pdf, "base64"),
          contentType: "application/pdf",
        }];
        return EmailDraft.findOne({ type: "EthesisReminder" });
      })
      .then(draft => {
        if (draft) {
          let body = draft.body.replace("$LINK$", `${process.env.APP_URL}/ethesis/${token}`);
          body = body.replace("$VAR1$", moment(councilmeeting.studentDeadline).lang("fi").format("HH:mm DD/MM/YYYY"));
          return this.sendMail(thesis.authorEmail, draft, thesis, body, attachments);
        } else {
          throw new errors.PremiseError("EthesisReminder not found from EmailDrafts");
        }
      })
  }

  /**
   * Sends an email to print-person about thesis being ready to print for the councilmeeting
   */
  sendPrintPersonReminder(thesis) {
    let foundPrintPersons;

    return User.findAll({ role: "print-person", isActive: true, isRetired: false })
      .then(printPersons => {
        if (printPersons.length > 0) {
          foundPrintPersons = printPersons;
          return EmailDraft.findOne({ type: "PrintReminder" });
        } else {
          throw new errors.PremiseError("No print-persons found.");
        }
      })
      .then(draft => {
        if (draft) {
          return Promise.all(foundPrintPersons.map(printPerson =>
            this.sendMail(printPerson.email, draft, thesis, draft.body, undefined)
          ))
        } else {
          throw new errors.PremiseError("PrintReminder not found from EmailDrafts");
        }
      })
  }

  /**
   * Sends an email reminder to the professor about thesis studyfield for reviewing
   */
  sendProfessorReminder(thesis) {
    let foundProfessor;

    return User.findOne({ role: "professor", StudyFieldId: thesis.StudyFieldId, isActive: true, isRetired: false })
      .then(professor => {
        if (professor) {
          foundProfessor = professor;
          return EmailDraft.findOne({ type: "GraderEvalReminder" });
        } else {
          throw new errors.PremiseError("StudyField had no professor to whom send grader evaluation reminder.");
        }
      })
      .then(draft => {
        if (draft) {
          const body = draft.body.replace("$LINK$", `${process.env.APP_URL}/thesis/${thesis.id}`);
          return this.sendMail(thesis.authorEmail, draft, thesis, body, undefined);
        } else {
          throw new errors.PremiseError("GraderEvalReminder not found from EmailDrafts");
        }
      })
      // .then(reminder => {
      //   if (reminder) {
      //     foundDraft = reminder;
      //     const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/thesis/${thesis.id}`);
      //     return Sender.sendEmail(foundProfessor.email, reminder.title, body);
      //   } else {
      //     throw new errors.PremiseError("GraderEvalReminder not found from EmailDrafts");
      //   }
      // })
      // .then(() => EmailStatus.saveOne({
      //   lastSent: Date.now(),
      //   type: "GraderEvalReminder",
      //   to: foundProfessor.email,
      //   deadline: thesis.deadline,
      //   EmailDraftId: foundDraft.id,
      // }))
      // .then(reminder => {
      //   savedReminder = reminder;
      //   return ThesisProgress.update({ GraderEvalEmailId: reminder.id }, { ThesisId: thesis.id });
      // })
      // .then(rows => {
      //   return savedReminder;
      // });
  }

  sendResetPasswordMail(user) {
    const token = TokenGen.generateResetPasswordToken(user);

    return EmailDraft.findOne({ type: "ResetPassword" })
      .then(reminder => {
        if (reminder) {
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/reset-password/${token}`);
          return Sender.sendEmail(user.email, reminder.title, body);
        } else {
          throw new errors.PremiseError("ResetPassword not found from EmailDrafts");
        }
      })
  }

  sendNewPasswordMail(user, password) {
    return EmailDraft.findOne({ type: "NewPassword" })
      .then(reminder => {
        if (reminder) {
          const body = reminder.body.replace("$LINK$", `${process.env.APP_URL}/reset-password/${token}`);
          return Sender.sendEmail(user.email, reminder.title, body);
        } else {
          throw new errors.PremiseError("NewPassword not found from EmailDrafts");
        }
      })
  }
}

module.exports = new EmailReminder();
