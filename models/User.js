"use strict";

const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("User");
  }

  findAll() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "email", "name", "role", "isActive"],
      include: [{
        model: this.Models.Thesis,
        as: "Theses",
      }, {
        model: this.Models.StudyField,
      }],
    });
  }

  findAllNotActive() {
    return this.Models[this.modelname]
    .findAll({
      attributes: ["id", "email", "name", "role", "isActive"],
      where: {
        isActive: false,
      },
    });
  }
}

module.exports = new User();
