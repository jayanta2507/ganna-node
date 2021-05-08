module.exports.validate = (schema, property) => {
    return (req, res, next) => {
      // const { error } = Joi.validate(req.body, schema);
      const { error } = schema.validate(req[property]);
      const valid = error == null;
      if (valid) {
        next();
      } else {
        const { details } = error;
        const message = details.map(i => i.message).join(',');
        res.status(422).json({
          status: 422,
          msg: message.replace(/[\\"]/g, ""),
          data: {},
          purpose: "Validation Error"
        })
      }
    }
}