"use strict";

const request = require("supertest");
const expect = require("chai").expect;
const sinon = require("sinon");

const app = require("../testhelper").app;

const authorizedAdmin = require("../mockdata/token").admin;

const ThesisController = require("../../controllers/thesis");

const Thesis = require("../../models/thesis");
const ThesisProgress = require("../../models/thesisprogress");
const CouncilMeeting = require("../../models/councilmeeting");
const Grader = require("../../models/grader");
const EthesisToken = require("../../models/ethesisToken");
const StudyField = require("../../models/studyfield");
const User = require("../../models/user");

const EmailReminder = require("../../services/EmailReminder");
const EmailSender = require("../../services/EmailSender");
const tokenGen = require("../../services/TokenGenerator");

const mockDB = require("../mockdata/database");

let linkStudyField;
let findOrCreateGrader;
let sendStudentReminder;
let sandbox;

describe("ThesisController", () => {

  before(function () {
    sandbox = sinon.sandbox.create();

    sandbox.stub(Thesis, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.thesis);
    });
    sandbox.stub(Thesis, "findAll", () => {
      return Promise.resolve(mockDB.theses);
    });
    sandbox.stub(Thesis, "findAllByUserRole", () => {
      return Promise.resolve(mockDB.theses);
    });
    sandbox.stub(Thesis, "findOne", () => {
      return Promise.resolve(mockDB.thesis);
    });
    linkStudyField = sandbox.stub(Thesis, "linkStudyField", (reqbody) => {
      return Promise.resolve();
    });
    sandbox.stub(ThesisProgress, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.thesisprogresses[0]);
    });
    sandbox.stub(ThesisProgress, "evaluateGraders", () => {
      return Promise.resolve();
    });
    sandbox.stub(CouncilMeeting, "findOne", (reqbody) => {
      return Promise.resolve(mockDB.councilmeeting);
    });
    sandbox.stub(CouncilMeeting, "saveOne", (reqbody) => {
      return Promise.resolve(mockDB.councilmeeting);
    });
    sandbox.stub(CouncilMeeting, "findAll", (reqbody) => {
      return Promise.resolve(mockDB.councilmeetings);
    });
    sandbox.stub(CouncilMeeting, "linkThesisToCouncilMeeting", () => {
      return Promise.resolve();
    });
    findOrCreateGrader = sandbox.stub(Grader, "findOrCreate", () => {
      return Promise.resolve();
    });
    sandbox.stub(Grader, "linkThesisToGraders", () => {
      return Promise.resolve();
    });
    sandbox.stub(Grader, "saveOne", (reqbody) => {
      return Promise.resolve();
    });
    sandbox.stub(EthesisToken, "saveOne", (reqbody) => {
      return Promise.resolve();
    });
    sendStudentReminder = sandbox.stub(EmailReminder, "sendStudentReminder", (reqbody) => {
      return Promise.resolve();
    });
    sandbox.stub(Thesis, "addUser", (reqbody) => {
      return Promise.resolve(mockDB.users[0]);
    });
  });

  after(function () {
    sandbox.restore();
  });

  describe("GET /thesis", () => {
    it("findAll should call Thesis-model correctly and return theses", (done) => {
      request(app)
      .get("/thesis")
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(200, mockDB.theses, done);
    });
    it("findOne should call Thesis-model correctly and return the correct thesis", (done) => {
      request(app)
      .get("/thesis/2000")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, mockDB.thesis, done);
    });
  });
  describe("POST /thesis (saveOne)", () => {
    it("should save thesis and return thesis", (done) => {
      request(app)
      .post("/thesis")
      .send({ name: "thesis to be saved" })
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(res => {
        console.log(res);
      })
      .expect(200, mockDB.thesis, done);
    });

    it("should add a new thesisprogress correctly", (done) => {
      let saveFromNewThesis = sinon.spy(ThesisProgress, "saveFromNewThesis");

      request(app)
      .post("/thesis")
      .send({ name: "thesis to be saved" })
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(saveFromNewThesis.calledWith(mockDB.thesis)).to.equal(true);
      })
      .expect(200, mockDB.thesis, done);
    });
    it("should create correct deadline", (done) => {
      let earlierDate = new Date(mockDB.thesis.deadline);
      earlierDate.setDate(earlierDate.getDate() - 10);
      earlierDate = earlierDate.toISOString();

      let setDeadline = sinon.spy(Thesis, "setDeadline10DaysBeforeCM");

      Thesis.setDeadline10DaysBeforeCM(mockDB.thesis.deadline);

      expect(setDeadline.calledWith(mockDB.thesis.deadline)).to.equal(true);
      expect(setDeadline.returned(earlierDate)).to.equal(true);
      done();
    });
    it("should add graders", (done) => {

      request(app)
      .post("/thesis")
      .send(mockDB.thesis)
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(res => {
        /* First value in first call of findOrCreate() */
        expect(findOrCreateGrader.args[0][0])
        .to.deep.equal(mockDB.thesis.graders[0]);
        /* First value in second call of findOrCreate() */
        expect(findOrCreateGrader.args[1][0])
        .to.deep.equal(mockDB.thesis.graders[1]);
      })
      .expect(200, mockDB.thesis, done);
    });

    it("should send reminder to student with correct token", (done) => {
      const token = tokenGen.generateEthesisToken(mockDB.thesis.author, mockDB.thesis.id);

      request(app)
      .post("/thesis")
      .send(mockDB.thesis)
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(sendStudentReminder.calledWith(mockDB.thesis.email, token)).to.equal(true);
      })
      .expect(200, mockDB.thesis, done);
    });

    it("should link studyfield correctly", (done) => {

      request(app)
      .post("/thesis")
      .send(mockDB.thesis)
      .set("Accept", "application/json")
      .set("X-Access-Token", authorizedAdmin.token)
      .set("X-Key", authorizedAdmin.id)
      .expect("Content-Type", /json/)
      .expect(res => {
        expect(linkStudyField.calledWith(mockDB.thesis, mockDB.thesis.StudyFieldId)).to.equal(true);
      })
      .expect(200, mockDB.thesis, done);
    });
  });
});
