"use strict";

const tables = require("../models/tables");
const models = tables.Models;
const Grader = require("../models/grader");

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
    id: 1,
    name: "Algorithmic Bioinformatics",
  }),
  models.StudyField.create({
    id: 2,
    name: "Algorithms, Data Analytics and Machine Learning",
  }),
  models.StudyField.create({
    id: 3,
    name: "Networking and Services",
  }),
  models.StudyField.create({
    id: 4,
    name: "Software Systems",
  }),
  models.User.create({
    name: "Kjell Lemström",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa@gmail.com",
    role: "admin",
    isActive: true,
    StudyFieldId: null,
  }),
]);

module.exports.addTestDataOld = () => Promise.all([
  models.CouncilMeeting.create({
    id: 1,
    date: Date.now(),
  }),
  models.StudyField.create({
    id: 1,
    name: "Algorithmic Bioinformatics",
  }),
  models.StudyField.create({
    id: 2,
    name: "Algorithms, Data Analytics and Machine Learning",
  }),
  models.StudyField.create({
    id: 3,
    name: "Networking and Services",
  }),
  models.StudyField.create({
    id: 4,
    name: "Software Systems",
  }),
  /* USE PASSWORD 'asdf' for all users! The hash stored for these users
  is for asdf    */
  models.User.create({
    id: 1,
    name: "Kjell Lemström",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa@gmail.com",
    role: "admin",
    isActive: true,
    StudyFieldId: null,
  }),
  models.User.create({
    id: 2,
    name: "B Virtanen",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa2@gmail.com",
    role: "print-person",
    isActive: false,
    StudyFieldId: null,
  }),
  models.User.create({
    id: 3,
    name: "Tohtori Sykerö",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa3@gmail.com",
    role: "professor",
    isActive: false,
    StudyFieldId: 1,
  }),
  models.User.create({
    id: 4,
    name: "Tohtori Outolempi",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa4@gmail.com",
    role: "professor",
    isActive: false,
    StudyFieldId: 2,
  }),
  models.User.create({
    id: 7,
    name: "Tohtori Uusinimi",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa45@gmail.com",
    role: "professor",
    isActive: false,
    StudyFieldId: 3,
  }),
  models.User.create({
    id: 8,
    name: "Tohtori JokuNimi",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa44@gmail.com",
    role: "professor",
    isActive: false,
    StudyFieldId: 4,
  }),
  models.User.create({
    id: 5,
    name: "Alikersantti Rokka",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa5@gmail.com",
    role: "instructor",
    isActive: false,
    StudyFieldId: 1,
  }),
  models.User.create({
    id: 6,
    name: "Vänrikki Koskela",
    passwordHash: "$2a$10$Fs0N7KD/xUH4NAfW2s1MoOh/yH3G7mAtGycMY5tMUvCGqiWWdaSue",
    email: "ohtugrappa6@gmail.com",
    role: "instructor",
    isActive: false,
    StudyFieldId: 2,
  }),
  models.Thesis.create({
    id: 1,
    author: "Pekka Graduttaja",
    email: "ohtugrappa@gmail.com",
    title: "Oliko Jeesus olemassa",
    urkund: "urkunlinkki.com",
    ethesis: "ethesislinkki.com",
    abstract: "Abstract from ethesis blaablaa",
    grade: "Laudatur",
    graderEvaluation: "I think these graders are great because of things and stuff!",
    UserId: 4,
    StudyFieldId: 1,
    CouncilMeetingId: 1,
  }),
  models.Thesis.create({
    id: 2,
    author: "Matti Vanhanen",
    email: "ohtugrappa@gmail.com",
    title: "Paljon lautakasa maksaa",
    urkund: "urkunlinkki.com",
    ethesis: "ethesislinkki.com",
    abstract: "Abstract from ethesis blaablaa",
    grade: "Approbatur",
    graderEvaluation: "These two graders are not good enough :(",
    UserId: 6,
    StudyFieldId: 2,
    CouncilMeetingId: 1,
  }),
  models.Review.create({
    id: 1,
    author: "Kumpulan Kuningas",
    text: "Sup dawg.",
    UserId: 3,
    // ThesisId: 1,
  }),
  models.Review.create({
    id: 2,
    author: "Mr. Isokiho Proffa",
    text: "Aika heikko suoritus. Arvioijat täysin ala-arvoisia.",
    UserId: 4,
    // ThesisId: 2,
  }),
  models.Grader.create({
    name: "Mr. Grader",
    title: "Prof",
  }),
  models.Grader.create({
    name: "some dude",
    title: "Other",
  }),
  models.ThesisProgress.create({
    thesisId: 1,
    ethesisReminder: Date.now(),
    professorReminder: Date.now(),
    gradersStatus: false,
    documentsSent: Date.now(),
    isDone: false,
  }),
  models.ThesisProgress.create({
    thesisId: 2,
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
])
// add connections here
.then((createdTables) => {
  const graders = createdTables.filter(table => {
    if (table.$modelOptions.name.singular === "Grader") {
      return table;
    }
  });
  const theses = createdTables.filter(table => {
    if (table.$modelOptions.name.singular === "Thesis") {
      return table;
    }
  });
  return theses.map(thesis => Grader.linkThesisToGraders(thesis, graders));
});

module.exports.dump = () => {
  return Promise.all(Object.keys(models).map(key => {
    if ({}.hasOwnProperty.call(models, key)) {
      return models[key].findAll();
    }
  }));
};

module.exports.dropAndCreateTables = () => {
  return module.exports.createTables()
  .then(() => module.exports.addTestData())
  .then(() => {
    console.log("Dropped and created models with test data succesfully!");
  })
  .catch((err) => {
    console.log("dropAndCreateTables produced an error!");
    console.log(err);
  });
};

module.exports.resetTestData = () => {
  module.exports.destroyTables()
  .then(() => module.exports.addTestData())
  .then(() => {
    console.log("Resetted the database with test data successfully!");
  })
  .catch(err => {
    console.log("resetTestData produced an error!");
    console.log(err);
  });
};
