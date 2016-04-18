"use strict";

const tables = require("../models/tables");
const models = tables.Models;

module.exports.destroyTables = () => {
  return Promise.all(Object.keys(models).map(key => {
    if ({}.hasOwnProperty.call(models, key)) {
      return models[key].destroy({ where: {} });
    }
  }));
};

module.exports.createTables = () => {
  return tables.syncForce();
  // return tables.sync();
};


module.exports.dropTables = () => {
  return Promise.all(Object.keys(models).map(key => {
    return models[key].drop({ cascade: true });
  }));
};

module.exports.addTestData = () => Promise.all([
  models.StudyField.create({
    name: "Algoritmit",
  }),
  models.User.create({
    id: 1,
    name: "Kjell Lemström",
    password: "asdf",
    email: "ohtugrappa@gmail.com",
    role: "admin",
    StudyFieldId: null,
  }),
  models.User.create({
    id: 2,
    name: "B Virtanen",
    password: "asdf",
    email: "ohtugrappa2@gmail.com",
    role: "print-person",
    StudyFieldId: null,
  }),
  models.User.create({
    id: 3,
    name: "Tohtori Sykerö",
    password: "asdfasdf",
    email: "ohtugrappa3@gmail.com",
    role: "professor",
    StudyFieldId: 1,
  }),
  models.User.create({
    id: 4,
    name: "Alikersantti Rokka",
    password: "asdfasdfasdf",
    email: "ohtugrappa4@gmail.com",
    role: "instructor",
    StudyFieldId: 1,
  }),
  models.Thesis.create({
    author: "Pekka Graduttaja",
    email: "ohtugrappa@gmail.com",
    title: "Oliko Jeesus olemassa",
    urkund: "urkunlinkki.com",
    ethesis: "ethesislinkki.com",
    abstract: "Abstract from ethesis blaablaa",
    grade: "Laudatur",
    UserId: 4,
  }),
  models.ThesisProgress.create({
    thesisId: "1",
    ethesisReminder: Date.now(),
    professorReminder: Date.now(),
    documentsSent: Date.now(),
  }),
  models.Review.create({
    author: "Kumpulan Kuningas",
    text: "Sup dawg.",
    UserId: 3,
  }),
  models.Review.create({
    author: "Mr. Isokiho Proffa",
    text: "Aika heikko suoritus. Arvioijat täysin ala-arvoisia.",
    UserId: 3,
  }, { include: [models.User]}),
  models.Grader.create({
    name: "Mr. Grader2",
    title: "Professor of internet",
  }),
  models.CouncilMeeting.create({
    date: new Date("1.1.2016"),
  }),
  models.CouncilMeeting.create({
    date: Date.now(),
  }),
  models.ThesisProgress.create({
    thesisId: 1,
    ethesisReminder: Date.now(),
    professorReminder: Date.now(),
    gradersStatus: false,
    documentsSent: Date.now(),
    isDone: false,
  }),
  models.EmailStatus.create({
    lastSent: Date.now(),
    type: "StudentReminder",
    to: "asdf@asdfasdf.com",
    whoAddedEmail: "ohtugrappa@gmail.com", // vai User
    deadline: new Date("1 1 2017"),
    wasError: true,
  })
]);

module.exports.dump = () => {
  return Promise.all(Object.keys(models).map(key => {
    if ({}.hasOwnProperty.call(models, key)) {
      return models[key].findAll();
    }
  }));
};

module.exports.dropAndCreateTables = () => {
  return module.exports.createTables()
    .then(() => module.exports.addTestData() )
    .then(() => {
      console.log("Dropped and created models with test data succesfully!");
    })
    .catch((err) => {
      console.log("dropAndCreateTables produced an error!");
      console.log(err);
    })
}

module.exports.resetTestData = () => {
  module.exports.destroyTables()
  .then(() => module.exports.addTestData() )
  .then(() => {
    console.log("Resetted the database with test data successfully!");
  })
  .catch(err => {
    console.log("resetTestData produced an error!");
    console.log(err);
  });
}
