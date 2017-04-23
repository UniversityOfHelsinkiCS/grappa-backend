const inspector = require("schema-inspector");
const _ = require("lodash");

const sanitizations = require("../config/bodyValidations").sanitizations;
const validations = require("../config/bodyValidations").validations;
const errors = require("../config/errors");

/**
 * Validation for requests' JSON-bodies
 */
module.exports.validateBody = (name, schema) => (req, res, next) => {
  const sanitization = _.get(sanitizations, `${name}.${schema}`);
  if (sanitization) {
    inspector.sanitize(sanitization, req.body);
  }
  // console.log(req.body)
  const validation = _.get(validations, `${name}.${schema}`);
  if (validation) {
    const result = inspector.validate(validation, req.body);
    if (result.error.length !== 0) {
      // TODO Maybe generate the message according to the errors e.g.
      // "Request body failed validation for fields:
      // [email: required, password: minlen(8)]"
      // Now sends only the first error of the list.
      throw new errors.BadRequestError(result.error[0].message);
    }
  }
  next();
};
