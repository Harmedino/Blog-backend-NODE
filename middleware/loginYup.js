const yup = require("yup");

const loginSchemaValidate = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    ),
  password: yup.string().required(),
});

module.exports = { loginSchemaValidate };
