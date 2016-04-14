const Sequelize = require("sequelize");
const seq = require("../db/db_connection").sequalize;

const User = seq.define("User", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  title: Sequelize.STRING,
  email: Sequelize.STRING,
  admin: { type: Sequelize.BOOLEAN, defaultValue: false },
});
const Thesis = seq.define("Thesis", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  author: Sequelize.STRING,
  email: Sequelize.STRING,
  title: Sequelize.STRING,
  urkund: Sequelize.STRING,
  ethesis: Sequelize.STRING,
  abstract: Sequelize.TEXT,
  grade: Sequelize.STRING,
  deadline: Sequelize.DATE,
});
const Grader = seq.define("Grader", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
  title: Sequelize.STRING,
});
const CouncilMeeting = seq.define("CouncilMeeting", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  date: Sequelize.DATE,
});
const StudyField = seq.define("StudyField", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  name: Sequelize.STRING,
});
const Review = seq.define("Review", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  author: Sequelize.STRING,
  text: Sequelize.TEXT,
});
const ThesisProgress = seq.define("ThesisProgress", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  thesisId: Sequelize.INTEGER,
  ethesisReminder: Sequelize.DATE,
  professorReminder: Sequelize.DATE,
  gradersStatus: { type: Sequelize.BOOLEAN, defaultValue: false },
  documentsSent: Sequelize.DATE,
  isDone: { type: Sequelize.BOOLEAN, defaultValue: false },
});
const EmailStatus = seq.define("EmailStatus", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  lastSent: Sequelize.DATE,
  type: Sequelize.STRING,
  to: Sequelize.STRING,
  whoAddedEmail: Sequelize.STRING, // vai User
  deadline: Sequelize.DATE,
  wasError: { type: Sequelize.BOOLEAN, defaultValue: false },
});

Thesis.belongsToMany(User, { through: "UserTheses" });
Thesis.belongsTo(StudyField);

Review.belongsTo(Thesis);
Review.belongsTo(User);

Grader.belongsToMany(Thesis, { through: "GraderThesis" });
Thesis.belongsToMany(Grader, {through: "GraderThesis"});

CouncilMeeting.hasMany(Thesis, { as: "Theses" });

User.belongsTo(StudyField);

Thesis.hasMany(Review);

User.hasMany(Thesis);
User.hasMany(Review);

StudyField.hasMany(Thesis);
StudyField.hasMany(User);

/*
Use force here if you want to modify tables
For clearing and adding testdata force is not needed
*/
//seq.sync({ force: true });
seq.sync();

module.exports.sync = () => {
  seq.sync();
};
module.exports.sync.force= () => {
  seq.sync({ force: true });
};

module.exports = {
  User,
  Thesis,
  Grader,
  CouncilMeeting,
  StudyField,
  Review,
  ThesisProgress,
  EmailStatus,
};
