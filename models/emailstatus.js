"use strict";

const BaseModel = require("./base_model");

class EmailStatus extends BaseModel {
  constructor() {
    super("EmailStatus");
  }
}

module.exports = new EmailStatus();
