"use strict";

const Models = require("./tables.js").Models;
const Validator = require("./base_validator");

class BaseModel {
  constructor(modelname) {
    this.modelname = modelname;
    this.Models = Models;
    this.Validator = Validator;
  }
  getModel() {
    return this.Models[this.modelname];
  }
  findOne(params) {
    return this.Models[this.modelname].findOne({ where: params });
  }
  /*
   * Returns all the rows from a table.
   *
   * Basically SELECT * FROM @this.modelname
   *
   * @table {String} name of the table/model
   * @return Promise
   */
  findAll() {
    return this.Models[this.modelname].findAll();
  }
  /*
   * Creates new instance of table with validated(!) @params.
   *
   * Kinda like INSERT (@params) INTO @modelname RETURNING ID
   *
   * @modelname {String} name of the table/model
   * @params {Object} values to add
   * @return Promise
   */
  saveOne(params) {
    return this.Models[this.modelname].create(params);
  }
  drop() {
    return this.Models[this.modelname].destroy({ where: {} });
  }
  /*
   * Updates a field
   */
  update(values, params) {
    return this.Models[this.modelname].update(values, { where: params });
  }
}

module.exports = BaseModel;
